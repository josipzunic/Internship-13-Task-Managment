import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ikaqna88ypvk6t6p1sjx74y9";

export const requireAuthentification = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
