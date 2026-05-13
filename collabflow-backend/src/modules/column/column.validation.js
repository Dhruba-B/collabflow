import * as z from "zod";

export const createColumnSchema = z.object({
    name: z.string().trim().min(2, "Column name must be at least 2 characters").max(80),
    boardId: z.coerce.number().int().positive("Board id must be a positive integer"),
});

export const updateColumnSchema = z.object({
    name: z.string().trim().min(2, "Column name must be at least 2 characters").max(80),
});

export const columnParamsSchema = z.object({
    id: z.coerce.number().int().positive("Column id must be a positive integer"),
});

export const boardColumnsParamsSchema = z.object({
    boardId: z.coerce.number().int().positive("Board id must be a positive integer"),
});

export const reorderColumnsSchema = z.object({
    columns: z.array(
        z.object({
            id: z.coerce.number().int().positive("Column id must be a positive integer"),
            position: z.coerce.number().int().positive("Column position must be a positive integer"),
        }),
    ).min(1, "At least one column is required"),
}).superRefine(({ columns }, ctx) => {
    const columnIds = new Set();
    const positions = new Set();

    columns.forEach((column, index) => {
        if (columnIds.has(column.id)) {
            ctx.addIssue({
                code: "custom",
                path: ["columns", index, "id"],
                message: "Column ids must be unique",
            });
        }

        if (positions.has(column.position)) {
            ctx.addIssue({
                code: "custom",
                path: ["columns", index, "position"],
                message: "Column positions must be unique",
            });
        }

        columnIds.add(column.id);
        positions.add(column.position);
    });
});
