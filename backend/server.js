const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const marketRoutes = require("./routes/marketRoutes");
const brokerRoutes = require("./routes/brokerRoutes");
const mailRoutes = require('./routes/mailRoutes');
const adminRoutes = require("./routes/adminRoutes");
const { connectRedis, getRedisClient } = require('./config/redisClient'); 

const chatbotRoutes = require("./routes/chatbotRoutes");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const stockRoutes = require("./routes/stockRoutes");
const paymentRoutes = require('./routes/paymentRoutes');	
//const swaggerDocument = YAML.load("./swagger/swagger.yaml");

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
    "https://stockwise-api.sleepysoul.cc"
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    exposedHeaders: ["Content-Length", "Content-Type"],
    credentials: true,
    optionsSuccessStatus: 204,
    maxAge: 86400 // 24 hours
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

// Connect to MongoDB and Redis
connectDB();
connectRedis();

// --- Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl} - Origin: ${req.headers.origin || 'No origin'}`);
    next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make the uploads folder accessible
app.use("/images", express.static("uploads/images"));

// Swagger documentation route
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/summary", chatbotRoutes);
app.use("/market", marketRoutes);
app.use("/stocks", stockRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/broker", brokerRoutes);
app.use('/mail', mailRoutes);
app.use("/admin", adminRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("StockWise API Server is running");
});

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`Error occurred: ${err.message}`);
    console.error(err.stack);
    res.status(err.status || 500).json({ 
        error: process.env.NODE_ENV === 'production' ? "Server error" : err.message 
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`⚡️ Server running on port ${PORT}`);
    console.log(`💻 Environment: ${process.env.NODE_ENV || 'development'}`);
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(`📚 Swagger documentation available at http://localhost:${PORT}/api-docs`);
    }
});

module.exports = app;