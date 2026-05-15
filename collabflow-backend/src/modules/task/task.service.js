import prisma from "../../../prisma/client.js";
import { getIO } from "../../websocket/socket.js";

const createHttpError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const emitTaskEvent = ({ boardId, action, task }) => {
    getIO().to(`board:${boardId}`).emit("task", {
        action,
        task,
    });
};

const taskSelect = {
    id: true,
    title: true,
    description: true,
    position: true,
    columnId: true,
    createdAt: true,
    column: {
        select: {
            id: true,
            name: true,
            position: true,
            boardId: true,
            board: {
                select: {
                    id: true,
                    name: true,
                    workspaceId: true,
                    workspace: {
                        select: {
                            id: true,
                            name: true,
                            ownerId: true,
                        },
                    },
                },
            },
        },
    },
};

const assertColumnAccess = async ({ columnId, ownerId }, client = prisma) => {
    const column = await client.column.findFirst({
        where: {
            id: columnId,
            board: {
                workspace: {
                    ownerId,
                },
            },
        },
        select: {
            id: true,
            boardId: true,
        },
    });

    if (!column) {
        throw createHttpError("Column not found", 404);
    }

    return column;
};

const findTaskForOwner = async ({ taskId, ownerId }, client = prisma) => {
    const task = await client.task.findFirst({
        where: {
            id: taskId,
            column: {
                board: {
                    workspace: {
                        ownerId,
                    },
                },
            },
        },
        select: taskSelect,
    });

    if (!task) {
        throw createHttpError("Task not found", 404);
    }

    return task;
};

const getBoardIdForColumn = async (columnId, client = prisma) => {
    const column = await client.column.findUnique({
        where: { id: columnId },
        select: {
            boardId: true,
        },
    });

    if (!column) {
        throw createHttpError("Column not found", 404);
    }

    return column.boardId;
}

const getOrderedTasks = async ({ columnId }, client) => {
    return client.task.findMany({
        where: { columnId },
        orderBy: [
            { position: "asc" },
            { createdAt: "asc" },
            { id: "asc" },
        ],
        select: {
            id: true,
        },
    });
};

const normalizeColumnTaskPositions = async ({ columnId }, client) => {
    const tasks = await getOrderedTasks({ columnId }, client);

    await Promise.all(
        tasks.map((task, index) => client.task.update({
            where: { id: task.id },
            data: { position: index + 1 },
        })),
    );
};

const insertTaskAtPosition = async ({ taskId, columnId, position }, client) => {
    const tasks = await getOrderedTasks({ columnId }, client);
    const orderedTaskIds = tasks
        .map((task) => task.id)
        .filter((id) => id !== taskId);
    const insertionIndex = Math.min(position, orderedTaskIds.length);

    orderedTaskIds.splice(insertionIndex, 0, taskId);

    await Promise.all(
        orderedTaskIds.map((id, index) => client.task.update({
            where: { id },
            data: { position: index + 1 },
        })),
    );
};

export const createTask = async ({ title, description, columnId, ownerId }) => {
    const task = await prisma.$transaction(async (tx) => {
        await assertColumnAccess({ columnId, ownerId }, tx);

        const taskCount = await tx.task.count({
            where: { columnId },
        });

        const task = await tx.task.create({
            data: {
                title,
                description,
                columnId,
                position: taskCount + 1,
            },
            select: taskSelect,
        });

        return task;
    });

    emitTaskEvent({
        boardId: task.column.boardId,
        action: "created",
        task,
    });

    return task;
};

export const getTasksByColumn = async ({ columnId, ownerId }) => {
    await assertColumnAccess({ columnId, ownerId });

    return prisma.task.findMany({
        where: { columnId },
        orderBy: [
            { position: "asc" },
            { createdAt: "asc" },
        ],
        select: taskSelect,
    });
};

export const getTaskById = async ({ taskId, ownerId }) => {
    return findTaskForOwner({ taskId, ownerId });
};

export const updateTask = async ({ taskId, ownerId, data }) => {
    const task = await prisma.$transaction(async (tx) => {
        await findTaskForOwner({ taskId, ownerId }, tx);

        return tx.task.update({
            where: { id: taskId },
            data,
            select: taskSelect,
        });
    });

    emitTaskEvent({
        boardId: task.column.boardId,
        action: "updated",
        task,
    });

    return task;
};

export const deleteTask = async ({ taskId, ownerId }) => {
    const task = await prisma.$transaction(async (tx) => {
        const task = await findTaskForOwner({ taskId, ownerId }, tx);

        const deletedTask = await tx.task.delete({
            where: { id: taskId },
            select: taskSelect,
        });

        await normalizeColumnTaskPositions({ columnId: task.columnId }, tx);

        return deletedTask;
    });

    emitTaskEvent({
        boardId: task.column.boardId,
        action: "deleted",
        task,
    });

    return task;
};

export const moveTask = async ({
    taskId,
    sourceColumnId,
    targetColumnId,
    position,
    ownerId,
}) => {
    const task = await prisma.$transaction(async (tx) => {
        const task = await findTaskForOwner({ taskId, ownerId }, tx);

        if (task.columnId !== sourceColumnId) {
            throw createHttpError("Task does not belong to the source column", 400);
        }

        const sourceColumn = await assertColumnAccess({ columnId: sourceColumnId, ownerId }, tx);
        const targetColumn = await assertColumnAccess({ columnId: targetColumnId, ownerId }, tx);

        if (sourceColumn.boardId !== targetColumn.boardId) {
            throw createHttpError("Tasks can only move between columns on the same board", 400);
        }

        await tx.task.update({
            where: { id: taskId },
            data: {
                columnId: targetColumnId,
                position: 0,
            },
        });

        if (sourceColumnId !== targetColumnId) {
            await normalizeColumnTaskPositions({ columnId: sourceColumnId }, tx);
        }

        await insertTaskAtPosition({
            taskId,
            columnId: targetColumnId,
            position,
        }, tx);

        return tx.task.findUnique({
            where: { id: taskId },
            select: taskSelect,
        });
    });

    emitTaskEvent({
        boardId: task.column.boardId,
        action: "moved",
        task,
    });

    return task;
};

export const reorderTasks = async ({ tasks, ownerId }) => {
    const reorderedTasks = await prisma.$transaction(async (tx) => {
        const taskIds = tasks.map((task) => task.id);
        const existingTasks = await tx.task.findMany({
            where: {
                id: { in: taskIds },
                column: {
                    board: {
                        workspace: {
                            ownerId,
                        },
                    },
                },
            },
            select: {
                id: true,
                columnId: true,
            },
        });

        if (existingTasks.length !== taskIds.length) {
            throw createHttpError("One or more tasks were not found", 404);
        }

        const columnIds = new Set(existingTasks.map((task) => task.columnId));

        if (columnIds.size !== 1) {
            throw createHttpError("Tasks must belong to the same column", 400);
        }

        await Promise.all(
            tasks.map((task) => tx.task.update({
                where: { id: task.id },
                data: { position: task.position },
            })),
        );

        const [columnId] = columnIds;

        return tx.task.findMany({
            where: { columnId },
            orderBy: [
                { position: "asc" },
                { createdAt: "asc" },
            ],
            select: taskSelect,
        });
    });

    emitTaskEvent({
        boardId: reorderedTasks[0]?.column.boardId,
        action: "reordered",
        task: reorderedTasks,
    });

    return reorderedTasks;
};
