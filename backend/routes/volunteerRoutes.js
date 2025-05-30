const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authMiddleware, volunteerController.registerVolunteer);
router.get('/user', authMiddleware, volunteerController.getUserRegistrations);
router.post('/cancel', authMiddleware, volunteerController.cancelRegistration);
router.get('/activities-members', authMiddleware, volunteerController.getActivitiesWithMembers);
// Thêm route để lấy tất cả hoạt động
router.get('/activities', authMiddleware, volunteerController.getAllActivities);

module.exports = router;