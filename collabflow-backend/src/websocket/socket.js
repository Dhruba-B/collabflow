let ioInstance = null;

export const initializeSocket = (io) => {
    ioInstance = io;

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        const joinBoard = (boardId) => {
            socket.join(`board:${boardId}`);

            console.log(
                `Socket ${socket.id} joined board:${boardId}`
            );
        };

        socket.on("board", joinBoard);
        socket.on("join-board", joinBoard);

        socket.on("workspace", (workspaceId) => {
            socket.join(`workspace:${workspaceId}`);

            console.log(
                `Socket ${socket.id} joined workspace:${workspaceId}`
            );
        });

        socket.on("workspace-list", () => {
            socket.join("workspace-list");

            console.log(
                `Socket ${socket.id} joined workspace-list`
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
            socket.leave("workspace-list");

            console.log(
                `Socket ${socket.id} left workspace-list`
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
