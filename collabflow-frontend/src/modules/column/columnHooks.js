import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createColumn,
    deleteColumn,
    reorderColumns,
    updateColumn,
} from "./columnApi";

import { boardKeys } from "../board/boardKeys";
import { withSequentialPositions } from "../../utils/dnd/reorderArray";
import { showWarningSnackbar } from "../../store/snackbarStore";

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

export const useReorderColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reorderColumns,

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

                    const positionByColumnId = new Map(
                        variables.columns.map((column) => [
                            column.id,
                            column.position,
                        ])
                    );

                    return {
                        ...currentBoard,
                        columns: withSequentialPositions(
                            [...currentBoard.columns].sort(
                                (firstColumn, secondColumn) =>
                                    positionByColumnId.get(firstColumn.id) -
                                    positionByColumnId.get(secondColumn.id)
                            )
                        ),
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

            showWarningSnackbar("Column order was reverted");
        },

        onSettled: (_data, _error, variables) => {
            invalidateBoardDetail(
                queryClient,
                variables.boardId
            );
        },
    });
};
