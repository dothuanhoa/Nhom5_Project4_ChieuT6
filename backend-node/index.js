const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối database PostgreSQL trên Render
const pool = new Pool({
    connectionString: "postgres://nhom5_thu6_user:mPc8oHzzBzWOQTYjx2QNStuiWwRZz1Bi@dpg-d6pclluuk2gs73crsds0-a.singapore-postgres.render.com/nhom5_thu6",
    ssl: { rejectUnauthorized: false }
});

// Endpoint 1: Lấy tất cả users (Truy cập: BASE_API/)
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi kết nối database hoặc chưa tạo bảng users" });
    }
});

// Endpoint 2: Lấy user theo ID (Truy cập: BASE_API/1)
app.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM users WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi truy vấn" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});