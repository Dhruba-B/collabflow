import { boardKeys } from "../../modules/board/boardKeys";
import { collaborationKeys } from "../../modules/collaboration/collaborationKeys";
import { showInfoSnackbar } from "../../store/snackbarStore";
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
    onSyncEvent,
}) => {
    if (!boardId || !queryClient) {
        return () => {};
    }

    const token = localStorage.getItem("token");

    socketService.connect(token);
    socketService.emit("board", boardId);

    const handleTaskEvent = (event) => {
        onSyncEvent?.({
            type: "task",
            event,
        });
        showInfoSnackbar("Board updated from realtime sync", {
            duration: 2600,
        });

        invalidateBoard({
            queryClient,
            boardId,
        });
    };

    const invalidateCollaborators = () => {
        queryClient.invalidateQueries({
            queryKey: collaborationKeys.board(boardId),
        });
    };

    const handleColumnEvent = (event) => {
        onSyncEvent?.({
            type: "column",
            event,
        });
        showInfoSnackbar("Board columns synced", {
            duration: 2600,
        });

        invalidateBoard({
            queryClient,
            boardId,
        });
    };

    const handleCollaboratorEvent = () => {
        showInfoSnackbar("Board sharing updated", {
            duration: 2600,
        });

        invalidateCollaborators();
        invalidateBoard({
            queryClient,
            boardId,
        });
    };

    socketService.on("task", handleTaskEvent);
    socketService.on("column", handleColumnEvent);
    socketService.on("collaborator", handleCollaboratorEvent);

    return () => {
        socketService.off("task", handleTaskEvent);
        socketService.off("column", handleColumnEvent);
        socketService.off("collaborator", handleCollaboratorEvent);
        socketService.emit("leave-board", boardId);
    };
};
