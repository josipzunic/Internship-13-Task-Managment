import path from "path";
import fs from "fs";
import { Pool } from "pg";
import { fileURLToPath } from "url";
import dotenv from "dotenv"
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const database = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDatabase = async () => {
  try {
    const sqlFilePath = path.join(__dirname, "database.sql");
    const sql = fs.readFileSync(sqlFilePath, "utf-8");
    await database.query(sql);
  } catch (error) {
    console.error("Failed to initialize database: ", error);
    throw error;
  }
};

export { database, initDatabase };
