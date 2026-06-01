import * as z from "zod";

export const collaboratorRoleSchema = z.enum(["EDITOR", "VIEWER"]);

export const boardCollaboratorsParamsSchema = z.object({
    boardId: z.coerce.number().int().positive("Board id must be a positive integer"),
});

export const collaboratorParamsSchema = z.object({
    boardId: z.coerce.number().int().positive("Board id must be a positive integer"),
    userId: z.coerce.number().int().positive("User id must be a positive integer"),
});

export const addCollaboratorSchema = z.object({
    email: z.string().trim().email("Collaborator email must be valid"),
    role: collaboratorRoleSchema,
});

export const updateCollaboratorSchema = z.object({
    role: collaboratorRoleSchema,
});
