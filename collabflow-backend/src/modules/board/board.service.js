import prisma from "../../../prisma/client.js";
import { getIO } from "../../websocket/socket.js";
import {
    assertBoardPermission,
    assertWorkspaceOwner,
    BOARD_PERMISSIONS,
    createHttpError,
    getBoardAccess,
} from "../collaboration/permission.service.js";

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
    updatedAt: true,
    version: true,
};

const assertWorkspaceAccess = async ({ workspaceId, ownerId }, client = prisma) => {
    return assertWorkspaceOwner({ workspaceId, userId: ownerId }, client);
};

const findBoardForOwner = async ({ boardId, ownerId }, client = prisma) => {
    await assertBoardPermission({
        boardId,
        userId: ownerId,
        permission: BOARD_PERMISSIONS.DELETE,
    }, client);

    return client.board.findUnique({
        where: { id: boardId },
        select: boardSelect,
    });
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

export const getSharedBoards = async ({ userId }) => {
    const collaborations = await prisma.boardCollaborator.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        select: {
            role: true,
            board: {
                select: boardSelect,
            },
        },
    });

    return collaborations.map((collaboration) => ({
        ...collaboration.board,
        access: {
            boardId: collaboration.board.id,
            workspaceId: collaboration.board.workspaceId,
            role: collaboration.role,
            permissions:
                collaboration.role === "EDITOR"
                    ? ["READ", "WRITE"]
                    : ["READ"],
        },
    }));
};

export const getBoardById = async ({ boardId, ownerId }) => {
    const access = await getBoardAccess({
        boardId,
        userId: ownerId,
    });

    const board = await prisma.board.findUnique({
        where: { id: boardId },
        select: {
            ...boardSelect,
            columns: {
                orderBy: { position: "asc" },
                select: {
                    id: true,
                    name: true,
                    position: true,
                    createdAt: true,
                    updatedAt: true,
                    version: true,
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
                            updatedAt: true,
                            version: true,
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

    return {
        ...board,
        access,
    };
};

export const updateBoard = async ({ boardId, ownerId, name }) => {
    const board = await prisma.$transaction(async (tx) => {
        await assertBoardPermission({
            boardId,
            userId: ownerId,
            permission: BOARD_PERMISSIONS.DELETE,
        }, tx);

        return tx.board.update({
            where: { id: boardId },
            data: {
                name,
                version: {
                    increment: 1,
                },
            },
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

        await tx.boardCollaborator.deleteMany({
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
