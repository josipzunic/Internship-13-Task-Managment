import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const columnNames = {
  blocked: "blocked",
  todo: "todo",
  inProgress: "in progress",
  inReview: "in review",
  done: "done",
};

const taskPriority = {
  high: "high",
  low: "low",
  mid: "mid",
};

const taskType = {
  feature: "feature",
  bugfix: "bugfix",
  improvement: "improvement",
};

const users = [
  { username: "josipzunic", password: "josip123" },
  { username: "miabarada", password: "mia123" },
  { username: "davidandelictomasic", password: "davidandelic123" },
  { username: "vatroslavmastelic", password: "vatroslav123" },
];

const seedTask = [
  {
    columnId: 2,
    userId: 1,
    taskTitle: "create database",
    taskDescription: "create a postresql database for task app",
    taskStartDate: null,
    taskEndDate: null,
    taskEstimatedDuration: '5 hours',
    taskPriority: taskPriority.high,
    taskType: taskType.feature,
  },
  {
    columnId: 2,
    userId: 2,
    taskTitle: "app design ",
    taskDescription: "think of fitting app design",
    taskStartDate: null,
    taskEndDate: null,
    taskEstimatedDuration: '10 hours',
    taskPriority: taskPriority.high,
    taskType: taskType.feature,
  },
  {
    columnId: 2,
    userId: 3,
    taskTitle: "database optimization",
    taskDescription:
      "add contraints to database to prevent bad data crashing the database",
    taskStartDate: null,
    taskEndDate: null,
    taskEstimatedDuration: '2 hours',
    taskPriority: taskPriority.mid,
    taskType: taskType.improvement,
  },
  {
    columnId: 2,
    userId: 4,
    taskTitle: "frontend development",
    taskDescription: "implement application design",
    taskStartDate: null,
    taskEndDate: null,
    taskEstimatedDuration: '20 hours',
    taskPriority: taskPriority.high,
    taskType: taskType.feature,
  },
];

const seedColumns = [
  { columnName: columnNames.blocked, columnPositionOrder: 1 },
  { columnName: columnNames.todo, columnPositionOrder: 2 },
  { columnName: columnNames.inProgress, columnPositionOrder: 3 },
  { columnName: columnNames.inReview, columnPositionOrder: 4 },
  { columnName: columnNames.done, columnPositionOrder: 5 },
];

const seedUser = [
  { username: users[0].username, password: users[0].password },
  { username: users[1].username, password: users[1].password },
  { username: users[2].username, password: users[2].password },
  { username: users[3].username, password: users[3].password },
];

const seed = async () => {
  await pool.query(`
  TRUNCATE TABLE tasks, "columns", users
  RESTART IDENTITY CASCADE;`);

  const valuesColumn = [];
  const placeholdersColumn = seedColumns.map((column, index) => {
    const baseIndex = index * 2;
    valuesColumn.push(column.columnName, column.columnPositionOrder);
    return `($${baseIndex + 1}, $${baseIndex + 2})`;
  });

  await pool.query(
    `INSERT INTO "columns" (column_name, column_position_order) VALUES 
    ${placeholdersColumn.join(", ")}`,
    valuesColumn,
  );

  const valuesUser = [];
  const placeholdersUser = seedUser.map((user, index) => {
    const baseIndex = index * 2;
    valuesUser.push(user.username, user.password);
    return `($${baseIndex + 1}, $${baseIndex + 2})`;
  });

  await pool.query(
    `INSERT INTO users (username, user_password) VALUES ${placeholdersUser.join(", ")}`,
    valuesUser,
  );

  const valuesTask = [];
  const placeholdersTask = seedTask.map((task, index) => {
    const baseIndex = index * 9;
    valuesTask.push(
      task.columnId,
      task.userId,
      task.taskTitle,
      task.taskDescription,
      task.taskStartDate,
      task.taskEndDate,
      task.taskEstimatedDuration,
      task.taskPriority,
      task.taskType,
    );
    return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9})`;
  });

  await pool.query(
    `INSERT INTO tasks (column_id, user_id, task_title, task_description, task_start_date, task_end_date, task_estimated_duration, task_priority, task_type) VALUES ${placeholdersTask.join(", ")}`,
    valuesTask,
  );
};

seed()
  .then(() => {
    console.log("Columns, users, and tasks seeded");
    return pool.end();
  })
  .catch((error) => {
    console.error("Failed to seed tables", error);
    return pool.end().finally(() => process.exit(1));
  });
