async function request(url, options = {}) {
  const res = await fetch(`/api${url}`, {
    ...options,
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

const COLUMN_NAME_TO_KEY = {
  blocked: "BLOCKED",
  todo: "TODO",
  "in progress": "IN_PROGRESS",
  "in review": "IN_REVIEW",
  done: "DONE",
};

function mapTaskFromApi(task) {
  return {
    id: task.task_id,
    title: task.task_title,
    description: task.task_description,
    status: COLUMN_NAME_TO_KEY[task.column_name] || task.column_name,
    columnId: task.column_id,
    userId: task.user_id,
    startDate: task.task_start_date,
    endDate: task.task_end_date,
    estimateHours: task.task_estimated_duration,
    priority: task.task_priority,
    type: task.task_type,
    assignee: null,
    isArchived: task.task_is_archived,
    archived: task.task_is_archived,
    archivedAt: task.task_archived_at,
    createdAt: task.task_created_at,
    updatedAt: task.task_updated_at,
  };
}

function mapColumnFromApi(col) {
  return {
    id: col.column_id,
    key: COLUMN_NAME_TO_KEY[col.column_name] || col.column_name,
    label: col.column_name,
    position: col.column_position_order,
  };
}

export const tasksApi = {
  async getColumns() {
    const rows = await request("/columns");
    return rows.map(mapColumnFromApi).sort((a, b) => a.position - b.position);
  },

  async getTasks({ archived = false } = {}) {
    const url = archived ? "/tasks/archived" : "/tasks";
    const rows = await request(url);
    return rows.map(mapTaskFromApi);
  },
};
