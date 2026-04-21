const { pool } = require("../config/database");

const historyService = {
	fetchLogs: async (classId, date) => {
		let query = `
      SELECT 
        al.id, 
        s.student_code, 
        s.full_name, 
        al.attendance_date, 
        al.check_in_time, 
        al.similarity_score, 
        al.is_verified, 
        al.status,
        al.image_proof_url
      FROM attendance_logs al 
      JOIN students s ON al.student_id = s.id 
      WHERE al.course_section_id = $1
    `;
		const values = [classId];

		if (date) {
			query += " AND al.attendance_date = $2";
			values.push(date);
		}

		query += " ORDER BY al.check_in_time DESC";

		const result = await pool.query(query, values);
		return result.rows;
	},
};

module.exports = historyService;
