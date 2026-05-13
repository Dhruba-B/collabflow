import asyncHandler from "express-async-handler";
import {
    createTask,
    deleteTask,
    getTaskById,
    getTasksByColumn,
    moveTask,
    reorderTasks,
    updateTask,
} from "./task.service.js";
import {
    columnTasksParamsSchema,
    createTaskSchema,
    moveTaskSchema,
    reorderTasksSchema,
    taskParamsSchema,
    updateTaskSchema,
} from "./task.validation.js";

export const createTaskController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const validatedData = createTaskSchema.parse(req.body);

    const task = await createTask({
        ...validatedData,
        ownerId,
    });

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: {
            task,
        },
    });
});

export const getTasksByColumnController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { columnId } = columnTasksParamsSchema.parse(req.params);

    const tasks = await getTasksByColumn({
        columnId,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Tasks fetched successfully",
        data: {
            tasks,
        },
    });
});

export const getTaskController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { id: taskId } = taskParamsSchema.parse(req.params);

    const task = await getTaskById({
        taskId,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Task fetched successfully",
        data: {
            task,
        },
    });
});

export const updateTaskController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { id: taskId } = taskParamsSchema.parse(req.params);
    const validatedData = updateTaskSchema.parse(req.body);

    const task = await updateTask({
        taskId,
        ownerId,
        data: validatedData,
    });

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: {
            task,
        },
    });
});

export const deleteTaskController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { id: taskId } = taskParamsSchema.parse(req.params);

    const task = await deleteTask({
        taskId,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        data: {
            task,
        },
    });
});

export const moveTaskController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const validatedData = moveTaskSchema.parse(req.body);

    const task = await moveTask({
        ...validatedData,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Task moved successfully",
        data: {
            task,
        },
    });
});

export const reorderTasksController = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;
    const { tasks: taskPositions } = reorderTasksSchema.parse(req.body);

    const tasks = await reorderTasks({
        tasks: taskPositions,
        ownerId,
    });

    res.status(200).json({
        success: true,
        message: "Tasks reordered successfully",
        data: {
            tasks,
        },
    });
});
