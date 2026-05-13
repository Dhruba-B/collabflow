import prisma from "../../../prisma/client.js";

const createHttpError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
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
    return prisma.workspace.create({
        data: {
            name,
            ownerId,
        },
        select: workspaceSelect,
    });
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
