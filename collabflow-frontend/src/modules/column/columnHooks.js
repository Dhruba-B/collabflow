import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createColumn,
    deleteColumn,
    updateColumn,
} from "./columnApi";

import { boardKeys } from "../board/boardKeys";

const invalidateBoardDetail = (
    queryClient,
    boardId
) => {
    queryClient.invalidateQueries({
        queryKey: boardKeys.detail(boardId),
    });
};

export const useCreateColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createColumn,

        onSuccess: (_data, variables) => {
            invalidateBoardDetail(
                queryClient,
                variables.boardId
            );
        },
    });
};

export const useUpdateColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateColumn,

        onSuccess: (_data, variables) => {
            invalidateBoardDetail(
                queryClient,
                variables.boardId
            );
        },
    });
};

export const useDeleteColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteColumn,

        onSuccess: (_data, variables) => {
            invalidateBoardDetail(
                queryClient,
                variables.boardId
            );
        },
    });
};
