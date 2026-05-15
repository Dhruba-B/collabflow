import asyncHandler from "express-async-handler";
import {
    createWorkspace,
    deleteWorkspace,
    getWorkspaceById,
    getWorkspacesByOwner,
} from "./workspace.service.js";
import {
    createWorkspaceSchema,
    workspaceParamsSchema,
} from "./workspace.validation.js";

export const createWorkspaceController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const validatedData = createWorkspaceSchema.parse(req.body);

    const workspace = await createWorkspace({
        ...validatedData,
        ownerId,
    });

    res.status(201).json({
        success: true,
        message: "Workspace created successfully",
        data: {
            workspace,
        },
    });
});

export const getWorkspacesController = asyncHandler(async (req, res) => {
    // console.log("Fetching workspaces for user:", req);
    const ownerId = req.user.id;

    const workspaces = await getWorkspacesByOwner(ownerId);

    res.status(200).json({
        success: true,
        message: "Workspaces fetched successfully",
        data: {
            workspaces,
        },
    });
});

export const getWorkspaceController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { id: workspaceId } = workspaceParamsSchema.parse(req.params);

    const workspace = await getWorkspaceById({
        workspaceId,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Workspace fetched successfully",
        data: {
            workspace,
        },
    });
});

export const deleteWorkspaceController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { id: workspaceId } = workspaceParamsSchema.parse(req.params);

    const workspace = await deleteWorkspace({
        workspaceId,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Workspace deleted successfully",
        data: {
            workspace,
        },
    });
});
