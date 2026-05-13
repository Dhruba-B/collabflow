import * as z from "zod";

export const createTaskSchema = z.object({
    title: z.string().trim().min(2, "Task title must be at least 2 characters").max(120),
    description: z.string().trim().max(1000).optional(),
    columnId: z.coerce.number().int().positive("Column id must be a positive integer"),
});

export const updateTaskSchema = z.object({
    title: z.string().trim().min(2, "Task title must be at least 2 characters").max(120).optional(),
    description: z.string().trim().max(1000).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});

export const taskParamsSchema = z.object({
    id: z.coerce.number().int().positive("Task id must be a positive integer"),
});

export const columnTasksParamsSchema = z.object({
    columnId: z.coerce.number().int().positive("Column id must be a positive integer"),
});

export const moveTaskSchema = z.object({
    taskId: z.coerce.number().int().positive("Task id must be a positive integer"),
    sourceColumnId: z.coerce.number().int().positive("Source column id must be a positive integer"),
    targetColumnId: z.coerce.number().int().positive("Target column id must be a positive integer"),
    position: z.coerce.number().int().min(0, "Task position must be zero or greater"),
});

export const reorderTasksSchema = z.object({
    tasks: z.array(
        z.object({
            id: z.coerce.number().int().positive("Task id must be a positive integer"),
            position: z.coerce.number().int().positive("Task position must be a positive integer"),
        }),
    ).min(1, "At least one task is required"),
}).superRefine(({ tasks }, ctx) => {
    const taskIds = new Set();
    const positions = new Set();

    tasks.forEach((task, index) => {
        if (taskIds.has(task.id)) {
            ctx.addIssue({
                code: "custom",
                path: ["tasks", index, "id"],
                message: "Task ids must be unique",
            });
        }

        if (positions.has(task.position)) {
            ctx.addIssue({
                code: "custom",
                path: ["tasks", index, "position"],
                message: "Task positions must be unique",
            });
        }

        taskIds.add(task.id);
        positions.add(task.position);
    });
});
