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
			default: "user",
			enum: ["admin", "user"], // This ensures the type can only be "admin" or "employee"
			trim: true,
		},
		googleId: {
			type: String,
			default: null,
		},
		authProvider: {
			type: String,
			enum: ["local", "google"],
			default: "local",
		},
        address: {
            type: String,
            default: null,
        },
        phone: {
            type: String,
            default: null,
        },
        dateOfBirth: {
            type: Date,
            default: null,
        },
        proof : {
            type: String,
            default: null,
        },
        proofType : {
            type: String,
            default: null,
            enum: ["driving license", "passport", null],
        },
        verified: {
			type: String,
            default: "pending",
            enum: ["pending", "approved", "rejected"],
        },
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
