import * as z from "zod";

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(2, "Workspace name must be at least 2 characters").max(80),
});

export const workspaceParamsSchema = z.object({
    id: z.coerce.number().int().positive("Workspace id must be a positive integer"),
});
