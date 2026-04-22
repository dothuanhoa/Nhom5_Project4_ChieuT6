const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware'); 

const { checkIn, getHistory, updateManualStatus } = require('../controllers/attendance.controller');

router.post('/check-in', upload.single('image'), checkIn);

router.get('/history', getHistory);

router.post('/update-status', updateManualStatus);

module.exports = router;