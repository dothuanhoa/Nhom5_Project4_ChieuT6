const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const connectDB = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('✅ Connected to PostgreSQL on Render');
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
    }
};

module.exports = { pool, connectDB };