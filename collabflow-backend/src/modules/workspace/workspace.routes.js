import express from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
    createWorkspaceController,
    deleteWorkspaceController,
    getWorkspaceController,
    getWorkspacesController,
} from "./workspace.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createWorkspaceController);
router.get("/", getWorkspacesController);
router.get("/:id", getWorkspaceController);
router.delete("/:id", deleteWorkspaceController);

export default router;
