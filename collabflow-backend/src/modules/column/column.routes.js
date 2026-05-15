import express from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
    createColumnController,
    deleteColumnController,
    getColumnsByBoardController,
    reorderColumnsController,
    updateColumnController,
} from "./column.controller.js";
import { createTaskController } from "../task/task.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createColumnController);
router.post("/:columnId/task", (req, res, next) => {
    req.body = {
        ...req.body,
        columnId: req.params.columnId,
    };

    return createTaskController(req, res, next);
});
router.get("/board/:boardId", getColumnsByBoardController);
router.put("/reorder", reorderColumnsController);
router.put("/:id", updateColumnController);
router.patch("/:id", updateColumnController);
router.delete("/:id", deleteColumnController);

export default router;
