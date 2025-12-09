const Note = require("../models/Note");
const { nanoid } = require("nanoid");

// Lấy tất cả notes của user hiện tại
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: "Lỗi server" });
    }
};

// Tạo note mới
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        const newNote = await Note.create({
            title,
            content,
            userId: req.userId
        });

        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ error: "Không tạo được note" });
    }
};

// Sửa note (chỉ cho phép sửa note của mình)
exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        // Tìm note và kiểm tra ownership
        const note = await Note.findOne({ _id: id, userId: req.userId });
        if (!note) return res.status(404).json({ error: "Không tìm thấy note hoặc không có quyền" });

        const updated = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Không sửa được" });
    }
};

// Chia sẻ link note - tạo shareId nếu chưa có
exports.shareNote = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra ownership
        let note = await Note.findOne({ _id: id, userId: req.userId });
        if (!note) return res.status(404).json({ error: "Không tìm thấy note hoặc không có quyền" });

        // Nếu chưa có shareId thì tạo mới
        if (!note.shareId) {
            note.shareId = nanoid(10);
            await note.save();
        }

        const link = `${req.protocol}://${req.get('host')}/shared.html?id=${note.shareId}`;
        res.json({ link, shareId: note.shareId });
    } catch (error) {
        res.status(500).json({ error: "Không chia sẻ được" });
    }
};

// Lấy note được share (không cần authentication)
exports.getSharedNote = async (req, res) => {
    try {
        const { shareId } = req.params;
        const note = await Note.findOne({ shareId });

        if (!note) return res.status(404).json({ error: "Không tìm thấy note được chia sẻ" });

        res.json({
            title: note.title,
            content: note.content,
            createdAt: note.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi server" });
    }
};

// Xóa note (chỉ cho phép xóa note của mình)
exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra ownership trước khi xóa
        const note = await Note.findOne({ _id: id, userId: req.userId });
        if (!note) return res.status(404).json({ error: "Không tìm thấy note hoặc không có quyền" });

        await Note.findByIdAndDelete(id);
        res.json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ error: "Không xóa được" });
    }
};
