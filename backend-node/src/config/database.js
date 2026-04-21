// Namespace: VoVanSy_DH52201379
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    // Ưu tiên dùng DATABASE_URL từ file .env
    connectionString: process.env.DATABASE_URL,
    ssl: { 
        rejectUnauthorized: false 
    }
});

const connectDB = async () => {
    try {
        // Thực hiện một câu query nhỏ để kiểm tra kết nối
        await pool.query('SELECT NOW()');
        console.log('✅ Kết nối thành công tới PostgreSQL (Render)!');
    } catch (err) {
        console.error('❌ Lỗi kết nối Database:', err.message);
    }
};

module.exports = { pool, connectDB };