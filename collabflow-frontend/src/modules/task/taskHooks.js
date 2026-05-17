import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createTask,
    deleteTask,
    moveTask,
    reorderTasks,
    updateTask,
} from "./taskApi";

import { boardKeys } from "../board/boardKeys";
import {
    moveTaskBetweenColumns,
    reorderTasksInColumn,
} from "../../utils/dnd/moveTaskBetweenColumns";
import { withSequentialPositions } from "../../utils/dnd/reorderArray";

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

        onMutate: async (variables) => {
            await queryClient.cancelQueries({
                queryKey: boardKeys.detail(variables.boardId),
            });

            const previousBoard = queryClient.getQueryData(
                boardKeys.detail(variables.boardId)
            );

            queryClient.setQueryData(
                boardKeys.detail(variables.boardId),
                (currentBoard) => {
                    if (!currentBoard?.columns) {
                        return currentBoard;
                    }

                    return {
                        ...currentBoard,
                        columns: moveTaskBetweenColumns({
                            columns: currentBoard.columns,
                            taskId: variables.taskId,
                            sourceColumnId: variables.sourceColumnId,
                            targetColumnId: variables.targetColumnId,
                            targetIndex: variables.position,
                        }),
                    };
                }
            );

            return { previousBoard };
        },

        onError: (_error, variables, context) => {
            if (context?.previousBoard) {
                queryClient.setQueryData(
                    boardKeys.detail(variables.boardId),
                    context.previousBoard
                );
            }
        },

        onSettled: (_data, _error, variables) => {
            invalidateBoardDetail(
                queryClient,
                variables.boardId
            );
        },
    });
};

export const useReorderTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reorderTasks,

        onMutate: async (variables) => {
            await queryClient.cancelQueries({
                queryKey: boardKeys.detail(variables.boardId),
            });

            const previousBoard = queryClient.getQueryData(
                boardKeys.detail(variables.boardId)
            );

            queryClient.setQueryData(
                boardKeys.detail(variables.boardId),
                (currentBoard) => {
                    if (!currentBoard?.columns) {
                        return currentBoard;
                    }

                    const taskPositionById = new Map(
                        variables.tasks.map((task) => [
                            task.id,
                            task.position,
                        ])
                    );

                    const currentColumn = currentBoard.columns.find(
                        (column) => column.id === variables.columnId
                    );
                    const orderedTaskIds = new Set(
                        variables.tasks.map((task) => task.id)
                    );

                    if (!currentColumn) {
                        return currentBoard;
                    }

                    const fromIndex = (currentColumn.tasks || []).findIndex(
                        (task) => task.id === variables.taskId
                    );
                    const toIndex = variables.tasks.findIndex(
                        (task) => task.id === variables.taskId
                    );

                    if (fromIndex >= 0 && toIndex >= 0) {
                        return {
                            ...currentBoard,
                            columns: reorderTasksInColumn({
                                columns: currentBoard.columns,
                                columnId: variables.columnId,
                                fromIndex,
                                toIndex,
                            }),
                        };
                    }

                    return {
                        ...currentBoard,
                        columns: currentBoard.columns.map((column) => {
                            if (column.id !== variables.columnId) {
                                return column;
                            }

                            return {
                                ...column,
                                tasks: withSequentialPositions(
                                    [...(column.tasks || [])].sort(
                                        (firstTask, secondTask) =>
                                            taskPositionById.get(firstTask.id) -
                                            taskPositionById.get(secondTask.id)
                                    )
                                ).filter((task) =>
                                    orderedTaskIds.has(task.id)
                                ),
                            };
                        }),
                    };
                }
            );

            return { previousBoard };
        },

        onError: (_error, variables, context) => {
            if (context?.previousBoard) {
                queryClient.setQueryData(
                    boardKeys.detail(variables.boardId),
                    context.previousBoard
                );
            }
        },

        onSettled: (_data, _error, variables) => {
            invalidateBoardDetail(
                queryClient,
                variables.boardId
            );
        },
    });
};
