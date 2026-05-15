import prisma from "../../../prisma/client.js";
import { getIO } from "../../websocket/socket.js";

const createHttpError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const emitWorkspaceEvent = ({ action, workspace }) => {
    getIO().to("workspace-list").emit("workspace", {
        action,
        workspace,
    });
};

const workspaceSelect = {
    id: true,
    name: true,
    ownerId: true,
    createdAt: true,
    owner: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
    _count: {
        select: {
            boards: true,
        },
    },
};

export const createWorkspace = async ({ name, ownerId }) => {
    const workspace = await prisma.workspace.create({
        data: {
            name,
            ownerId,
        },
        select: workspaceSelect,
    });

    emitWorkspaceEvent({
        action: "created",
        workspace,
    });

    return workspace;
};

export const getWorkspacesByOwner = async (ownerId) => {
    return prisma.workspace.findMany({
        where: { ownerId },
        orderBy: { createdAt: "desc" },
        select: workspaceSelect,
    });
};

export const getWorkspaceById = async ({ workspaceId, ownerId }) => {
    const workspace = await prisma.workspace.findFirst({
        where: {
            id: workspaceId,
            ownerId,
        },
        select: {
            ...workspaceSelect,
            boards: {
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                },
            },
        },
    });

    if (!workspace) {
        throw createHttpError("Workspace not found", 404);
    }

    return workspace;
};

export const deleteWorkspace = async ({ workspaceId, ownerId }) => {
    const workspace = await prisma.$transaction(async (tx) => {
        const workspace = await tx.workspace.findFirst({
            where: {
                id: workspaceId,
                ownerId,
            },
            select: {
                ...workspaceSelect,
                boards: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!workspace) {
            throw createHttpError("Workspace not found", 404);
        }

        const boardIds = workspace.boards.map(
            (board) => board.id
        );

        await tx.task.deleteMany({
            where: {
                column: {
                    boardId: {
                        in: boardIds,
                    },
                },
            },
        });

        await tx.column.deleteMany({
            where: {
                boardId: {
                    in: boardIds,
                },
            },
        });

        await tx.board.deleteMany({
            where: {
                workspaceId,
            },
        });

        const deletedWorkspace =
            await tx.workspace.delete({
                where: {
                    id: workspaceId,
                },
                select: workspaceSelect,
            });

        return deletedWorkspace;
    });

    emitWorkspaceEvent({
        action: "deleted",
        workspace,
    });

    return workspace;
};
