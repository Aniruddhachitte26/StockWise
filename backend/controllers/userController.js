const User = require("../models/userModel");
const { hashPassword } = require("../middleware/authmiddleware");

// Update user details
const updateUser = async (req, res) => {
	try {
		const { email, fullName, password } = req.body;

		// Email is required to find the user
		if (!email) {
			return res.status(400).json({
				error: "Email is required to identify the user.",
			});
		}

		// Find user
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ error: "User not found." });
		}

		// Update fields if provided
		if (fullName) {
			user.fullName = fullName;
		}

		// Update and hash password if provided
		if (password) {
			user.password = await hashPassword(password);
		}

		await user.save();

		return res
			.status(200)
			.json({ message: "User updated successfully." });
	} catch (error) {
		console.error("Error updating user:", error);
		return res.status(500).json({
			error: "Server error. Failed to update user.",
		});
	}
};

// Delete user
const deleteUser = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				error: "Email is required to identify the user.",
			});
		}

		// Find and delete the user
		const user = await User.findOneAndDelete({ email });

		if (!user) {
			return res
				.status(404)
				.json({ error: "User not found." });
		}

		return res
			.status(200)
			.json({ message: "User deleted successfully." });
	} catch (error) {
		console.error("Error deleting user:", error);
		return res.status(500).json({
			error: "Server error. Failed to delete user.",
		});
	}
};

// Get all users
const getAllUsers = async (req, res) => {
	try {
		// Update the select method to exclude the password field by using "-password"
		const users = await User.find({}).select(
			"fullName email type imagePath"
		);

		return res.status(200).json({ users });
	} catch (error) {
		console.error("Error retrieving users:", error);
		return res.status(500).json({
			error: "Server error. Failed to retrieve users.",
		});
	}
};

module.exports = {
	updateUser,
	deleteUser,
	getAllUsers,
};
