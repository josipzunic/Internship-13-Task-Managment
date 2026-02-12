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
        <h1 class="task-title">${task.title}</h1>
        <div class="line-horizontal"></div>
        <div class="task-meta">
            <div class="info-line">
                <span>${task.assignee}</span>
                <div class="line-vertical"></div>
                <span>${task.type}</span>
            </div>
            <div class="info-line">
                ${task.assignee ? `<span>@${task.assignee}</span>` : ""}
                <div class="line-vertical"></div>
                ${task.endDate ? `<span>Due: ${task.endDate}</span>` : ""}
            </div>
        </div>
    `;

    return el;
}