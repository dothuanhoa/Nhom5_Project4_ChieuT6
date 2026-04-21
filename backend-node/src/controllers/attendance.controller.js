const identityService = require("../services/identity.service");
const attendanceService = require("../services/attendance.service");
const historyService = require("../services/history.service");
const { pool } = require("../config/database");

const attendanceController = {
	checkIn: async (req, res) => {
		try {
			const { classId, similarityScore, status, imageProofUrl } = req.body;

			// //  Dịch thông tin từ Spring Boot
			// if (!classId) {
      //   return res.status(400).json({ success: false, message: 'Thiếu classId' });
      // }

      // const studentCode = await identityService.verifyFromSpringBoot(faceData);

      // const studentRes = await pool.query('SELECT id FROM students WHERE student_code = $1', [studentCode]);
      // if (studentRes.rows.length === 0) {
      //   return res.status(404).json({ success: false, message: 'Sinh viên không tồn tại trong hệ thống' });
      // }

			//////////////////// Chống trùng, check lớp
			const result = await attendanceService.checkLogicAndSave(
				studentRes.rows[0].id,
				classId,
				similarityScore || 100,
				status,
				imageProofUrl,
			);

			res.status(201).json({
				success: true,
				message: result.isVerified
					? "Điểm danh thành công!"
					: "Chờ giảng viên duyệt",
				data: result.record,
			});
		} catch (err) {
			res.status(err.status || 500).json({
				success: false,
				message: err.message || "Lỗi server",
			});
		}
	},

	////////////////////////truy vấn lich sử điểm danh classid,date
	getHistory: async (req, res) => {
		try {
			const { classId, date } = req.query;

			if (!classId) {
				return res
					.status(400)
					.json({ success: false, message: "Bắt buộc cung cấp classId" });
			}

			if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
				return res.status(400).json({
					success: false,
					message: "Định dạng ngày không hợp lệ (YYYY-MM-DD)",
				});
			}

			const data = await historyService.fetchLogs(classId, date);

			if (data.length === 0) {
				return res.status(200).json({
					success: true,
					message: "Không có dữ liệu",
					count: 0,
					data: [],
				});
			}

			res.status(200).json({ success: true, count: data.length, data });
		} catch (err) {
			res
				.status(500)
				.json({ success: false, message: "Lỗi truy xuất lịch sử" });
		}
	},
	///////////cập nhật thủ công(teacher)
	updateManualStatus: async (req, res) => {
		try {
			const { logId } = req.body;

			if (!logId) {
				return res.status(400).json({
					success: false,
					message: "Lỗi: Bắt buộc phải cung cấp logId (Mã bản ghi điểm danh).",
				});
			}

			const data = await attendanceService.updateManual(logId);

			res.status(200).json({
				success: true,
				message: "Đã cập nhật trạng thái duyệt thủ công thành công!",
				data: data,
			});
		} catch (err) {
			res.status(err.status || 500).json({
				success: false,
				message: err.message,
			});
		}
	},
};

module.exports = attendanceController;
