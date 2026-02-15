import { database } from "../../database/database.js";
import {
  mapColumnToFrontend,
  statusToColumnName,
} from "../../models/mappers.js";
import {
  fieldValidators,
  validateAndBuildUpdates,
} from "../../validators/taskValidator.js";

export const getAllColumns = async (_req, res) => {
  try {
    const query = `
        SELECT 
            c.*,
            COUNT(t.task_id) FILTER (WHERE t.task_is_archived = FALSE) as task_count
        FROM "columns" c
        LEFT JOIN tasks t ON c.column_id = t.column_id
        GROUP BY c.column_id
        ORDER BY c.column_position_order ASC
    `;
    const result = await database.query(query);
    const columns = result.rows.map(mapColumnToFrontend);
    res.json(columns);
  } catch (error) {
    res.status(500).json({ error: "Failed to load counts of tasks" });
  }
};

export const moveColumn = async (req, res) => {
  const { key } = req.params;
  const { direction } = req.body;

  const columnName = statusToColumnName(key);

  try {
    database.query("BEGIN");

    const current = await database.query(
      'SELECT column_id, column_position_order FROM "columns" WHERE column_name = $1',
      [columnName],
    );

    if (!current.rows[0]) {
      await database.query("ROLLBACK");
      return res.status(404).json({ error: "Column not found" });
    }

    const currentPosition = current.rows[0].column_position_order;
    const newPosition =
      direction === "left" ? currentPosition - 1 : currentPosition + 1;

    const maxResult = await database.query(
      'SELECT MAX(column_position_order) as max FROM "columns"',
    );
    const maxPosition = maxResult.rows[0].max;

    if (newPosition < 1 || newPosition > maxPosition) {
      await database.query("ROLLBACK");
      return res
        .status(400)
        .json({ error: "Cannot move column out of bounds" });
    }

    await database.query(
      'UPDATE "columns" SET column_position_order = -1 WHERE column_position_order = $1',
      [newPosition],
    );
    await database.query(
      'UPDATE "columns" SET column_position_order = $1, column_updated_at = NOW() WHERE column_id = $2',
      [newPosition, current.rows[0].column_id],
    );
    await database.query(
      'UPDATE "columns" SET column_position_order = $1, column_updated_at = NOW() WHERE column_position_order = -1',
      [currentPosition],
    );

    await database.query("COMMIT");

    const result = await database.query(
      'SELECT * FROM "columns" ORDER BY column_position_order',
    );
    const columns = result.rows.map(mapColumnToFrontend);
    res.json(columns);
  } catch (error) {
    await database.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Failed to move column" });
  }
};
