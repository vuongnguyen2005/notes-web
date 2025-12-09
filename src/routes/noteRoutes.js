const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const authMiddleware = require("../middleware/auth");

// Public route - không cần authentication
router.get("/shared/:shareId", noteController.getSharedNote);

// Protected routes - cần authentication
router.get("/", authMiddleware, noteController.getNotes);
router.post("/", authMiddleware, noteController.createNote);
router.put("/:id", authMiddleware, noteController.updateNote);
router.get("/share/:id", authMiddleware, noteController.shareNote);
router.delete("/:id", authMiddleware, noteController.deleteNote);

module.exports = router;
