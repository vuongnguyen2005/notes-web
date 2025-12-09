const mongoose = require("mongoose");
const Note = require("./models/Note");

mongoose.connect("mongodb://127.0.0.1:27017/notesdb")
    .then(async () => {
        console.log("✓ Đã kết nối MongoDB, đang tạo dữ liệu mẫu...");

        // Xóa toàn bộ dữ liệu cũ
        await Note.deleteMany({});

        // Tạo dữ liệu mẫu
        await Note.insertMany([
            { title: "Ghi chú 1", content: "Nội dung ghi chú số 1" },
            { title: "Ghi chú 2", content: "Nội dung ghi chú số 2" },
            { title: "Ghi chú 3", content: "Nội dung ghi chú số 3" }
        ]);

        console.log("✓ Tạo dữ liệu mẫu thành công!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Lỗi kết nối MongoDB:", err);
        process.exit(1);
    });
