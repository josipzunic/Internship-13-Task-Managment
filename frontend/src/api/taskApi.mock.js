import { readJson, writeJson } from "../utils/storage.js";

const KEY_TASKS = "tm_tasks";
const KEY_COLUMNS = "tm_columns";

const DEFAULT_COLUMNS = [
    { key: "BLOCKED", label: "Blocked", position: 0 },
    { key: "TODO", label: "ToDo", position: 1 },
    { key: "IN_PROGRESS", label: "In Progress", position: 2 },
    { key: "IN_REVIEW", label: "Review", position: 3 },
    { key: "DONE", label: "Done", position: 4 },
];

const seedTasks = [
    {
        id: "t1",
        title: "Setup project structure",
        description: "",
        status: "TODO",
        startDate: "2026-02-11",
        endDate: "2026-02-13",
        estimateHours: 3,
        priority: "MID",
        type: "IMPROVEMENT",
        assignee: "Josip",
        isArchived: false,
        archivedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    {
        id: "t2",
        title: "Implement drag & drop",
        description: "",
        status: "IN_PROGRESS",
        startDate: "2026-02-11",
        endDate: "2026-02-12",
        estimateHours: 5,
        priority: "HIGH",
        type: "FEATURE",
        assignee: "Mia",
        isArchived: false,
        archivedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    {
        id: "t3",
        title: "Fix date validation",
        description: "",
        status: "BLOCKED",
        startDate: "2026-02-11",
        endDate: "2026-02-11",
        estimateHours: 2,
        priority: "LOW",
        type: "BUGFIX",
        assignee: "David",
        isArchived: false,
        archivedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

function ensureSeeded() {
    const cols = readJson(KEY_COLUMNS, null);
    if(!cols) writeJson(KEY_COLUMNS, DEFAULT_COLUMNS);

    const tasks = readJson(KEY_TASKS, null);
    if(!tasks) writeJson(KEY_TASKS, seedTasks);
}

function delay(ms = 80){
    return new Promise((r) => setTimeout(r, ms));
}

export const tasksApi = {

    async getColumns(){
        ensureSeeded();
        await delay();
        const cols = readJson(KEY_COLUMNS, DEFAULT_COLUMNS);
        return[...cols].sort((a, b) => a.position - b.position);
    },

    async moveColumn(key, direction){
        ensureSeeded();
        await delay();

        const cols = readJson(KEY_COLUMNS, DEFAULT_COLUMNS).sort(
            (a, b) => a.position - b.position,
        );

        const idx = cols.findIndex((c) => c.key === key);
        if(idx === -1) return cols;

        const swapWith = direction === "left" ? idx - 1 : idx + 1;
        if(swapWith < 0 || swapWith >= cols.length) return cols;

        const tmp = cols[idx].position;
        cols[idx].position = cols[swapWith].position;
        cols[swapWith].position = tmp;

        writeJson(KEY_COLUMNS, cols);
        return cols.sort((a, b) => a.position - b.position);
    },

    async getTasks({archived = false} ={}){
        ensureSeeded();
        await delay();
        const tasks =  readJson(KEY_TASKS, []);
        return tasks.filter((t) => t.isArchived === archived);
    },

    async updateTask(id, patch){
        ensureSeeded();
        await delay();

        const tasks = readJson(KEY_TASKS, []);
        const idx = tasks.findIndex((t) => t.id === id);
        if(idx === -1) throw new Error("Task not found");

        tasks[idx] = {
            ...tasks[idx],
            ...patch,
            updatedAt: new Date().toISOString(),
        };

        writeJson(KEY_TASKS, tasks);
        return tasks[idx];
    },

    async createTask(payload){
        ensureSeeded();
        await delay();

        const tasks = readJson(KEY_TASKS, []);
        const now = new Date().toISOString();
        const newTask = {
            id: `t${Date.now()}`,
            title: payload.title,
            description: payload.description || "",
            status: payload.status || "TODO",
            startDate: payload.startDate || null,
            endDate: payload.endDate || null,
            estimateHours: payload.estimateHours || 0,
            priority: payload.priority || "MID",
            type: payload.type || "FEATURE",
            assignee: payload.assignee || null,
            userId: payload.userId || null,

            isArchived: false,
            archivedAt: null,
            createdAt: now,
            updatedAt: now,
        };

        tasks.push(newTask);
        writeJson(KEY_TASKS, tasks);
        return newTask;
    },

    async deleteTask(id){
        ensureSeeded();
        await delay();
        const tasks = readJson(KEY_TASKS, []);
        const next = tasks.filter((t) => t.id !== id);
        writeJson(KEY_TASKS, next);
        return true;
    },

    async archiveTask(id){
        ensureSeeded();
        await delay();

        const tasks = readJson(KEY_TASKS, []);
        const idx = tasks.findIndex((t) => t.id === id);
        if(idx === -1) throw new Error("Task not found");

        const now = new Date().toISOString();
        tasks[idx] = {
            ...tasks[idx],
            isArchived: true,
            archivedAt: now,
            updatedAt: now,
        };

        writeJson(KEY_TASKS, tasks);
        return tasks[idx];
    },
};