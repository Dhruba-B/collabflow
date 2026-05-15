import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createBoard,
    deleteBoard,
    getBoard,
    getWorkspaceBoards,
} from "./boardApi";

import { boardKeys } from "./boardKeys";

export const useWorkspaceBoards = (
    workspaceId
) => {
    return useQuery({
        queryKey:
            boardKeys.workspace(workspaceId),
        queryFn: () =>
            getWorkspaceBoards(workspaceId),
        enabled: Boolean(workspaceId),
    });
};

export const useBoard = (boardId) => {
    return useQuery({
        queryKey: boardKeys.detail(boardId),
        queryFn: () => getBoard(boardId),
        enabled: Boolean(boardId),
    });
};

export const useCreateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBoard,

        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: boardKeys.workspace(
                    variables.workspaceId
                ),
            });
        },
    });
};

export const useDeleteBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBoard,

        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: boardKeys.workspace(
                    variables.workspaceId
                ),
            });
        },
    });
};
