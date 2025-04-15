const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: [true, "Full name is required"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		imagePath: {
			type: String,
			default: null,
		},
		type: {
			type: String,
			required: [true, "User type is required"],
			enum: ["admin", "employee"], // This ensures the type can only be "admin" or "employee"
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
