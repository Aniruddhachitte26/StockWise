const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Add login route
router.post("/login", authController.loginUser);

module.exports = router;