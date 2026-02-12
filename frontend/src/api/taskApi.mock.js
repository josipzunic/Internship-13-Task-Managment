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

