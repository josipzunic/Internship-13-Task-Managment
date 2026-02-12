function getDeadlineClass(deadline) {
    if (!deadline) return "";

    const now = new Date();
    const end = new Date(deadline);

    const diffInMs = end - now;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 0) return "task-card--overdue";
    if (diffInHours < 24) return "task-card--due-soon";
    return "";
}

export function renderTaskCard(task) {
    const el = document.createElement("div");
    el.className = `task-card ${getDeadlineClass(task.endDate)}`.trim();

    el.innerHTML = `
        <p class="task-title">${task.title}</p>
        <div class="task-meta">
            <span>${task.assignee}</span>
            <span>${task.type}</span>
            ${task.assignee ? `<span>@${task.assignee}</span>` : ""}
            ${task.endDate ? `<span>Due: ${task.endDate}</span>` : ""}
        </div>
    `;

    return el;
}