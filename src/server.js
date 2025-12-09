const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(require('path').join(__dirname, '../public')));
app.use(express.static("public"));


// Xóa route '/' để không chặn file tĩnh

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/notesdb")
    .then(() => console.log("✅ MongoDB đã kết nối"))
    .catch(err => console.error(err));

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
});
