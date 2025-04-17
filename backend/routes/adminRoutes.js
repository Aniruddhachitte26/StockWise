// backend/routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { 
  authenticateUser, 
  authorizeAdmin 
} = require("../middleware/authmiddleware");

// Apply authentication and admin authorization to all routes
router.use(authenticateUser, authorizeAdmin);

// Dashboard stats
router.get("/stats", adminController.getDashboardStats);

// User management
router.get("/users", adminController.getAllUsers);
router.get("/pending-users", adminController.getPendingUsers);
router.post("/verify-user", adminController.verifyUser);
router.put("/update-user-status", adminController.updateUserStatus);

// Recent users
router.get("/recent-users", adminController.getRecentUsers);

module.exports = router;