// backend/controllers/adminController.js

const User = require("../models/userModel");

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get users by status
    const activeUsers = await User.countDocuments({ status: "active" });
    const pendingUsers = await User.countDocuments({ status: "pending" });
    const rejectedUsers = await User.countDocuments({ status: "rejected" });
    
    // Get user registrations for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Format the weekly registrations for the frontend
    const formattedWeeklyRegistrations = weeklyRegistrations.map(item => ({
      day: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
      count: item.count
    }));
    
    // Get user types distribution
    const adminUsers = await User.countDocuments({ type: "admin" });
    const regularUsers = await User.countDocuments({ type: "user" });
    
    return res.status(200).json({
      totalUsers,
      activeUsers,
      pendingUsers,
      rejectedUsers,
      weeklyRegistrations: formattedWeeklyRegistrations,
      userStatuses: [
        { name: "Active", value: activeUsers },
        { name: "Pending", value: pendingUsers },
        { name: "Rejected", value: rejectedUsers }
      ],
      userTypes: [
        { name: "Regular Users", value: regularUsers },
        { name: "Admin", value: adminUsers }
      ]
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return res.status(500).json({
      error: "Server error. Failed to get dashboard statistics."
    });
  }
};

// Get all users with pagination, sorting, and filtering
const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      filter = "all", 
      sortBy = "createdAt", 
      sortOrder = "desc" 
    } = req.query;
    
    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build filter query
    let filterQuery = {};
    
    // Apply status filter if not "all"
    if (filter !== "all") {
      filterQuery.status = filter;
    }
    
    // Apply search if provided
    if (search) {
      filterQuery.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    // Build sort object
    const sortQuery = {};
    sortQuery[sortBy] = sortOrder === "asc" ? 1 : -1;
    
    // Get users with pagination
    const users = await User.find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .select("fullName email type status createdAt lastLogin");
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(filterQuery);
    
    return res.status(200).json({
      users,
      totalUsers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / parseInt(limit))
    });
  } catch (error) {
    console.error("Error getting users:", error);
    return res.status(500).json({
      error: "Server error. Failed to get users."
    });
  }
};

// Get pending users for verification
const getPendingUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get pending users with pagination
    const pendingUsers = await User.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("fullName email phone type status createdAt verificationDetails");
    
    // Get total count for pagination
    const totalPendingUsers = await User.countDocuments({ status: "pending" });
    
    return res.status(200).json({
      pendingUsers,
      totalPendingUsers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPendingUsers / parseInt(limit))
    });
  } catch (error) {
    console.error("Error getting pending users:", error);
    return res.status(500).json({
      error: "Server error. Failed to get pending users."
    });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { userId, action, note } = req.body;
    
    if (!userId || !action) {
      return res.status(400).json({
        error: "User ID and action are required."
      });
    }
    
    if (action !== "approve" && action !== "reject") {
      return res.status(400).json({
        error: "Invalid action. Must be 'approve' or 'reject'."
      });
    }
    
    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: "User not found."
      });
    }
    
    // Update user verification status based on action
    user.verified = action === "approve";
    
    // Save verification note if provided
    if (note) {
      // In a real application, you might want to store notes in a separate field
      // For now, just log it
      console.log(`Verification note for user ${userId}: ${note}`);
    }
    
    await user.save();
    
    return res.status(200).json({
      message: `User has been ${action === "approve" ? "approved" : "rejected"} successfully.`,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({
      error: "Server error. Failed to verify user."
    });
  }
};

const getRecentUsers = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("fullName email type status createdAt");
    
    return res.status(200).json({
      recentUsers
    });
  } catch (error) {
    console.error("Error getting recent users:", error);
    return res.status(500).json({
      error: "Server error. Failed to get recent users."
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getPendingUsers,
  verifyUser,
  getRecentUsers
};