import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { database, initDatabase } from "../database/database.js";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  archiveTask,
  getArchivedTasks,
  deleteColumnTasks,
  archiveColumnTasks,
} from "./controllers/taskController.js";
import { getColumns } from "./controllers/columnController.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../../frontend")));

app.get("/api/columns", getColumns);
app.get("/api/tasks", getTasks);
app.get("/api/tasks/:id", getTask);
app.post("/api/tasks", createTask);
app.patch("/api/tasks/:id", updateTask);
app.delete("/api/tasks/:id", deleteTask);

app.patch("/api/tasks/:id/archive", archiveTask);
app.get("/api/tasks/archived", getArchivedTasks);
app.delete("/api/columns/:columnId/tasks", deleteColumnTasks);
app.patch("/api/columns/:columnId/tasks/archive", archiveColumnTasks);

const startServer = async () => {
  await database.query("SELECT 1");
  console.log("Database connected");

  await initDatabase();
  console.log("Database initialized");

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer().catch(async (error) => {
  console.error("Failed to start server: ", error.message);
  console.error("Stack trace: ", error.stack);

  try {
    await database.end();
  } catch (error) {
    console.error("Failed to close database: ", error);
  }
  process.exit(1);
});
