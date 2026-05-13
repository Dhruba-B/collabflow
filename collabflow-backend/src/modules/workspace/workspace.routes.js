import express from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
    createWorkspaceController,
    getWorkspaceController,
    getWorkspacesController,
} from "./workspace.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createWorkspaceController);
router.get("/", getWorkspacesController);
router.get("/:id", getWorkspaceController);

export default router;
