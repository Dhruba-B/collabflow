import asyncHandler from "express-async-handler";
import {
    createColumn,
    deleteColumn,
    getColumnsByBoard,
    reorderColumns,
    updateColumn,
} from "./column.service.js";
import {
    boardColumnsParamsSchema,
    columnParamsSchema,
    createColumnSchema,
    reorderColumnsSchema,
    updateColumnSchema,
} from "./column.validation.js";

export const createColumnController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const validatedData = createColumnSchema.parse(req.body);

    const column = await createColumn({
        ...validatedData,
        ownerId,
    });

    res.status(201).json({
        success: true,
        message: "Column created successfully",
        data: {
            column,
        },
    });
});

export const getColumnsByBoardController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { boardId } = boardColumnsParamsSchema.parse(req.params);

    const columns = await getColumnsByBoard({
        boardId,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Columns fetched successfully",
        data: {
            columns,
        },
    });
});

export const updateColumnController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { id: columnId } = columnParamsSchema.parse(req.params);
    const validatedData = updateColumnSchema.parse(req.body);

    const column = await updateColumn({
        columnId,
        ownerId,
        ...validatedData,
    });

    res.status(200).json({
        success: true,
        message: "Column updated successfully",
        data: {
            column,
        },
    });
});

export const deleteColumnController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { id: columnId } = columnParamsSchema.parse(req.params);

    const column = await deleteColumn({
        columnId,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Column deleted successfully",
        data: {
            column,
        },
    });
});

export const reorderColumnsController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { columns: columnPositions } = reorderColumnsSchema.parse(req.body);

    const columns = await reorderColumns({
        columns: columnPositions,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Columns reordered successfully",
        data: {
            columns,
        },
    });
});
