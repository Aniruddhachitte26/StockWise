const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const marketRoutes = require("./routes/marketRoutes");
const brokerRoutes = require("./routes/brokerRoutes");
const mailRoutes = require("./routes/mailRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { connectRedis, getRedisClient } = require("./config/redisClient");

const chatbotRoutes = require("./routes/chatbotRoutes");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const stockRoutes = require("./routes/stockRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Load environment variables
dotenv.config();
if (!process.env.JWT_SECRET) {
	console.error("FATAL ERROR: JWT_SECRET is not defined.");
	process.exit(1);
}

// Initialize express app
const app = express();

// --- Configure CORS ---
const allowedOrigins = [
	"http://localhost:5173",
	"http://127.0.0.1:5173",
	"https://stockwise-demo.sleepysoul.cc",
];

// const corsOptions = {
// 	origin: function (origin, callback) {
// 		if (!origin || allowedOrigins.includes(origin)) {
// 			callback(null, true);
// 		} else {
// 			console.warn(`CORS blocked for origin: ${origin}`);
// 			callback(new Error("Not allowed by CORS"));
// 		}
// 	},
// 	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// 	allowedHeaders: ["Content-Type", "Authorization"],
// 	credentials: true,
// 	optionsSuccessStatus: 204,
// };

const corsOptions = {
	origin: allowedOrigins, // Allow this specific origin
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true,
	optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Log all incoming requests
app.use((req, res, next) => {
	console.log(`[${req.method}] ${req.originalUrl}`);
	next();
});

// --- Make uploads accessible
app.use("/images", express.static("uploads/images"));

// --- Connect DB and Redis ---
connectDB();
connectRedis();

// --- Routes ---
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/summary", chatbotRoutes);
app.use("/market", marketRoutes);
app.use("/stocks", stockRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/broker", brokerRoutes);
app.use("/mail", mailRoutes);
app.use("/admin", adminRoutes);

// --- Default route
app.get("/", (req, res) => {
	res.send("Hello from the server...!");
});

// --- Error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Server error" });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log("this is hosting branch");
	console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
