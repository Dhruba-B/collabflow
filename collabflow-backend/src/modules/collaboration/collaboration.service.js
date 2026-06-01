import prisma from "../../../prisma/client.js";
import { getIO } from "../../websocket/socket.js";
import {
    assertBoardPermission,
    BOARD_PERMISSIONS,
    BOARD_ROLES,
    createHttpError,
} from "./permission.service.js";

const collaboratorSelect = {
    id: true,
    boardId: true,
    userId: true,
    role: true,
    createdAt: true,
    updatedAt: true,
    user: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};

const emitCollaboratorEvent = ({ boardId, action, collaborator }) => {
    getIO().to(`board:${boardId}`).emit("collaborator", {
        action,
        collaborator,
    });
};

export const getBoardCollaborators = async ({ boardId, userId }) => {
    await assertBoardPermission({
        boardId,
        userId,
        permission: BOARD_PERMISSIONS.READ,
    });

    const board = await prisma.board.findUnique({
        where: { id: boardId },
        select: {
            workspace: {
                select: {
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            collaborators: {
                orderBy: { createdAt: "asc" },
                select: collaboratorSelect,
            },
        },
    });

    return [
        {
            id: `owner:${board.workspace.owner.id}`,
            boardId,
            userId: board.workspace.owner.id,
            role: BOARD_ROLES.OWNER,
            user: board.workspace.owner,
        },
        ...board.collaborators,
    ];
};

export const addBoardCollaborator = async ({ boardId, userId, email, role }) => {
    const collaborator = await prisma.$transaction(async (tx) => {
        await assertBoardPermission({
            boardId,
            userId,
            permission: BOARD_PERMISSIONS.MANAGE_COLLABORATORS,
        }, tx);

        const board = await tx.board.findUnique({
            where: { id: boardId },
            select: {
                workspace: {
                    select: {
                        ownerId: true,
                    },
                },
            },
        });

        const user = await tx.user.findUnique({
            where: { email },
            select: {
                id: true,
            },
        });

        if (!user) {
            throw createHttpError("No user exists with that email", 404);
        }

        if (user.id === board.workspace.ownerId) {
            throw createHttpError("Workspace owner already has owner access", 400);
        }

        return tx.boardCollaborator.upsert({
            where: {
                boardId_userId: {
                    boardId,
                    userId: user.id,
                },
            },
            update: { role },
            create: {
                boardId,
                userId: user.id,
                role,
            },
            select: collaboratorSelect,
        });
    });

    emitCollaboratorEvent({
        boardId,
        action: "upserted",
        collaborator,
    });

    return collaborator;
};

export const updateBoardCollaborator = async ({ boardId, actingUserId, userId, role }) => {
    const collaborator = await prisma.$transaction(async (tx) => {
        await assertBoardPermission({
            boardId,
            userId: actingUserId,
            permission: BOARD_PERMISSIONS.MANAGE_COLLABORATORS,
        }, tx);

        const existingCollaborator = await tx.boardCollaborator.findUnique({
            where: {
                boardId_userId: {
                    boardId,
                    userId,
                },
            },
            select: {
                id: true,
            },
        });

        if (!existingCollaborator) {
            throw createHttpError("Collaborator not found", 404);
        }

        return tx.boardCollaborator.update({
            where: {
                boardId_userId: {
                    boardId,
                    userId,
                },
            },
            data: { role },
            select: collaboratorSelect,
        });
    });

    emitCollaboratorEvent({
        boardId,
        action: "updated",
        collaborator,
    });

    return collaborator;
};

export const removeBoardCollaborator = async ({ boardId, actingUserId, userId }) => {
    const collaborator = await prisma.$transaction(async (tx) => {
        await assertBoardPermission({
            boardId,
            userId: actingUserId,
            permission: BOARD_PERMISSIONS.MANAGE_COLLABORATORS,
        }, tx);

        const existingCollaborator = await tx.boardCollaborator.findUnique({
            where: {
                boardId_userId: {
                    boardId,
                    userId,
                },
            },
            select: {
                id: true,
            },
        });

        if (!existingCollaborator) {
            throw createHttpError("Collaborator not found", 404);
        }

        return tx.boardCollaborator.delete({
            where: {
                boardId_userId: {
                    boardId,
                    userId,
                },
            },
            select: collaboratorSelect,
        });
    });

    emitCollaboratorEvent({
        boardId,
        action: "removed",
        collaborator,
    });

    return collaborator;
};
