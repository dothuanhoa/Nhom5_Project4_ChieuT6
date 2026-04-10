const express = require('express');
const router = express.Router();

// Import cái middleware xịn của bạn vào đây
const upload = require('../middlewares/uploadMiddleware'); 
const { checkIn } = require('../controllers/attendance.controller');

// Sử dụng middleware
router.post('/check-in', upload.single('image'), checkIn);

module.exports = router;