import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";
import {
    assertBoardPermission,
    assertWorkspaceOwner,
    BOARD_PERMISSIONS,
} from "../modules/collaboration/permission.service.js";

let ioInstance = null;

const createUnauthorizedSocketError = () => {
    const error = new Error("Authentication token is required");
    error.data = { statusCode: 401 };
    return error;
};

export const initializeSocket = (io) => {
    ioInstance = io;

    io.use(async (socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.headers?.authorization?.replace("Bearer ", "");

            if (!token) {
                throw createUnauthorizedSocketError();
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId || decoded.id;

            if (!userId) {
                throw createUnauthorizedSocketError();
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });

            if (!user) {
                throw createUnauthorizedSocketError();
            }

            socket.user = user;
            next();
        } catch (error) {
            next(error);
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        const joinBoard = async (boardId, acknowledge) => {
            try {
                const normalizedBoardId = Number(boardId);

                if (!Number.isInteger(normalizedBoardId) || normalizedBoardId <= 0) {
                    throw new Error("Invalid board id");
                }

                const access = await assertBoardPermission({
                    boardId: normalizedBoardId,
                    userId: socket.user.id,
                    permission: BOARD_PERMISSIONS.READ,
                });

                socket.join(`board:${normalizedBoardId}`);

                console.log(
                    `Socket ${socket.id} joined board:${normalizedBoardId}`
                );

                acknowledge?.({
                    success: true,
                    access,
                });
            } catch (error) {
                acknowledge?.({
                    success: false,
                    message: error.message,
                });
                socket.emit("board:error", {
                    message: error.message,
                });
            }
        };

        socket.on("board", joinBoard);
        socket.on("join-board", joinBoard);

        socket.on("workspace", async (workspaceId, acknowledge) => {
            try {
                const normalizedWorkspaceId = Number(workspaceId);

                if (
                    !Number.isInteger(normalizedWorkspaceId) ||
                    normalizedWorkspaceId <= 0
                ) {
                    throw new Error("Invalid workspace id");
                }

                await assertWorkspaceOwner({
                    workspaceId: normalizedWorkspaceId,
                    userId: socket.user.id,
                });

                socket.join(`workspace:${normalizedWorkspaceId}`);

                console.log(
                    `Socket ${socket.id} joined workspace:${normalizedWorkspaceId}`
                );

                acknowledge?.({ success: true });
            } catch (error) {
                acknowledge?.({
                    success: false,
                    message: error.message,
                });
                socket.emit("workspace:error", {
                    message: error.message,
                });
            }
        });

        socket.on("workspace-list", () => {
            socket.join(`user:${socket.user.id}:workspace-list`);

            console.log(
                `Socket ${socket.id} joined user:${socket.user.id}:workspace-list`
            );
        });

        socket.on("leave-board", (boardId) => {
            socket.leave(`board:${boardId}`);

            console.log(
                `Socket ${socket.id} left board:${boardId}`
            );
        });

        socket.on("leave-workspace", (workspaceId) => {
            socket.leave(`workspace:${workspaceId}`);

            console.log(
                `Socket ${socket.id} left workspace:${workspaceId}`
            );
        });

        socket.on("leave-workspace-list", () => {
            socket.leave(`user:${socket.user.id}:workspace-list`);

            console.log(
                `Socket ${socket.id} left user:${socket.user.id}:workspace-list`
            );
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
};

export const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.io not initialized");
    }

    return ioInstance;
};
