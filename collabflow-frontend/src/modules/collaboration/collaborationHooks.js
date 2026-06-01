import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../board/boardKeys";
import {
    addBoardCollaborator,
    getBoardCollaborators,
    removeBoardCollaborator,
    updateBoardCollaborator,
} from "./collaborationApi";
import { collaborationKeys } from "./collaborationKeys";
import {
    showSuccessSnackbar,
    showWarningSnackbar,
} from "../../store/snackbarStore";

const invalidateCollaborators = (queryClient, boardId) => {
    queryClient.invalidateQueries({
        queryKey: collaborationKeys.board(boardId),
    });
    queryClient.invalidateQueries({
        queryKey: boardKeys.detail(boardId),
    });
};

export const useBoardCollaborators = (boardId, enabled = true) => {
    return useQuery({
        queryKey: collaborationKeys.board(boardId),
        queryFn: () => getBoardCollaborators(boardId),
        enabled: Boolean(boardId) && enabled,
    });
};

export const useAddBoardCollaborator = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addBoardCollaborator,
        onSuccess: (_data, variables) => {
            invalidateCollaborators(queryClient, variables.boardId);
            showSuccessSnackbar("Collaborator saved");
        },
    });
};

export const useUpdateBoardCollaborator = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateBoardCollaborator,
        onSuccess: (_data, variables) => {
            invalidateCollaborators(queryClient, variables.boardId);
            showSuccessSnackbar("Collaborator role updated");
        },
    });
};

export const useRemoveBoardCollaborator = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeBoardCollaborator,
        onSuccess: (_data, variables) => {
            invalidateCollaborators(queryClient, variables.boardId);
            showWarningSnackbar("Collaborator removed");
        },
    });
};
