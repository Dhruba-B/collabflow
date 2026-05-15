import { boardKeys } from "../../modules/board/boardKeys";
import { workspaceKeys } from "../../modules/workspace/workspaceKeys";
import { socketService } from "./socketClient";

export const registerWorkspaceListRealtime = ({
    queryClient,
}) => {
    if (!queryClient) {
        return () => {};
    }

    const token = localStorage.getItem("token");

    socketService.connect(token);
    socketService.emit("workspace-list");

    const handleWorkspaceEvent = () => {
        queryClient.invalidateQueries({
            queryKey: workspaceKeys.all,
        });
    };

    socketService.on(
        "workspace",
        handleWorkspaceEvent
    );

    return () => {
        socketService.off(
            "workspace",
            handleWorkspaceEvent
        );
        socketService.emit("leave-workspace-list");
    };
};

export const registerWorkspaceRealtime = ({
    workspaceId,
    queryClient,
}) => {
    if (!workspaceId || !queryClient) {
        return () => {};
    }

    const token = localStorage.getItem("token");

    socketService.connect(token);
    socketService.emit("workspace", workspaceId);

    const handleBoardEvent = () => {
        queryClient.invalidateQueries({
            queryKey:
                boardKeys.workspace(workspaceId),
        });

        queryClient.invalidateQueries({
            queryKey:
                workspaceKeys.detail(workspaceId),
        });
    };

    socketService.on("board", handleBoardEvent);

    return () => {
        socketService.off("board", handleBoardEvent);
        socketService.emit(
            "leave-workspace",
            workspaceId
        );
    };
};
