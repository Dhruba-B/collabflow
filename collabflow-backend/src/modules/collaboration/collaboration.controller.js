import asyncHandler from "express-async-handler";
import {
    addBoardCollaborator,
    getBoardCollaborators,
    removeBoardCollaborator,
    updateBoardCollaborator,
} from "./collaboration.service.js";
import {
    addCollaboratorSchema,
    boardCollaboratorsParamsSchema,
    collaboratorParamsSchema,
    updateCollaboratorSchema,
} from "./collaboration.validation.js";

export const getBoardCollaboratorsController = asyncHandler(async (req, res) => {
    const { boardId } = boardCollaboratorsParamsSchema.parse(req.params);
    const collaborators = await getBoardCollaborators({
        boardId,
        userId: req.user.id,
    });

    res.status(200).json({
        success: true,
        message: "Collaborators fetched successfully",
        data: { collaborators },
    });
});

export const addBoardCollaboratorController = asyncHandler(async (req, res) => {
    const { boardId } = boardCollaboratorsParamsSchema.parse(req.params);
    const validatedData = addCollaboratorSchema.parse(req.body);

    const collaborator = await addBoardCollaborator({
        boardId,
        userId: req.user.id,
        ...validatedData,
    });

    res.status(201).json({
        success: true,
        message: "Collaborator saved successfully",
        data: { collaborator },
    });
});

export const updateBoardCollaboratorController = asyncHandler(async (req, res) => {
    const { boardId, userId } = collaboratorParamsSchema.parse(req.params);
    const validatedData = updateCollaboratorSchema.parse(req.body);

    const collaborator = await updateBoardCollaborator({
        boardId,
        userId,
        actingUserId: req.user.id,
        ...validatedData,
    });

    res.status(200).json({
        success: true,
        message: "Collaborator updated successfully",
        data: { collaborator },
    });
});

export const removeBoardCollaboratorController = asyncHandler(async (req, res) => {
    const { boardId, userId } = collaboratorParamsSchema.parse(req.params);

    const collaborator = await removeBoardCollaborator({
        boardId,
        userId,
        actingUserId: req.user.id,
    });

    res.status(200).json({
        success: true,
        message: "Collaborator removed successfully",
        data: { collaborator },
    });
});
