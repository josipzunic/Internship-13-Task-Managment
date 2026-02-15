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
