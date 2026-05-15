import prisma from "../../../prisma/client.js";
import { getIO } from "../../websocket/socket.js";

const createHttpError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const emitBoardEvent = ({ workspaceId, action, board }) => {
    getIO().to(`workspace:${workspaceId}`).emit("board", {
        action,
        board,
    });
};

const boardSelect = {
    id: true,
    name: true,
    workspaceId: true,
    createdAt: true,
    workspace: {
        select: {
            id: true,
            name: true,
            ownerId: true,
        },
    },
    _count: {
        select: {
            columns: true,
        },
    },
};

const assertWorkspaceAccess = async ({ workspaceId, ownerId }, client = prisma) => {
    const workspace = await client.workspace.findFirst({
        where: {
            id: workspaceId,
            ownerId,
        },
        select: {
            id: true,
        },
    });

    if (!workspace) {
        throw createHttpError("Workspace not found", 404);
    }

    return workspace;
};

const findBoardForOwner = async ({ boardId, ownerId }, client = prisma) => {
    const board = await client.board.findFirst({
        where: {
            id: boardId,
            workspace: {
                ownerId,
            },
        },
        select: boardSelect,
    });

    if (!board) {
        throw createHttpError("Board not found", 404);
    }

    return board;
};

export const createBoard = async ({ name, workspaceId, ownerId }) => {
    const board = await prisma.$transaction(async (tx) => {
        await assertWorkspaceAccess({ workspaceId, ownerId }, tx);

        return tx.board.create({
            data: {
                name,
                workspaceId,
            },
            select: boardSelect,
        });
    });

    emitBoardEvent({
        workspaceId: board.workspaceId,
        action: "created",
        board,
    });

    return board;
};

export const getBoardsByWorkspace = async ({ workspaceId, ownerId }) => {
    await assertWorkspaceAccess({ workspaceId, ownerId });

    return prisma.board.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
        select: boardSelect,
    });
};

export const getBoardById = async ({ boardId, ownerId }) => {
    const board = await prisma.board.findFirst({
        where: {
            id: boardId,
            workspace: {
                ownerId,
            },
        },
        select: {
            ...boardSelect,
            columns: {
                orderBy: { position: "asc" },
                select: {
                    id: true,
                    name: true,
                    position: true,
                    createdAt: true,
                    tasks: {
                        orderBy: [
                            { position: "asc" },
                            { createdAt: "asc" },
                        ],
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            position: true,
                            columnId: true,
                            createdAt: true,
                        },
                    },
                    _count: {
                        select: {
                            tasks: true,
                        },
                    },
                },
            },
        },
    });

    if (!board) {
        throw createHttpError("Board not found", 404);
    }

    return board;
};

export const updateBoard = async ({ boardId, ownerId, name }) => {
    const board = await prisma.$transaction(async (tx) => {
        await findBoardForOwner({ boardId, ownerId }, tx);

        return tx.board.update({
            where: { id: boardId },
            data: { name },
            select: boardSelect,
        });
    });

    emitBoardEvent({
        workspaceId: board.workspaceId,
        action: "updated",
        board,
    });

    return board;
};

export const deleteBoard = async ({ boardId, ownerId }) => {
    const board = await prisma.$transaction(async (tx) => {
        await findBoardForOwner({ boardId, ownerId }, tx);

        await tx.task.deleteMany({
            where: {
                column: {
                    boardId,
                },
            },
        });

        await tx.column.deleteMany({
            where: { boardId },
        });

        return tx.board.delete({
            where: { id: boardId },
            select: boardSelect,
        });
    });

    emitBoardEvent({
        workspaceId: board.workspaceId,
        action: "deleted",
        board,
    });

    return board;
};
