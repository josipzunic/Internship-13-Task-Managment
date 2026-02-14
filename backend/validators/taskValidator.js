const VALID_PRIORITIES = ["low", "mid", "high"];
const VALID_TASK_TYPES = ["feature", "bugfix", "improvement"];

const isValidTimestamp = (val) =>
  typeof val === "string" && !isNaN(new Date(val).getTime());

const fieldValidators = {
  task_title: {
    validate: (val) => typeof val === "string" && val.trim().length > 0 && val.trim().length <= 100,
    error: "Task title must be a non-empty string (max 100 characters).",
    transform: (val) => val.trim(),
  },
  task_description: {
    validate: (val) => val === null || (typeof val === "string" && val.length <= 500),
    error: "Task description must be a string (max 500 characters) or null.",
    transform: (val) => (val === null ? null : val.trim()),
  },
  task_start_date: {
    validate: (val) => val === null || isValidTimestamp(val),
    error: "Task start date must be a valid timestamp string or null.",
  },
  task_end_date: {
    validate: (val) => val === null || isValidTimestamp(val),
    error: "Task end date must be a valid timestamp string or null.",
  },
  task_estimated_duration: {
    validate: (val) => val === null || (typeof val === "number" && val > 0),
    error: "Estimated duration must be a positive number (hours) or null.",
  },
  task_priority: {
    validate: (val) => VALID_PRIORITIES.includes(val),
    error: `Task priority must be one of: ${VALID_PRIORITIES.join(", ")}.`,
  },
  task_type: {
    validate: (val) => VALID_TASK_TYPES.includes(val),
    error: `Task type must be one of: ${VALID_TASK_TYPES.join(", ")}.`,
  },
  column_id: {
    validate: (val) => typeof val === "number" && val > 0,
    error: "Column ID must be a positive number.",
  },
  user_id: {
    validate: (val) => typeof val === "number" && val > 0,
    error: "User ID must be a positive number.",
  },
};

const validateAndBuildUpdates = (fields) => {
  const updates = [];
  const values = [];

  for (const [field, value] of Object.entries(fields)) {
    if (value === undefined) continue;

    const validator = fieldValidators[field];
    if (!validator) continue;

    if (!validator.validate(value)) {
      return { error: validator.error };
    }

    updates.push(`${field} = $${updates.length + 1}`);
    values.push(validator.transform ? validator.transform(value) : value);
  }

  if (
    fields.task_start_date != null &&
    fields.task_end_date != null &&
    new Date(fields.task_start_date) > new Date(fields.task_end_date)
  ) {
    return { error: "Task start date must be before or equal to end date." };
  }

  if (updates.length === 0) {
    return { error: "No valid fields provided for update." };
  }

  return { updates, values };
};

export { fieldValidators, validateAndBuildUpdates };
