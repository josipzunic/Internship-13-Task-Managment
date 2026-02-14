export const mapTaskToFrontend = (dbTask) => ({
  id: dbTask.task_id.toString(),
  title: dbTask.task_title,
  description: dbTask.task_description,
  status: dbTask.column_name.toUpperCase().replace(" ", "_"),
  startDate: dbTask.task_start_name,
  endDate: dbTask.task_end_date,
  estimatedHours: dbTask.task_estimated_duration,
  priority: dbTask.task_priority.toUpperCase(),
  type: dbTask.task_type.toUpperCase(),
  assignee: dbTask.username,
  userId: dbTask.userId,
  isArchived: dbTask.task_is_archived,
  archivedAt: dbTask.task_archived_at,
  createdAt: dbTask.task_created_at,
  updatedAt: dbTask.task_updated_at,
});

export const mapColumnToFrontend = (dbColumn) => ({
  key: dbColumn.column_name.toUpperCase().replace(" ", "_"),
  label:
    dbColumn.column_name.charAt(0).toUpperCase() +
    dbColumn.column_name.slice(1),
  position: dbColumn.column_position_order - 1,
});

export const statusToColumnName = (status) =>
  status.toLowerCase().replace("_", " ");
export const priorityToDB = (priority) => priority.toLowerCase();
export const typeToDB = (type) => type.toLowerCase();
