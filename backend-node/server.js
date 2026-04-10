const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./src/config/database');
const attendanceRoutes = require('./src/routes/attendance.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route cơ bản
app.get('/', (req, res) => {
    res.json({ message: 'Chào mừng đến với API Điểm Danh Nhận Diện Khuôn Mặt!' });
});

// Khai báo các Routes chính
app.use('/api/attendance', attendanceRoutes);

// Khởi động Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, async () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    await connectDB(); // Gọi hàm kết nối database
});