const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { 
        rejectUnauthorized: false 
    }
});

const connectDB = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('✅ Kết nối thành công tới PostgreSQL (Render)!');
    } catch (err) {
        console.error('❌ Lỗi kết nối Database:', err.message);
    }
};

module.exports = { pool, connectDB };