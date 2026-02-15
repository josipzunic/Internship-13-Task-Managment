import jwt from "jsonwebtoken";
import { mapTaskToFrontend } from "../models/mappers";

export const getTaskById = async (taskId) => {
  const result = await database.query(
    `SELECT t.*, u.username, c.column_name
     FROM tasks t
     LEFT JOIN users u ON t.user_id = u.user_id
     JOIN "columns" c ON t.column_id = c.column_id
     WHERE t.task_id = $1`,
    [taskId],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapTaskToFrontend(result.rows[0]);
};

const JWT_SECRET = process.env.JWT_SECRET;

export const createJwtToken = (user) => {
  const token = jwt.sign(
    { userId: user.user_id, username: user.username },
    JWT_SECRET,
    { expiresIn: "7d" },
  );

  return token;
};
