import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createTask,
    deleteTask,
    moveTask,
    updateTask,
} from "./taskApi";

import { boardKeys } from "../board/boardKeys";

const invalidateBoardDetail = (
    queryClient,
    boardId
) => {
    queryClient.invalidateQueries({
        queryKey: boardKeys.detail(boardId),
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTask,

        onSuccess: (_data, variables) => {
            invalidateBoardDetail(
                queryClient,
                variables.boardId
            );
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTask,

        onSuccess: (_data, variables) => {
            invalidateBoardDetail(
                queryClient,
                variables.boardId
            );
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTask,

        onSuccess: (_data, variables) => {
            invalidateBoardDetail(
                queryClient,
                variables.boardId
            );
        },
    });
};

export const useMoveTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: moveTask,

        onSuccess: (_data, variables) => {
            invalidateBoardDetail(
                queryClient,
                variables.boardId
            );
        },
    });
};
