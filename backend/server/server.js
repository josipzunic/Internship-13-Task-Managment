import express from "express";
import dotenv from "dotenv";
import { database, initDatabase } from "../database/database.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
