const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        shareId: { type: String, unique: true, sparse: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
