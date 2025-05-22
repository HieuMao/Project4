const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const upload = require('../middlewares/upload');

// Tạo hoạt động mới (có upload ảnh)
router.post('/', upload.single('image'), activityController.createActivity);

// Lấy tất cả hoạt động
router.get('/', activityController.getAllActivities);

module.exports = router;
