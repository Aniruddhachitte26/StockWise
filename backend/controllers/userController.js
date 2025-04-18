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
			"fullName email type imagePath address phone dateOfBirth proof proofType verified createdAt updatedAt"
		);

		return res.status(200).json({ users });
	} catch (error) {
		console.error("Error retrieving users:", error);
		return res.status(500).json({
			error: "Server error. Failed to retrieve users.",
		});
	}
};

const getUserDetails = async (req, res) => {
	console.log("getUserDetails inside")
	try {
		const userId = req.params.id;
		const user = await User.findById(userId).select("-password"); // exclude password
	
		if (!user) {
		  return res.status(404).json({ message: "User not found" });
		}
	
		res.status(200).json(user);
	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).json({ message: "Server error" });
	}
};


// backend/controllers/userController.js - Update the updateUserDetails function

const updateUserDetails = async(req, res) =>{
	console.log("updateUserDetails called with req.body:", req.body);
	const { fullName, email, phone, address, _id, verified } = req.body;
  
	try {
	  const user = await User.findById(_id);
	  if (!user) return res.status(404).json({ message: "User not found" });
  
	  // Update basic profile fields if provided
	  if (fullName !== undefined) user.fullName = fullName;
	  if (email !== undefined && email !== user.email) {
		// Check if email is already in use by another user
		const existingUser = await User.findOne({ email });
		if (existingUser && existingUser._id.toString() !== user._id.toString()) {
		  return res.status(400).json({ message: "Email already in use" });
		}
		user.email = email;
	  }
	  if (phone !== undefined) user.phone = phone;
	  if (address !== undefined) user.address = address;
	  
	  // Handle verification status update
	  if (verified !== undefined) {
		console.log(`Updating user ${user._id} verification status to ${verified}`);
		user.verified = verified;
	  }
  
	  await user.save();
	  console.log(`User ${user._id} updated successfully. Verified status: ${user.verified}`);
  
	  res.status(200).json({
		message: "Profile updated successfully",
		user: {
		  _id: user._id,
		  fullName: user.fullName,
		  email: user.email,
		  phone: user.phone,
		  address: user.address,
		  verified: user.verified,
		  updatedAt: user.updatedAt,
		},
	  });
	} catch (error) {
	  console.error("Error updating profile:", error);
	  res.status(500).json({ message: "Internal server error" });
	}
  }
module.exports = {
	updateUser,
	deleteUser,
	getAllUsers,
	getUserDetails,
	updateUserDetails
};
