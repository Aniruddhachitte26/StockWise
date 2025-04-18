// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateUserCreate } = require("../middleware/validateUser");

// Add validation middleware to register route
router.post("/register", validateUserCreate, authController.registerUser);
router.post("/login", authController.loginUser);
// Add Google authentication route
router.post("/google", authController.googleLogin);
router.patch("/change-password/:id", authController.resetPassword)

module.exports = router;