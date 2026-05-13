import express from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
    createColumnController,
    deleteColumnController,
    getColumnsByBoardController,
    reorderColumnsController,
    updateColumnController,
} from "./column.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createColumnController);
router.get("/board/:boardId", getColumnsByBoardController);
router.put("/reorder", reorderColumnsController);
router.put("/:id", updateColumnController);
router.delete("/:id", deleteColumnController);

export default router;
