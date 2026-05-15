import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import boardRoutes from "./modules/board/board.routes.js";
import columnRoutes from "./modules/column/column.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
import workspaceRoutes from "./modules/workspace/workspace.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CollabFlow API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/column", columnRoutes);
app.use("/api/task", taskRoutes);

app.use(errorHandler);

export default app;
