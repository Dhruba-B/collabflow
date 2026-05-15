import express from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
    createBoardController,
    deleteBoardController,
    getBoardController,
    getBoardsByWorkspaceController,
    updateBoardController,
} from "./board.controller.js";
import { createColumnController } from "../column/column.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createBoardController);
router.post("/:boardId/column", (req, res, next) => {
    req.body = {
        ...req.body,
        boardId: req.params.boardId,
    };

    return createColumnController(req, res, next);
});
router.get("/workspace/:workspaceId", getBoardsByWorkspaceController);
router.get("/:id", getBoardController);
router.put("/:id", updateBoardController);
router.patch("/:id", updateBoardController);
router.delete("/:id", deleteBoardController);

export default router;
