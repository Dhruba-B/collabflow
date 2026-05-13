import prisma from "../../../prisma/client.js";

const createHttpError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
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
    return prisma.$transaction(async (tx) => {
        await assertWorkspaceAccess({ workspaceId, ownerId }, tx);

        return tx.board.create({
            data: {
                name,
                workspaceId,
            },
            select: boardSelect,
        });
    });
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
    return prisma.$transaction(async (tx) => {
        await findBoardForOwner({ boardId, ownerId }, tx);

        return tx.board.update({
            where: { id: boardId },
            data: { name },
            select: boardSelect,
        });
    });
};

export const deleteBoard = async ({ boardId, ownerId }) => {
    return prisma.$transaction(async (tx) => {
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
};
