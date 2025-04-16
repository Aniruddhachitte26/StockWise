// Validate email format
const validateEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

// Validate full name (only alphabetic characters and spaces)
const validateFullName = (name) => {
	const nameRegex = /^[A-Za-z\s]+$/;
	return nameRegex.test(name);
};

// Validate password strength
const validatePassword = (password) => {
	// At least 8 characters, one uppercase, one lowercase, one digit, one special character
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
	return passwordRegex.test(password);
};

// Validate user type
const validateUserType = (type) => {
	return type === "admin" || type === "employee";
};

// Middleware for validating user creation
const validateUserCreate = (req, res, next) => {
	const { fullName, email, password, type } = req.body;

	// Check if all required fields are present
	if (!fullName || !email || !password || !type) {
		return res
			.status(400)
			.json({ error: "All fields are required." });
	}

	// Validate full name
	if (!validateFullName(fullName)) {
		return res.status(400).json({
			error: "Full name must contain only alphabetic characters.",
		});
	}

	// Validate email
	if (!validateEmail(email)) {
		return res.status(400).json({ error: "Invalid email format." });
	}

	// Validate password
	if (!validatePassword(password)) {
		return res.status(400).json({
			error: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
		});
	}

	// Validate type
	if (!validateUserType(type)) {
		return res.status(400).json({
			error: "User type must be either 'admin' or 'employee'.",
		});
	}

	next();
};

// Middleware for validating user updates
const validateUserUpdate = (req, res, next) => {
	const { fullName, password, type } = req.body;

	// Validate full name if provided
	if (fullName && !validateFullName(fullName)) {
		return res.status(400).json({
			error: "Full name must contain only alphabetic characters.",
		});
	}

	// Validate password if provided
	if (password && !validatePassword(password)) {
		return res.status(400).json({
			error: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
		});
	}

	// Validate type if provided
	if (type && !validateUserType(type)) {
		return res.status(400).json({
			error: "User type must be either 'admin' or 'employee'.",
		});
	}

	next();
};

module.exports = {
	validateUserCreate,
	validateUserUpdate,
	validateUserType, // Export this for potential use elsewhere
};