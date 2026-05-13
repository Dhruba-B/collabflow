import asyncHandler from "express-async-handler";
import {
    createBoard,
    deleteBoard,
    getBoardById,
    getBoardsByWorkspace,
    updateBoard,
} from "./board.service.js";
import {
    boardParamsSchema,
    createBoardSchema,
    updateBoardSchema,
    workspaceBoardsParamsSchema,
} from "./board.validation.js";

export const createBoardController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const validatedData = createBoardSchema.parse(req.body);

    const board = await createBoard({
        ...validatedData,
        ownerId,
    });

    res.status(201).json({
        success: true,
        message: "Board created successfully",
        data: {
            board,
        },
    });
});

export const getBoardsByWorkspaceController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { workspaceId } = workspaceBoardsParamsSchema.parse(req.params);

    const boards = await getBoardsByWorkspace({
        workspaceId,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Boards fetched successfully",
        data: {
            boards,
        },
    });
});

export const getBoardController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { id: boardId } = boardParamsSchema.parse(req.params);

    const board = await getBoardById({
        boardId,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Board fetched successfully",
        data: {
            board,
        },
    });
});

export const updateBoardController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { id: boardId } = boardParamsSchema.parse(req.params);
    const validatedData = updateBoardSchema.parse(req.body);

    const board = await updateBoard({
        boardId,
        ownerId,
        ...validatedData,
    });

    res.status(200).json({
        success: true,
        message: "Board updated successfully",
        data: {
            board,
        },
    });
});

export const deleteBoardController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { id: boardId } = boardParamsSchema.parse(req.params);

    const board = await deleteBoard({
        boardId,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Board deleted successfully",
        data: {
            board,
        },
    });
});
