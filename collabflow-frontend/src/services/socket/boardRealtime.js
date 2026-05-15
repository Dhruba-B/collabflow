import { boardKeys } from "../../modules/board/boardKeys";
import { socketService } from "./socketClient";

const invalidateBoard = ({
    queryClient,
    boardId,
}) => {
    queryClient.invalidateQueries({
        queryKey: boardKeys.detail(boardId),
    });
};

export const registerBoardRealtime = ({
    boardId,
    queryClient,
}) => {
    if (!boardId || !queryClient) {
        return () => {};
    }

    const token = localStorage.getItem("token");

    socketService.connect(token);
    socketService.emit("board", boardId);

    const handleTaskEvent = () => {
        invalidateBoard({
            queryClient,
            boardId,
        });
    };

    const handleColumnEvent = () => {
        invalidateBoard({
            queryClient,
            boardId,
        });
    };

    socketService.on("task", handleTaskEvent);
    socketService.on("column", handleColumnEvent);

    return () => {
        socketService.off("task", handleTaskEvent);
        socketService.off("column", handleColumnEvent);
        socketService.emit("leave-board", boardId);
    };
};
