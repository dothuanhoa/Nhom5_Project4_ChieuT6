const multer = require('multer');

// Lưu file vào bộ nhớ đệm (RAM) thay vì ổ cứng để tăng tốc độ
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn ảnh 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ cho phép tải lên file ảnh!'), false);
        }
    }
});

module.exports = upload;