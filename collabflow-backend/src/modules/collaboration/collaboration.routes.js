import express from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
    addBoardCollaboratorController,
    getBoardCollaboratorsController,
    removeBoardCollaboratorController,
    updateBoardCollaboratorController,
} from "./collaboration.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/board/:boardId", getBoardCollaboratorsController);
router.post("/board/:boardId", addBoardCollaboratorController);
router.patch("/board/:boardId/:userId", updateBoardCollaboratorController);
router.delete("/board/:boardId/:userId", removeBoardCollaboratorController);

export default router;
