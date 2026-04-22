const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./src/config/database');
const attendanceRoutes = require('./src/routes/attendance.routes');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'api backend-node' });
});


app.use('/api/attendance', attendanceRoutes);


const PORT = process.env.PORT || 10000;
app.listen(PORT, async () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    await connectDB();
});