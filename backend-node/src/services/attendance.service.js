const { pool } = require('../config/database');

const attendanceService = {
  checkLogicAndSave: async (studentId, classId, score, status, imageUrl) => {
    try {
      const enrollQuery = 'SELECT id FROM enrollments WHERE student_id = $1 AND course_section_id = $2';
      const enrollRes = await pool.query(enrollQuery, [studentId, classId]);
      
      if (enrollRes.rows.length === 0) {
        throw { status: 403, message: 'Lỗi: Sinh viên không có tên trong danh sách đăng ký của lớp học này!' };
      }

      const dupQuery = `
        SELECT id FROM attendance_logs 
        WHERE student_id = $1 
          AND course_section_id = $2 
          AND attendance_date = CURRENT_DATE
      `;
      const dupRes = await pool.query(dupQuery, [studentId, classId]);
      
      if (dupRes.rows.length > 0) {
        throw { status: 409, message: 'Lỗi: Sinh viên này đã được điểm danh thành công trong ngày hôm nay!' };
      }

      const isVerified = parseFloat(score) >= 60;

      const insertQuery = `
        INSERT INTO attendance_logs 
          (student_id, course_section_id, attendance_date, check_in_time, similarity_score, is_verified, status, image_proof_url)
        VALUES 
          ($1, $2, CURRENT_DATE, CURRENT_TIMESTAMP, $3, $4, $5, $6) 
        RETURNING *;
      `;
      const insertValues = [studentId, classId, score, isVerified, status || 'Present', imageUrl];
      
      const result = await pool.query(insertQuery, insertValues);

      return { record: result.rows[0], isVerified };

    } catch (error) {
      if (error.status) {
        throw error; 
      }
      throw { status: 500, message: 'Lỗi hệ thống Database khi xử lý điểm danh: ' + error.message };
    }
  },

  updateManual: async (logId) => {
    try {
      const checkRes = await pool.query(
        'SELECT id, is_verified FROM attendance_logs WHERE id = $1',
        [logId]
      );

      if (checkRes.rows.length === 0) {
        throw { status: 404, message: 'Lỗi: Không tìm thấy bản ghi điểm danh.' };
      }

      if (checkRes.rows[0].is_verified === true) {
        throw { status: 409, message: 'Lỗi: Bản ghi này đã được duyệt hợp lệ từ trước!' };
      }

      const result = await pool.query(
        'UPDATE attendance_logs SET is_verified = true WHERE id = $1 RETURNING *',
        [logId]
      );
      
      return result.rows[0];

    } catch (error) {
      if (error.status) throw error;
      throw { status: 500, message: 'Lỗi hệ thống Database: ' + error.message };
    }
  }
};

module.exports = attendanceService;