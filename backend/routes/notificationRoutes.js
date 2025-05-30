const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Route lấy thông báo theo userId
router.get('/:userId', notificationController.getAllNotifications);

module.exports = router;
