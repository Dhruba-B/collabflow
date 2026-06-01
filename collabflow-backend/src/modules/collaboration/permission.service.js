import prisma from "../../../prisma/client.js";

export const BOARD_ROLES = {
    OWNER: "OWNER",
    EDITOR: "EDITOR",
    VIEWER: "VIEWER",
};

export const BOARD_PERMISSIONS = {
    READ: "READ",
    WRITE: "WRITE",
    DELETE: "DELETE",
    MANAGE_COLLABORATORS: "MANAGE_COLLABORATORS",
};

const rolePermissions = {
    [BOARD_ROLES.OWNER]: new Set(Object.values(BOARD_PERMISSIONS)),
    [BOARD_ROLES.EDITOR]: new Set([
        BOARD_PERMISSIONS.READ,
        BOARD_PERMISSIONS.WRITE,
    ]),
    [BOARD_ROLES.VIEWER]: new Set([BOARD_PERMISSIONS.READ]),
};

export const createHttpError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const collaboratorSelect = {
    role: true,
    user: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};

export const getBoardAccess = async ({ boardId, userId }, client = prisma) => {
    const board = await client.board.findUnique({
        where: { id: boardId },
        select: {
            id: true,
            workspaceId: true,
            workspace: {
                select: {
                    ownerId: true,
                },
            },
            collaborators: {
                where: { userId },
                select: collaboratorSelect,
                take: 1,
            },
        },
    });

    if (!board) {
        throw createHttpError("Board not found", 404);
    }

    if (board.workspace.ownerId === userId) {
        return {
            boardId: board.id,
            workspaceId: board.workspaceId,
            role: BOARD_ROLES.OWNER,
            permissions: Array.from(rolePermissions[BOARD_ROLES.OWNER]),
        };
    }

    const collaborator = board.collaborators[0];

    if (!collaborator) {
        throw createHttpError("Board not found", 404);
    }

    return {
        boardId: board.id,
        workspaceId: board.workspaceId,
        role: collaborator.role,
        permissions: Array.from(rolePermissions[collaborator.role]),
    };
};

export const assertBoardPermission = async (
    { boardId, userId, permission },
    client = prisma,
) => {
    const access = await getBoardAccess({ boardId, userId }, client);

    if (!rolePermissions[access.role]?.has(permission)) {
        throw createHttpError("You do not have permission to perform this action", 403);
    }

    return access;
};

export const assertWorkspaceOwner = async ({ workspaceId, userId }, client = prisma) => {
    const workspace = await client.workspace.findFirst({
        where: {
            id: workspaceId,
            ownerId: userId,
        },
        select: { id: true },
    });

    if (!workspace) {
        throw createHttpError("Workspace not found", 404);
    }

    return workspace;
};

export const getBoardIdForColumn = async (columnId, client = prisma) => {
    const column = await client.column.findUnique({
        where: { id: columnId },
        select: { boardId: true },
    });

    if (!column) {
        throw createHttpError("Column not found", 404);
    }

    return column.boardId;
};

export const getBoardIdForTask = async (taskId, client = prisma) => {
    const task = await client.task.findUnique({
        where: { id: taskId },
        select: {
            column: {
                select: {
                    boardId: true,
                },
            },
        },
    });

    if (!task) {
        throw createHttpError("Task not found", 404);
    }

    return task.column.boardId;
};
