import * as z from "zod";

export const createBoardSchema = z.object({
    name: z.string().trim().min(2, "Board name must be at least 2 characters").max(80),
    workspaceId: z.coerce.number().int().positive("Workspace id must be a positive integer"),
});

export const updateBoardSchema = z.object({
    name: z.string().trim().min(2, "Board name must be at least 2 characters").max(80),
});

export const boardParamsSchema = z.object({
    id: z.coerce.number().int().positive("Board id must be a positive integer"),
});

export const workspaceBoardsParamsSchema = z.object({
    workspaceId: z.coerce.number().int().positive("Workspace id must be a positive integer"),
});
