// backend/controllers/adminController.js

const User = require("../models/userModel");

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total users count (excluding admins)
    const totalUsers = await User.countDocuments({ type: { $ne: "admin" } });
    
    // Get users by verification status (excluding admins)
    const activeUsers = await User.countDocuments({ 
      verified: "approved", 
      type: { $ne: "admin" } 
    });
    
    const pendingUsers = await User.countDocuments({ 
      verified: "pending", 
      type: { $ne: "admin" } 
    });
    
    const rejectedUsers = await User.countDocuments({ 
      verified: "rejected", 
      type: { $ne: "admin" } 
    });
    
    // Get user registrations for the last 7 days (excluding admins)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          type: { $ne: "admin" }  // Exclude admins
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
    
    // Fill in missing days with zero counts
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const completeWeeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (currentDay - i + 7) % 7; // Ensure positive index
      const day = daysOfWeek[dayIndex];
      
      // Find if we have data for this day
      const existingData = formattedWeeklyRegistrations.find(item => item.day === day);
      
      if (existingData) {
        completeWeeklyData.push(existingData);
      } else {
        completeWeeklyData.push({ day, count: 0 });
      }
    }
    
    // We're only getting regular users
    const regularUsers = totalUsers;
    
    // Create data for charts
    const userStatuses = [
      { name: "Approved", value: activeUsers },
      { name: "Pending", value: pendingUsers },
      { name: "Rejected", value: rejectedUsers }
    ];
    
    // Just include regular users count - remove admin data
    const userTypes = [
      { name: "Regular Users", value: regularUsers }
    ];
    
    // Get some mock stock performance data for now
    // In a real app, this would come from your stock data API
    const stockPerformance = [
      { name: 'Jan', value: 1000 },
      { name: 'Feb', value: 1200 },
      { name: 'Mar', value: 1100 },
      { name: 'Apr', value: 1300 },
      { name: 'May', value: 1600 },
      { name: 'Jun', value: 1500 },
      { name: 'Jul', value: 1800 }
    ];
    
    return res.status(200).json({
      totalUsers,
      activeUsers,
      pendingUsers,
      rejectedUsers,
      weeklyRegistrations: completeWeeklyData,
      userStatuses,
      userTypes,
      stockPerformance
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