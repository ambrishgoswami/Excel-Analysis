import express from "express";
import {
  getAdmins,
  getUserPerformance,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAdminAnalytics,
  updateUserProfileImage,
  getAdminStats,
} from "../controllers/management.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/admins", getAdmins);
router.get("/performance/:id", getUserPerformance);

// Admin panel routes
router.get("/users", getAllUsers);
router.patch("/user/:id/role", updateUserRole);
router.patch("/user/:id/status", updateUserStatus);
router.delete("/user/:id", deleteUser);
router.get("/analytics", getAdminAnalytics);
router.patch("/user/:id/profile-image", upload.single("profileImage"), updateUserProfileImage);
router.get("/admin/stats", getAdminStats);

export default router;
