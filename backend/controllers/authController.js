const User = require("../models/userModel");
const {
	comparePassword,
	hashPassword,
} = require("../middleware/authmiddleware");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

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

// Initialize the Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google login handler
const googleLogin = async (req, res) => {
	try {
		const { idToken } = req.body;

		// Use the access token to get user info from Google
		const googleUserInfo = await axios.get(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			{
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			}
		);

		// Extract user data from Google's response
		const {
			sub: googleId,
			email,
			name: fullName,
			picture: profilePicture,
		} = googleUserInfo.data;

		// Check if user exists
		let user = await User.findOne({ email });

		if (!user) {
			// Create a new user if not exists
			const randomPassword = Math.random()
				.toString(36)
				.slice(-8);
			const hashedPassword = await hashPassword(
				randomPassword
			);

			user = new User({
				fullName,
				email,
				password: hashedPassword,
				googleId,
				authProvider: "google",
				type: "user",
				imagePath: profilePicture || null,
			});

			await user.save();
		} else if (!user.googleId) {
			// If user exists but doesn't have googleId, update it
			user.googleId = googleId;
			user.authProvider = "google";

			// Update profile picture if not set
			if (!user.imagePath && profilePicture) {
				user.imagePath = profilePicture;
			}

			await user.save();
		}

		// Generate JWT token
		const token = jwt.sign(
			{ id: user._id, email: user.email, type: user.type },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		// Return user info and token
		return res.status(200).json({
			message: "Google login successful.",
			user: {
				id: user._id,
				fullName: user.fullName,
				email: user.email,
				type: user.type,
				imagePath: user.imagePath,
			},
			token,
		});
	} catch (error) {
		console.error("Error with Google login:", error);
		return res.status(500).json({
			error: "Server error. Failed to authenticate with Google.",
		});
	}
};

module.exports = {
	loginUser,
	registerUser,
	googleLogin,
};
