import mongoose from "mongoose";
import AuthUser from "../models/AuthUser.js";
import Transaction from "../models/Transaction.js";
import ExcelUpload from "../models/ExcelUpload.js";
import AnalysisHistory from "../models/AnalysisHistory.js";
import path from "path";

export const getAdmins = async (req, res) => {
  try {
    const admins = await AuthUser.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;

    const userWithStats = await AuthUser.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },
      {
        $unwind: { path: "$affiliateStats", preserveNullAndEmptyArrays: true },
      },
    ]);

    const salesTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((id) => {
        return Transaction.findById(id);
      })
    );

    const filteredSaleTransactions = salesTransactions.filter(
      (transaction) => transaction !== null
    );

    res
      .status(200)
      .json({ user: userWithStats[0], sales: filteredSaleTransactions });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await AuthUser.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !["user", "admin", "superadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await AuthUser.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (typeof status !== "boolean") {
      return res.status(400).json({ message: "Invalid status" });
    }
    const user = await AuthUser.findByIdAndUpdate(id, { status }, { new: true }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await AuthUser.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin analytics (summary)
export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await AuthUser.countDocuments();
    const adminUsers = await AuthUser.countDocuments({ role: "admin" });
    const activeUsers = await AuthUser.countDocuments({ status: true });
    const totalUploads = await ExcelUpload.countDocuments();
    const uploadsPerUser = await ExcelUpload.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
    ]);
    const recentUploads = await ExcelUpload.find().sort({ uploadedAt: -1 }).limit(5).populate("user", "name email");
    const recentUsers = await AuthUser.find().sort({ createdAt: -1 }).limit(5).select("-password");
    res.status(200).json({
      totalUsers,
      adminUsers,
      activeUsers,
      totalUploads,
      uploadsPerUser,
      recentUploads,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Save relative path for frontend access
    const imagePath = `/uploads/${req.file.filename}`;
    const user = await AuthUser.findByIdAndUpdate(
      id,
      { profileImage: imagePath },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "Profile image updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await AuthUser.countDocuments();
    const totalUploads = await ExcelUpload.countDocuments();
    const totalAnalyses = await AnalysisHistory.countDocuments();
    const activeUsers = await AuthUser.countDocuments({ status: true });
    const recentUploads = await ExcelUpload.find().sort({ uploadedAt: -1 }).limit(5).populate("user", "name email");
    const recentAnalyses = await AnalysisHistory.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email");

    // User growth (last 12 months)
    const userGrowth = await AuthUser.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Upload trend (last 12 months)
    const uploadTrend = await ExcelUpload.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$uploadedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Analysis trend (last 12 months)
    const analysisTrend = await AnalysisHistory.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log({
      totalUsers,
      totalUploads,
      totalAnalyses,
      activeUsers,
      recentUploads,
      recentAnalyses,
      userGrowth,
      uploadTrend,
      analysisTrend,
    });

    res.status(200).json({
      totalUsers,
      totalUploads,
      totalAnalyses,
      activeUsers,
      recentUploads,
      recentAnalyses,
      userGrowth,
      uploadTrend,
      analysisTrend,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
