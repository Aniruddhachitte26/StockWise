// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateUserCreate } = require("../middleware/validateUser");

// Add validation middleware to register route
router.post("/register", validateUserCreate, authController.registerUser);
router.post("/login", authController.loginUser);

module.exports = router;