import { database } from "../../database/database.js";

const getColumns = async (_req, res) => {
  try {
    const result = await database.query(
      "SELECT column_id, column_name, column_position_order FROM columns ORDER BY column_position_order ASC",
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to load columns." });
  }
};

export { getColumns };
