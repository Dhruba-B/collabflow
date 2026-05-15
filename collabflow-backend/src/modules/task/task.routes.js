import express from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
    createTaskController,
    deleteTaskController,
    getTaskController,
    getTasksByColumnController,
    moveTaskController,
    reorderTasksController,
    updateTaskController,
} from "./task.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createTaskController);
router.get("/column/:columnId", getTasksByColumnController);
router.put("/move", moveTaskController);
router.patch("/:taskId/move", (req, res, next) => {
    req.body = {
        ...req.body,
        taskId: req.params.taskId,
    };

    return moveTaskController(req, res, next);
});
router.put("/reorder", reorderTasksController);
router.get("/:id", getTaskController);
router.put("/:id", updateTaskController);
router.patch("/:id", updateTaskController);
router.delete("/:id", deleteTaskController);

export default router;
