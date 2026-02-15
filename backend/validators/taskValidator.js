const VALID_PRIORITIES = ["LOW", "MID", "HIGH"];
const VALID_TASK_TYPES = ["FEATURE", "BUGFIX", "IMPROVEMENT"];

const isValidTimestamp = (val) =>
  typeof val === "string" && !isNaN(new Date(val).getTime());

const fieldValidators = {
  title: {
    validate: (val) => typeof val === "string" && val.trim().length > 0 && val.trim().length <= 100,
    error: "Task title must be a non-empty string (max 100 characters).",
    transform: (val) => val.trim(),
  },
  description: {
    validate: (val) => val === null || (typeof val === "string" && val.length <= 500),
    error: "Task description must be a string (max 500 characters) or null.",
    transform: (val) => (val === null ? null : val.trim()),
  },
  startDate: {
    validate: (val) => val === null || isValidTimestamp(val),
    error: "Task start date must be a valid timestamp string or null.",
  },
  endDate: {
    validate: (val) => val === null || isValidTimestamp(val),
    error: "Task end date must be a valid timestamp string or null.",
  },
  estimatedHours: {
    validate: (val) => val === null || (typeof val === "number" && val > 0),
    error: "Estimated duration must be a positive number (hours) or null.",
  },
  priority: {
    validate: (val) => VALID_PRIORITIES.includes(val),
    error: `Task priority must be one of: ${VALID_PRIORITIES.join(", ")}.`,
  },
  type: {
    validate: (val) => VALID_TASK_TYPES.includes(val),
    error: `Task type must be one of: ${VALID_TASK_TYPES.join(", ")}.`,
  },
  status: {
    validate: (val) => typeof val === "string" && val.length > 0,
    error: "Status is required.",
  },
  assignee: {
    validate: (val) => val === null || val === undefined || (typeof val === "string" && val.length > 0),
    error: "Assignee must be a username or null.",
  },
};

export { fieldValidators };
