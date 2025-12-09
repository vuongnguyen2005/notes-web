require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const { MONGO_URI } = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(require('path').join(__dirname, '../public')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB đã kết nối"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Only start server if this file is run directly (not imported)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
    });
}

// Export app for Vercel serverless function
module.exports = app;
