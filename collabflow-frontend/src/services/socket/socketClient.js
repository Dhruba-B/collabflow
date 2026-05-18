import { io } from "socket.io-client";

class SocketService {
    socket = null;

    connect(token) {
        if (this.socket?.connected) return;

        this.socket = io("http://localhost:5000", {
            auth: {
                token,
            },
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        this.socket.on("connect", () => {
            console.log("Socket connected:", this.socket.id);
        });

        this.socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });
    }

    disconnect() {
        this.socket?.disconnect();
    }

    emit(event, payload) {
        this.socket?.emit(event, payload);
    }

    on(event, callback) {
        this.socket?.on(event, callback);
    }

    off(event, callback) {
        this.socket?.off(event, callback);
    }

    joinBoard(boardId) {
        this.emit("board", boardId);
    }

    leaveBoard(boardId) {
        this.emit("leave-board", boardId);
    }

    joinWorkspace(workspaceId) {
        this.emit("workspace", workspaceId);
    }

    leaveWorkspace(workspaceId) {
        this.emit("leave-workspace", workspaceId);
    }
}

export const socketService = new SocketService();
