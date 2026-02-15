import { database } from "../../database/database.js";
import { fieldValidators } from "../../validators/taskValidator.js";
import {
  mapTaskToFrontend,
  statusToColumnName,
  priorityToDB,
  typeToDB,
} from "../../models/mappers.js";
import { getTaskById } from "../../database/helper/helper.js";

const TASK_COLUMNS = `task_id, column_id, user_id, task_title, task_description,
  task_start_date, task_end_date, task_estimated_duration,
  task_priority, task_type, task_is_archived, task_archived_at,
  task_created_at, task_updated_at`;

const getTasks = async (req, res) => {
  try {
    const archived = req.query.archived === "true";

    const result = await database.query(
      `SELECT t.*, u.username, c.column_name
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.user_id
      JOIN "columns" c ON t.column_id = c.column_id
      WHERE t.task_is_archived = $1
      ORDER BY t.task_created_at DESC`,
      [archived],
    );

    const tasks = result.rows.map(mapTaskToFrontend);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to load tasks." });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to load task." });
  }
};

const createTask = async (req, res) => {
  const {
    title,
    description,
    status,
    startDate,
    endDate,
    estimateHours,
    priority,
    type,
    assignee,
  } = req.body;

  const requiredFields = {
    title,
    priority,
    type,
    status,
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (value === undefined || value === null) {
      return res.status(400).json({ error: `${field} is required.` });
    }
  }

  const allFields = {
    title,
    description,
    startDate,
    endDate,
    estimateHours,
    priority,
    type,
    status,
    assignee,
  };

  for (const [field, value] of Object.entries(allFields)) {
    if (value === undefined || value === null) continue;

    const validator = fieldValidators[field];
    if (validator && !validator.validate(value)) {
      return res.status(400).json({ error: validator.error });
    }
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return res
      .status(400)
      .json({ error: "Start date must be before or equal to end date." });
  }

  try {
    const column = await database.query(
      `SELECT column_id FROM "columns" WHERE column_name = $1`,
      [statusToColumnName(status)],
    );

    if (!column.rows[0])
      return res.status(400).json({ error: "Invalid status" });

    const columnId = column.rows[0].column_id;

    let userId = null;
    if (assignee) {
      const user = await database.query(
        `SELECT user_id FROM users WHERE username = $1`,
        [assignee],
      );

      userId = user.rows[0].user_id;
    }

    const result = await database.query(
      `INSERT INTO tasks (column_id, user_id, task_title, task_description, 
      task_start_date, task_end_date, task_estimated_duration, task_priority, task_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING task_id`,
      [
        columnId,
        userId,
        title,
        description || null,
        startDate || null,
        endDate || null,
        estimateHours ? estimateHours : null,
        priorityToDB(priority),
        typeToDB(type),
      ],
    );

    const task = await getTaskById(result.rows[0].task_id);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task." });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  for (const [field, value] of Object.entries(updates)) {
    if (value === undefined || value === null) continue;

    const validator = fieldValidators[field];
    if (validator && !validator.validate(value)) {
      return res.status(400).json({ error: validator.error });
    }
  }

  if (updates.startDate && updates.endDate) {
    if (new Date(updates.startDate) > new Date(updates.endDate)) {
      return res
        .status(400)
        .json({ error: "Start date must be before or equal to end date." });
    }
  }

  try {
    if (updates.status) {
      const column = await database.query(
        `SELECT column_id FROM "columns" WHERE column_name = $1`,
        [statusToColumnName(updates.status)],
      );

      if (!column.rows[0])
        return res.status(400).json({ error: "Invalid status" });

      updates.column_id = column.rows[0].column_id;
    }

    if (updates.assignee) {
      const user = await database.query(
        `SELECT user_id FROM users WHERE username = $1`,
        [updates.assignee],
      );

      if (!user.rows[0])
        return res
          .status(404)
          .json({ error: `User ${updates.assignee} was not found` });

      updates.user_id = user.rows[0].user_id;
      delete updates.assignee;
    }

    const dbUpdates = {};
    if (updates.title) dbUpdates.task_title = updates.title;
    if (updates.description !== undefined)
      dbUpdates.task_description = updates.description;
    if (updates.startDate !== undefined)
      dbUpdates.task_start_date = updates.startDate;
    if (updates.endDate !== undefined)
      dbUpdates.task_end_date = updates.endDate;
    if (updates.estimateHours !== undefined)
      dbUpdates.task_estimated_duration = task.task_estimated_duration;
    if (updates.priority)
      dbUpdates.task_priority = priorityToDB(updates.priority);
    if (updates.type) dbUpdates.task_type = typeToDB(updates.type);
    if (updates.columnId) dbUpdates.column_id = updates.column_id;
    if (updates.userId) dbUpdates.user_id = updates.user_id;

    const fields = Object.keys(dbUpdates);
    const values = Object.values(dbUpdates);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");

    await database.query(
      `UPDATE tasks SET ${setClause}, task_updated_at = NOW()
       WHERE task_id = $${fields.length + 1}`,
      [...values, id],
    );

    const task = await getTaskById(id);

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    console.error(error);
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
    const tasks = result.rows.map(mapTaskToFrontend);
    res.json(tasks);
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
      return res
        .status(404)
        .json({ error: "Task not found or already archived." });
    }

    const task = await getTaskById(result.rows[0].task_id);

    res.json(task);
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
    const tasks = result.rows.map(mapTaskToFrontend);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to load archived tasks." });
  }
};

const getTasksApproachingDeadline = async (req, res) => {
  const daysBeforeDeadline = parseInt(req.query.days) || 3;

  const query = `
    SELECT t.*, u.username, c.column_name,
    EXTRACT(DAY FROM(t.task_end_date - NOW())) as days_remaining
    FROM tasks t
    JOIN users u ON t.user_id = u.user_id
    JOIN "columns" c ON c.column_id = t.column_id
    WHERE 
      t.task_is_archived = FALSE
      AND t.task_end_date IS NOT NULL
      AND t.task_end_date > NOW()
      AND t.task_end_date <= NOW() + INTERVAL '${daysBeforeDeadline} days'
    ORDER BY t.task_end_date ASC
  `;

  try {
    const result = await database.query(query);
    const tasks = result.rows.map(mapTaskToFrontend);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to load tasks nearing deadline" });
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
  getTasksApproachingDeadline,
};
