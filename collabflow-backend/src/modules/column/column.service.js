import prisma from "../../../prisma/client.js";
import { getIO } from "../../websocket/socket.js";
import {
    assertBoardPermission,
    BOARD_PERMISSIONS,
    createHttpError,
} from "../collaboration/permission.service.js";

const emitColumnEvent = ({ boardId, action, column }) => {
    getIO().to(`board:${boardId}`).emit("column", {
        action,
        column,
    });
};

const columnSelect = {
    id: true,
    name: true,
    position: true,
    boardId: true,
    createdAt: true,
    updatedAt: true,
    version: true,
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
    _count: {
        select: {
            tasks: true,
        },
    },
};

const assertBoardAccess = async ({ boardId, ownerId }, client = prisma) => {
    return assertBoardPermission({
        boardId,
        userId: ownerId,
        permission: BOARD_PERMISSIONS.READ,
    }, client);
};

const findColumnForOwner = async ({ columnId, ownerId }, client = prisma) => {
    const column = await client.column.findFirst({
        where: {
            id: columnId,
        },
        select: columnSelect,
    });

    if (!column) {
        throw createHttpError("Column not found", 404);
    }

    await assertBoardPermission({
        boardId: column.boardId,
        userId: ownerId,
        permission: BOARD_PERMISSIONS.WRITE,
    }, client);

    return column;
};

const normalizeBoardColumnPositions = async ({ boardId }, client) => {
    const columns = await client.column.findMany({
        where: { boardId },
        orderBy: [
            { position: "asc" },
            { createdAt: "asc" },
            { id: "asc" },
        ],
        select: {
            id: true,
        },
    });

    await Promise.all(
        columns.map((column, index) => client.column.update({
            where: { id: column.id },
            data: {
                position: index + 1,
                version: {
                    increment: 1,
                },
            },
        })),
    );
};

export const createColumn = async ({ name, boardId, ownerId }) => {
    const column = await prisma.$transaction(async (tx) => {
        await assertBoardPermission({
            boardId,
            userId: ownerId,
            permission: BOARD_PERMISSIONS.WRITE,
        }, tx);

        const columnCount = await tx.column.count({
            where: { boardId },
        });

        return tx.column.create({
            data: {
                name,
                boardId,
                position: columnCount + 1,
            },
            select: columnSelect,
        });
    });

    emitColumnEvent({
        boardId: column.boardId,
        action: "created",
        column,
    });

    return column;
};

export const getColumnsByBoard = async ({ boardId, ownerId }) => {
    await assertBoardAccess({ boardId, ownerId });

    return prisma.column.findMany({
        where: { boardId },
        orderBy: [
            { position: "asc" },
            { createdAt: "asc" },
        ],
        select: columnSelect,
    });
};

export const updateColumn = async ({ columnId, ownerId, name }) => {
    const column = await prisma.$transaction(async (tx) => {
        await findColumnForOwner({ columnId, ownerId }, tx);

        return tx.column.update({
            where: { id: columnId },
            data: {
                name,
                version: {
                    increment: 1,
                },
            },
            select: columnSelect,
        });
    });

    emitColumnEvent({
        boardId: column.boardId,
        action: "updated",
        column,
    });

    return column;
};

export const deleteColumn = async ({ columnId, ownerId }) => {
    const column = await prisma.$transaction(async (tx) => {
        const column = await findColumnForOwner({ columnId, ownerId }, tx);

        await tx.task.deleteMany({
            where: { columnId },
        });

        const deletedColumn = await tx.column.delete({
            where: { id: columnId },
            select: columnSelect,
        });

        await normalizeBoardColumnPositions({ boardId: column.boardId }, tx);

        return deletedColumn;
    });

    emitColumnEvent({
        boardId: column.boardId,
        action: "deleted",
        column,
    });

    return column;
};

export const reorderColumns = async ({ columns, ownerId }) => {
    const reorderedColumns = await prisma.$transaction(async (tx) => {
        const columnIds = columns.map((column) => column.id);
        const existingColumns = await tx.column.findMany({
            where: {
                id: { in: columnIds },
            },
            select: {
                id: true,
                boardId: true,
            },
        });

        if (existingColumns.length !== columnIds.length) {
            throw createHttpError("One or more columns were not found", 404);
        }

        const boardIds = new Set(existingColumns.map((column) => column.boardId));

        if (boardIds.size !== 1) {
            throw createHttpError("Columns must belong to the same board", 400);
        }

        const [boardId] = boardIds;

        await assertBoardPermission({
            boardId,
            userId: ownerId,
            permission: BOARD_PERMISSIONS.WRITE,
        }, tx);

        await Promise.all(
            columns.map((column) => tx.column.update({
                where: { id: column.id },
                data: {
                    position: column.position,
                    version: {
                        increment: 1,
                    },
                },
            })),
        );

        return tx.column.findMany({
            where: { boardId },
            orderBy: [
                { position: "asc" },
                { createdAt: "asc" },
            ],
            select: columnSelect,
        });
    });

    emitColumnEvent({
        boardId: reorderedColumns[0]?.boardId,
        action: "reordered",
        column: reorderedColumns,
    });

    return reorderedColumns;
};
