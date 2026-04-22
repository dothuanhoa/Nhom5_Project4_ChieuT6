// Namespace: VoVanSy_DH52201379
const identityService = require("../services/identity.service");
const attendanceService = require("../services/attendance.service");
const historyService = require("../services/history.service");
const { pool } = require("../config/database");

const attendanceController = {
	checkIn: async (req, res) => {
		try {
			///////////////////connect spring boot
			let { classId, recognitions, image_proof_url } = req.body;

			if (req.file && req.file.path) {
				image_proof_url = req.file.path;
			}

			if (!classId) {
				return res
					.status(400)
					.json({ success: false, message: "Thiếu mã lớp học (classId)" });
			}

			if (typeof recognitions === "string") {
				try {
					recognitions = JSON.parse(recognitions);
				} catch (e) {
					return res.status(400).json({
						success: false,
						message: "Định dạng recognitions không hợp lệ (Phải là JSON)",
					});
				}
			}

			if (
				!recognitions ||
				!Array.isArray(recognitions) ||
				recognitions.length === 0
			) {
				return res.status(400).json({
					success: false,
					message: "Không có dữ liệu khuôn mặt (recognitions) nào được gửi lên",
				});
			}

			const { translatedList, unrecognizedFaces } =
				await identityService.translateFaces(recognitions);

			if (translatedList.length === 0) {
				return res.status(404).json({
					success: false,
					message:
						"Các khuôn mặt trong ảnh không khớp với bất kỳ sinh viên nào trong hệ thống.",
					unrecognizedFaces,
				});
			}

			const results = { successful: [], failed: [] };

			for (const item of translatedList) {
				try {
					const studentRes = await pool.query(
						"SELECT id FROM students WHERE student_code = $1",
						[item.studentCode],
					);

					if (studentRes.rows.length === 0) {
						results.failed.push({
							studentCode: item.studentCode,
							reason:
								"Lỗi đồng bộ: Sinh viên có bên Spring Boot nhưng không có trong DB Node.js",
						});
						continue;
					}

					const record = await attendanceService.checkLogicAndSave(
						studentRes.rows[0].id,
						classId,
						item.similarityScore,
						"Present",
						image_proof_url,
					);

					results.successful.push({
						studentCode: item.studentCode,
						isVerified: record.isVerified,
						message: record.isVerified ? "Hợp lệ" : "Cần duyệt tay (< 60%)",
					});
				} catch (err) {
					results.failed.push({
						studentCode: item.studentCode,
						reason: err.message,
					});
				}
			}

			res.status(201).json({
				success: true,
				message: "Hoàn tất quá trình điểm danh từ ảnh minh chứng",
				summary: {
					totalFacesDetected: recognitions.length,
					unrecognizedStrangers: unrecognizedFaces.length,
					successfullyCheckedIn: results.successful.length,
					failedToCheckIn: results.failed.length,
				},
				details: results,
			});
		} catch (err) {
			res
				.status(err.status || 500)
				.json({ success: false, message: err.message });
		}
	},
	///////////////////truy vấn lịch sử điểm danh
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
				.json({ success: false, message: "Lỗi DB: " + err.message });
		}
	},

	///////////////////update thủ công
	updateManualStatus: async (req, res) => {
		try {
			const { studentCode, classId, similarityScore, status, checkInTime } =
				req.body;

			if (!studentCode || !classId) {
				return res.status(400).json({
					success: false,
					message: "Lỗi:  Thiếu dữ liệu bắt buộc",
				});
			}
			if (checkInTime && isNaN(Date.parse(checkInTime))) {
				return res.status(400).json({
					success: false,
					message: "Lỗi: Định dạng checkInTime không hợp lệ (YYYY-MM-DD).",
				});
			}

			const parsedScore =
				similarityScore !== undefined ? parseFloat(similarityScore) : 100;
			if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
				return res.status(400).json({
					success: false,
					message: "Lỗi: similarityScore phải là một con số từ 0 đến 100.",
				});
			}
			const studentRes = await pool.query(
				"SELECT id FROM students WHERE student_code = $1",
				[studentCode],
			);

			if (studentRes.rows.length === 0) {
				return res.status(404).json({
					success: false,
					message: `Không tìm thấy sinh viên có mã ${studentCode} trong hệ thống.`,
				});
			}

			const studentId = studentRes.rows[0].id;

			const result = await attendanceService.checkLogicAndSave(
				studentId,
				classId,
				parsedScore,
				status || "Present",
				null,
				checkInTime,
			);

			res.status(200).json({
				success: true,
				message: "Đã xác nhận điểm danh thành công!",
				data: result.record,
			});
		} catch (err) {
			res
				.status(err.status || 500)
				.json({ success: false, message: err.message });
		}
	},
};

module.exports = attendanceController;
