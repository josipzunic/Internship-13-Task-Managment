import { database } from "../../database/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SALT = 10;
const JWT_SECRET = process.env.JWT_SECRET || "ikaqna88ypvk6t6p1sjx74y9";

export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ error: "Username and password are required" });

  if (username.length < 5)
    return res
      .status(400)
      .json({ error: "Username must be at least 5 characters" });

  if (password.length < 6)
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });

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

    const token = jwt.sign(
      { userId: user.user_id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

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

  if (!username || !password)
    return res
      .status(400)
      .json({ error: "Username and password are required" });

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

    const token = jwt.sign(
      { userId: user.user_id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

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
