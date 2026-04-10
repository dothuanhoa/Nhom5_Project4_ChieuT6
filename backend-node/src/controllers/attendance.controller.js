const axios = require('axios');
const FormData = require('form-data');
const { pool } = require('../config/database');

// 1. API ĐIỂM DANH (Đã thêm logic chống trùng)
const checkIn = async (req, res) => {
    try {
        const { course_code, group_number } = req.body;
        const file = req.file;

        if (!file || !course_code || !group_number) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin hoặc ảnh!' });
        }

        const courseRes = await pool.query(
            'SELECT id FROM course_sections WHERE course_code = $1 AND group_number = $2',
            [course_code, group_number]
        );
        if (courseRes.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy lớp!' });
        const courseId = courseRes.rows[0].id;

        const formData = new FormData();
        formData.append('image', file.buffer, file.originalname);
        
        let springRes;
        try {
            springRes = await axios.post(`${process.env.SPRING_API_URL}/verify-face`, formData, { headers: { ...formData.getHeaders() } });
        } catch (error) {
            return res.status(502).json({ message: 'Lỗi kết nối AI!' });
        }

        const { student_code, similarity_score } = springRes.data;

        if (student_code) {
            const studentRes = await pool.query('SELECT id, full_name FROM students WHERE student_code = $1', [student_code]);
            if (studentRes.rows.length === 0) return res.status(404).json({ message: 'SV không tồn tại' });
            const student = studentRes.rows[0];

            const enrollRes = await pool.query('SELECT id FROM enrollments WHERE student_id = $1 AND course_section_id = $2', [student.id, courseId]);
            if (enrollRes.rows.length === 0) return res.status(403).json({ message: 'SV không thuộc lớp này' });

            // THÊM MỚI: LOGIC CHỐNG TRÙNG LẶP TRONG NGÀY
            const checkDup = await pool.query(
                'SELECT id FROM attendance_logs WHERE student_id = $1 AND course_section_id = $2 AND attendance_date = CURRENT_DATE',
                [student.id, courseId]
            );
            if (checkDup.rows.length > 0) {
                return res.status(400).json({ success: false, message: 'Sinh viên đã điểm danh trong hôm nay rồi!' });
            }

            const is_verified = similarity_score >= 60;
            await pool.query(
                `INSERT INTO attendance_logs (student_id, course_section_id, attendance_date, check_in_time, similarity_score, is_verified, status) 
                 VALUES ($1, $2, CURRENT_DATE, NOW(), $3, $4, $5)`,
                [student.id, courseId, similarity_score, is_verified, is_verified ? 'present' : 'late']
            );

            return res.json({ success: true, student_name: student.full_name, similarity: similarity_score, is_verified });
        }
        res.status(400).json({ message: 'Không nhận diện được mặt!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. API TRUY XUẤT LỊCH SỬ ĐIỂM DANH
const getHistory = async (req, res) => {
    try {
        const { course_code, group_number, attendance_date } = req.query;
        if (!course_code || !group_number || !attendance_date) {
            return res.status(400).json({ message: 'Thiếu tham số tìm kiếm!' });
        }

        const query = `
            SELECT al.id as log_id, s.student_code, s.full_name, al.attendance_date, al.check_in_time, al.similarity_score, al.is_verified, al.status
            FROM attendance_logs al
            JOIN students s ON al.student_id = s.id
            JOIN course_sections cs ON al.course_section_id = cs.id
            WHERE cs.course_code = $1 AND cs.group_number = $2 AND al.attendance_date = $3
            ORDER BY al.check_in_time DESC
        `;
        const result = await pool.query(query, [course_code, group_number, attendance_date]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. API CẬP NHẬT TRẠNG THÁI THỦ CÔNG (Dành cho Giảng viên)
const updateManualStatus = async (req, res) => {
    try {
        const { log_id } = req.body;
        if (!log_id) return res.status(400).json({ message: 'Thiếu ID bản ghi!' });

        const result = await pool.query(
            `UPDATE attendance_logs 
             SET is_verified = true, status = 'present' 
             WHERE id = $1 RETURNING *`,
            [log_id]
        );

        if (result.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy bản ghi!' });
        res.json({ success: true, message: 'Cập nhật thành công!', data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { checkIn, getHistory, updateManualStatus };