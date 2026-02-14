import { database } from "../../database/database.js";
import {
  fieldValidators,
  validateAndBuildUpdates,
} from "../../validators/taskValidator.js";

const TASK_COLUMNS = `task_id, column_id, user_id, task_title, task_description,
  task_start_date, task_end_date, task_estimated_duration,
  task_priority, task_type, task_is_archived, task_archived_at,
  task_created_at, task_updated_at`;

const getTasks = async (_req, res) => {
  try {
    const result = await database.query(
      `SELECT ${TASK_COLUMNS} FROM tasks WHERE task_is_archived = FALSE ORDER BY task_id ASC`,
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to load tasks." });
  }
};

const getTask = async (req, res) => {
  try {
    const result = await database.query(
      `SELECT ${TASK_COLUMNS} FROM tasks WHERE task_id = $1`,
      [req.params.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to load task." });
  }
};

const createTask = async (req, res) => {
  const {
    task_title,
    task_description,
    task_start_date,
    task_end_date,
    task_estimated_duration,
    task_priority,
    task_type,
    column_id,
    user_id,
  } = req.body;

  const requiredFields = {
    task_title,
    task_priority,
    task_type,
    column_id,
    user_id,
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (value === undefined || value === null) {
      return res.status(400).json({ error: `${field} is required.` });
    }
  }

  const allFields = {
    task_title,
    task_description,
    task_start_date,
    task_end_date,
    task_estimated_duration,
    task_priority,
    task_type,
    column_id,
    user_id,
  };

  for (const [field, value] of Object.entries(allFields)) {
    if (value === undefined) continue;
    const validator = fieldValidators[field];
    if (!validator) continue;
    if (!validator.validate(value)) {
      return res.status(400).json({ error: validator.error });
    }
  }

  if (
    task_start_date != null &&
    task_end_date != null &&
    new Date(task_start_date) > new Date(task_end_date)
  ) {
    return res
      .status(400)
      .json({ error: "Task start date must be before or equal to end date." });
  }

  const transformed = {};
  for (const [field, value] of Object.entries(allFields)) {
    if (value === undefined) continue;
    const validator = fieldValidators[field];
    transformed[field] = validator?.transform
      ? validator.transform(value)
      : value;
  }

  try {
    const result = await database.query(
      `INSERT INTO tasks (task_title, task_description, task_start_date, task_end_date,
        task_estimated_duration, task_priority, task_type, column_id, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING ${TASK_COLUMNS}`,
      [
        transformed.task_title,
        transformed.task_description ?? null,
        transformed.task_start_date ?? null,
        transformed.task_end_date ?? null,
        transformed.task_estimated_duration ?? null,
        transformed.task_priority,
        transformed.task_type,
        transformed.column_id,
        transformed.user_id,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task." });
  }
};

const updateTask = async (req, res) => {
  const {
    task_title,
    task_description,
    task_start_date,
    task_end_date,
    task_estimated_duration,
    task_priority,
    task_type,
    column_id,
    user_id,
  } = req.body;

  const { updates, values, error } = validateAndBuildUpdates({
    task_title,
    task_description,
    task_start_date,
    task_end_date,
    task_estimated_duration,
    task_priority,
    task_type,
    column_id,
    user_id,
  });

  if (error) {
    return res.status(400).json({ error });
  }

  values.push(req.params.id);
  const idIndex = values.length;

  try {
    const result = await database.query(
      `UPDATE tasks SET ${updates.join(", ")}, task_updated_at = NOW()
       WHERE task_id = $${idIndex}
       RETURNING ${TASK_COLUMNS}`,
      values,
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task." });
  }
};

const deleteTask = async (req, res) => {
  try {
    const result = await database.query(
      "DELETE FROM tasks WHERE task_id = $1 RETURNING task_id",
      [req.params.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task." });
  }
};

const deleteColumnTasks = async (req, res) => {
  try {
    await database.query("DELETE FROM tasks WHERE column_id = $1", [
      req.params.columnId,
    ]);
    res.json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete column tasks." });
  }
};

const archiveColumnTasks = async (req, res) => {
  try {
    const result = await database.query(
      `UPDATE tasks SET task_is_archived = TRUE, task_archived_at = NOW(), task_updated_at = NOW()
       WHERE column_id = $1 AND task_is_archived = FALSE
       RETURNING ${TASK_COLUMNS}`,
      [req.params.columnId],
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to archive column tasks." });
  }
};

const archiveTask = async (req, res) => {
  try {
    const result = await database.query(
      `UPDATE tasks SET task_is_archived = TRUE, task_archived_at = NOW(), task_updated_at = NOW()
       WHERE task_id = $1 AND task_is_archived = FALSE
       RETURNING ${TASK_COLUMNS}`,
      [req.params.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found or already archived." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to archive task." });
  }
};

const getArchivedTasks = async (req, res) => {
  const { from, to } = req.query;

  let query = `SELECT ${TASK_COLUMNS} FROM tasks WHERE task_is_archived = TRUE`;
  const values = [];

  if (from) {
    if (isNaN(new Date(from).getTime())) {
      return res.status(400).json({ error: "Invalid 'from' date." });
    }
    values.push(from);
    query += ` AND task_archived_at >= $${values.length}`;
  }

  if (to) {
    if (isNaN(new Date(to).getTime())) {
      return res.status(400).json({ error: "Invalid 'to' date." });
    }
    values.push(to);
    query += ` AND task_archived_at <= $${values.length}`;
  }

  query += " ORDER BY task_archived_at DESC";

  try {
    const result = await database.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to load archived tasks." });
  }
};
export {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  archiveTask,
  getArchivedTasks,
  deleteColumnTasks,
  archiveColumnTasks,
};
