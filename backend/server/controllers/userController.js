import { database } from "../../database/database.js";
import bcrypt from "bcrypt";
import { userFieldValidators } from "../../validators/userValidator.js";
import { createJwtToken } from "../../database/helper/helper.js";

const SALT = 10;

export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (
    !userFieldValidators.usernameAndPasswordRequired.validate(
      username,
      password,
    )
  )
    return res
      .status(400)
      .json({ error: userFieldValidators.usernameAndPasswordRequired.error });

  if (!userFieldValidators.username.validate(username))
    return res.status(400).json({ error: userFieldValidators.username.error });

  if (!userFieldValidators.password.validate(password))
    return res.status(400).json({ error: userFieldValidators.password.error });

  try {
    const existingUser = await database.query(
      "SELECT username FROM users WHERE username = $1",
      [username],
    );

    if (existingUser.rows[0])
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, SALT);

    const result = await database.query(
      "INSERT INTO users (username, user_password) VALUES ($1, $2) RETURNING user_id, username",
      [username, hashedPassword],
    );

    const user = result.rows[0];

    const token = createJwtToken(user);

    res.json({
      message: "User created successfully",
      user: {
        id: user.user_id,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (
    !userFieldValidators.usernameAndPasswordRequired.validate(
      username,
      password,
    )
  )
    return res
      .status(400)
      .json({ error: userFieldValidators.usernameAndPasswordRequired.error });

  try {
    const result = await database.query(
      "SELECT user_id, username, user_password FROM users WHERE username = $1",
      [username],
    );

    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const comparePassword = await bcrypt.compare(password, user.user_password);

    if (!comparePassword)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = createJwtToken(user);

    res.json({
      message: "User logged in successfully",
      user: {
        id: user.user_id,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const users = await database.query(
      "SELECT user_id, username FROM users ORDER BY username ASC",
    );

    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to load users" });
  }
};
