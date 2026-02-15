const minPasswordLength = 8;
const minUsernameLength = 5;
const maxUsernameLength = 100;

export const userFieldValidators = {
  username: {
    validate: (val) =>
      typeof val === "string" &&
      val.trim().length >= minUsernameLength &&
      !val.includes(" ") &&
      val.trim().length <= maxUsernameLength,
    error: `Username must be non-empty string (min ${minUsernameLength}, max ${maxUsernameLength} characters) and cannot contain spaces`,
  },
  password: {
    validate: (val) =>
      typeof val === "string" &&
      val.trim().length >= minPasswordLength &&
      !val.includes(" "),
    error: `Password must be non-empty string (min ${minPasswordLength} characters) and cannot contain spaces`,
  },
  usernameAndPasswordRequired: {
    validate: (username, password) => Boolean(username) && Boolean(password),
    error: "Username and password are required fields",
  },
};
