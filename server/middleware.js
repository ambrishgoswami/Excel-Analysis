import jwt from "jsonwebtoken";
import AuthUser from "./models/AuthUser.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await AuthUser.findById(req.user.id || req.user._id);
    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Admin access required" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}; 