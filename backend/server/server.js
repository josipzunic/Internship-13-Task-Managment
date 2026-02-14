import express from "express";
import dotenv from "dotenv";
import { database, initDatabase } from "../database/database.js";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "./controllers/taskController.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/tasks", getTasks);
app.get("/api/tasks/:id", getTask);
app.post("/api/tasks", createTask);
app.patch("/api/tasks/:id", updateTask);
app.delete("/api/tasks/:id", deleteTask);

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
