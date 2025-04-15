const User = require("../models/userModel");
const { comparePassword, hashPassword } = require("../middleware/authmiddleware");
const jwt = require("jsonwebtoken");

// User login
const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate input
		if (!email) {
			return res.status(400).json({
				error: "Email is required.",
			});
		}

		// Validate input
		if (!password) {
			return res.status(400).json({
				error: "Password is required.",
			});
		}

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(401)
				.json({ error: "User does not exist!" });
		}

		// Verify password
		const isPasswordValid = await comparePassword(
			password,
			user.password
		);
		if (!isPasswordValid) {
			return res
				.status(401)
				.json({ error: "Invalid credentials." });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ id: user._id, email: user.email, type: user.type },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		// Return user info and token
		return res.status(200).json({
			message: "Login successful.",
			user: {
				id: user._id,
				fullName: user.fullName,
				email: user.email,
				type: user.type, // Include user type in the response
			},
			token,
		});
	} catch (error) {
		console.error("Error logging in:", error);
		return res.status(500).json({
			error: "Server error. Failed to login.",
		});
	}
};

// Create a new user
const registerUser = async (req, res) => {
	try {
		const { fullName, email, password, type } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				error: "User with this email already exists.",
			});
		}

		// Hash password
		const hashedPassword = await hashPassword(password);

		// Create new user
		const user = new User({
			fullName,
			email,
			password: hashedPassword,
			type,
		});

		await user.save();

		return res
			.status(201)
			.json({ message: "User created successfully." });
	} catch (error) {
		console.error("Error creating user:", error);
		return res.status(500).json({
			error: "Server error. Failed to create user.",
		});
	}
};

module.exports = {
	loginUser,
    registerUser
};
