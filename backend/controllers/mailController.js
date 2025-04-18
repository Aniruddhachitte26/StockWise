// mailController.js

const nodemailer = require("nodemailer");

const senderEmail = "sujaysn46alt@gmail.com";
const appPassword = "seiaiyuikzrfeaqx"; // <-- USE THE 16-CHARACTER APP PASSWORD HERE

let transporter;
try {
	transporter = nodemailer.createTransport({
		service: "gmail", // Use the 'gmail' service shortcut
		auth: {
			user: senderEmail, // Your full Gmail address
			pass: appPassword, // The App Password you generated
		},
	});

	// Optional: Verify transporter config (useful for debugging)
	transporter.verify(function (error, success) {
		if (error) {
			console.error(
				"Transporter verification failed:",
				error
			);
		} else {
			console.log("Server is ready to take our messages");
		}
	});
} catch (error) {
	console.error("Error creating transporter:", error);
	// Handle transporter creation error appropriately
	return; // Stop if transporter creation failed
}

// Send verification status email
const sendVerificationEmail = async (req, res) => {
	try {
		console.log("Verification email request received:", req.body);
		console.log(
			"creds:",
			process.env.EMAIL_USERNAME,
			process.env.EMAIL_PASSWORD
		);

		const { email, fullName, status, note } = req.body;

		// Validate input
		if (!email || !fullName || !status) {
			console.log("Missing required fields:", {
				email,
				fullName,
				status,
			});
			return res.status(400).json({
				error: "Email, full name, and status are required.",
			});
		}

		if (status !== "approve" && status !== "reject") {
			return res.status(400).json({
				error: "Invalid status. Must be 'approve' or 'reject'.",
			});
		}

		console.log("Preparing verification email for:", email);
		const isApproved = status === "approve";
		const subject = isApproved
			? "Your StockWise Account Has Been Approved!"
			: "StockWise Account Verification Update";

		// Create HTML content
		let htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1E88E5; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">StockWise</h1>
        </div>
        <div style="padding: 20px; background-color: #ffffff; border-left: 1px solid #E0E0E0; border-right: 1px solid #E0E0E0;">
          <h2 style="color: #1E293B; margin-top: 0; font-size: 20px;">Account Verification Update</h2>
          <p style="color: #4B5563; font-size: 16px;">Hello ${fullName},</p>
          <p style="color: #4B5563; font-size: 16px;">Your account verification request has been reviewed by our admin team. Your request has been:</p>
    `;

		if (isApproved) {
			htmlContent += `
        <div style="background-color: #10B981; color: white; padding: 12px 24px; text-align: center; margin: 20px 0; border-radius: 6px; font-weight: 600; font-size: 18px;">
          APPROVED
        </div>
        <p style="color: #4B5563; font-size: 16px;">Congratulations! You now have full access to your StockWise account. You can now log in and start trading.</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://stockwise-demo.sleepysoul.cc/login" style="background-color: #1E88E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
            Log In Now
          </a>
        </div>
      `;
		} else {
			htmlContent += `
        <div style="background-color: #EF4444; color: white; padding: 12px 24px; text-align: center; margin: 20px 0; border-radius: 6px; font-weight: 600; font-size: 18px;">
          REJECTED
        </div>
        <p style="color: #4B5563; font-size: 16px;">We're sorry, but we couldn't verify your account at this time.</p>
      `;

			if (note) {
				htmlContent += `
          <div style="background-color: #F5F7FA; border-left: 4px solid #1E88E5; padding: 16px; margin: 20px 0; text-align: left;">
            <strong>Reason for rejection:</strong><br>
            ${note}
          </div>
        `;
			}

			htmlContent += `
        <p style="color: #4B5563; font-size: 16px;">If you have any questions or would like to submit additional verification documents, please contact our support team.</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://stockwise-demo.sleepysoul.cc/contact" style="background-color: #1E88E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
            Contact Support
          </a>
        </div>
      `;
		}

		htmlContent += `
        </div>
        <div style="background-color: #F5F7FA; padding: 16px; text-align: center; font-size: 12px; color: #6B7280; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px;">
          <p style="margin-bottom: 8px;">© 2025 StockWise Trading. All rights reserved.</p>
          <p style="margin-bottom: 8px;">123 Trading Street, Financial District, New York, NY 10001</p>
          <p style="margin-bottom: 8px;">If you have questions, please contact <a href="mailto:support@stockwise.com" style="color: #1E88E5;">support@stockwise.com</a></p>
        </div>
      </div>
    `;

		// Configure email options
		const mailOptions = {
			from: `StockWise <${process.env.EMAIL_USERNAME}>`,
			to: email,
			subject: subject,
			html: htmlContent,
		};

		// Send email
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent successfully:", info.messageId);

		return res.status(200).json({
			success: true,
			message: `Verification ${
				isApproved ? "approval" : "rejection"
			} email sent to ${email}`,
			messageId: info.messageId,
		});
	} catch (error) {
		console.error("Error sending verification email:", error);
		return res.status(500).json({
			success: false,
			error: "Failed to send verification email.",
			details: error.message,
		});
	}
};

// Send welcome email to new users
const sendWelcomeEmail = async (req, res) => {
	try {
		const { email, fullName } = req.body;

		if (!email || !fullName) {
			return res.status(400).json({
				error: "Email and full name are required.",
			});
		}

		const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1E88E5; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">StockWise</h1>
        </div>
        <div style="padding: 20px; background-color: #ffffff; border-left: 1px solid #E0E0E0; border-right: 1px solid #E0E0E0;">
          <h2 style="color: #1E293B; margin-top: 0; font-size: 20px;">Welcome to StockWise!</h2>
          <p style="color: #4B5563; font-size: 16px;">Hello ${fullName},</p>
          <p style="color: #4B5563; font-size: 16px;">Thank you for joining StockWise! We're excited to have you on board.</p>
          <p style="color: #4B5563; font-size: 16px;">Your account has been created successfully, but it's pending verification. Our team will review your information and verify your account shortly.</p>
          <p style="color: #4B5563; font-size: 16px;">You'll receive another email once your account has been verified.</p>
        </div>
        <div style="background-color: #F5F7FA; padding: 16px; text-align: center; font-size: 12px; color: #6B7280; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px;">
          <p style="margin-bottom: 8px;">© 2025 StockWise Trading. All rights reserved.</p>
          <p style="margin-bottom: 8px;">123 Trading Street, Financial District, New York, NY 10001</p>
          <p style="margin-bottom: 8px;">If you have questions, please contact <a href="mailto:support@stockwise.com" style="color: #1E88E5;">support@stockwise.com</a></p>
        </div>
      </div>
    `;

		const mailOptions = {
			from: `StockWise <${process.env.EMAIL_USERNAME}>`,
			to: email,
			subject: "Welcome to StockWise!",
			html: htmlContent,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log("Welcome email sent:", info.messageId);

		return res.status(200).json({
			success: true,
			message: `Welcome email sent to ${email}`,
			messageId: info.messageId,
		});
	} catch (error) {
		console.error("Error sending welcome email:", error);
		return res.status(500).json({
			success: false,
			error: "Failed to send welcome email.",
			details: error.message,
		});
	}
};

// Generic email sending function that other controllers can use
const sendEmail = async (to, subject, htmlContent) => {
	try {
		const mailOptions = {
			from: `StockWise <${process.env.EMAIL_USERNAME}>`,
			to,
			subject,
			html: htmlContent,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent successfully:", info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("Error sending email:", error);
		return { success: false, error: error.message };
	}
};

module.exports = {
	sendVerificationEmail,
	sendWelcomeEmail,
	sendEmail,
};
