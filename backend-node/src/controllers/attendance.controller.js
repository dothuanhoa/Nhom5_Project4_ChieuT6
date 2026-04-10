const axios = require('axios');
const FormData = require('form-data');
const { pool } = require('../config/database');

const checkIn = async (req, res) => {
    try {
        const { course_code, group_number } = req.body;
        const file = req.file;

        if (!file || !course_code || !group_number) {
            return res.status(400).json({ success: false, message: 'Missing data' });
        }

        const courseRes = await pool.query(
            'SELECT id FROM course_sections WHERE course_code = $1 AND group_number = $2',
            [course_code, group_number]
        );
        if (courseRes.rows.length === 0) return res.status(404).json({ message: 'Course not found' });
        const courseId = courseRes.rows[0].id;

        const formData = new FormData();
        formData.append('image', file.buffer, file.originalname);
        
        const springRes = await axios.post(`${process.env.SPRING_API_URL}/verify-face`, formData, {
            headers: { ...formData.getHeaders() }
        });

        const { student_code, similarity_score } = springRes.data;

        if (student_code) {
            const studentRes = await pool.query('SELECT id, full_name FROM students WHERE student_code = $1', [student_code]);
            if (studentRes.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
            const student = studentRes.rows[0];

            const enrollRes = await pool.query('SELECT id FROM enrollments WHERE student_id = $1 AND course_section_id = $2', [student.id, courseId]);
            if (enrollRes.rows.length === 0) return res.status(403).json({ message: 'Not enrolled in this course' });

            const is_verified = similarity_score >= 60;
            await pool.query(
                `INSERT INTO attendance_logs (student_id, course_section_id, attendance_date, check_in_time, similarity_score, is_verified, status) 
                 VALUES ($1, $2, CURRENT_DATE, NOW(), $3, $4, $5)`,
                [student.id, courseId, similarity_score, is_verified, is_verified ? 'present' : 'late']
            );

            return res.json({ success: true, student_name: student.full_name, similarity: similarity_score });
        }
        res.status(400).json({ message: 'Face not recognized' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { checkIn };