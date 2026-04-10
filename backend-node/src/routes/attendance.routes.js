const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware'); 

// Import đủ 3 hàm từ controller
const { checkIn, getHistory, updateManualStatus } = require('../controllers/attendance.controller');

// 1. API Điểm danh (Frontend gọi lúc quét mặt)
router.post('/check-in', upload.single('image'), checkIn);

// 2. API Lấy danh sách lịch sử (Frontend gọi dạng GET: /api/attendance/history?course_code=CS101&group_number=01&attendance_date=2024-05-20)
router.get('/history', getHistory);

// 3. API Giảng viên xác nhận tay (Frontend gọi dạng POST gửi lên log_id)
router.post('/update-status', updateManualStatus);

module.exports = router;