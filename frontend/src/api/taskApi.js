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

export const tasksApi = {
  async getColumns() {
    return request("/columns");
  },

  async moveColumn(key, direction) {
    return request(`/columns/${key}/move`, {
      method: "PATCH",
      body: JSON.stringify({ direction }),
    });
  },

  async getTasks({ archived = false } = {}) {
    return request(`/tasks?archived=${archived}`);
  },

  async createTask(task) {
    return request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },

  async updateTask(taskId, updates) {
    if (updates.archived) {
      return request(`/tasks/${taskId}/archive`, { method: "PATCH" });
    }
    return request(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  async deleteTask(taskId) {
    return request(`/tasks/${taskId}`, { method: "DELETE" });
  },
};
