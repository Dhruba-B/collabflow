import express from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
    createBoardController,
    deleteBoardController,
    getBoardController,
    getBoardsByWorkspaceController,
    updateBoardController,
} from "./board.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createBoardController);
router.get("/workspace/:workspaceId", getBoardsByWorkspaceController);
router.get("/:id", getBoardController);
router.put("/:id", updateBoardController);
router.delete("/:id", deleteBoardController);

export default router;
