let ioInstance = null;

export const initializeSocket = (io) => {
    ioInstance = io;

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("join-board", (boardId) => {
            socket.join(`board:${boardId}`);

            console.log(
                `Socket ${socket.id} joined board:${boardId}`
            );
        });

        socket.on("leave-board", (boardId) => {
            socket.leave(`board:${boardId}`);

            console.log(
                `Socket ${socket.id} left board:${boardId}`
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