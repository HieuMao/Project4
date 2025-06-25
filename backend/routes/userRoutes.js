const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const userPointsController = require('../controllers/userPointsController'); 
const donationController = require('../controllers/donationController');

router.post('/register', userController.registerUser);
router.get('/', userController.getAllUsers);
router.post('/login', userController.loginUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', (req, res, next) => {
  console.log('DELETE user with id:', req.params.id);
  next();
}, userController.deleteUser);
router.get('/users/me', authMiddleware, userController.getUserProfile);
router.get('/points', authMiddleware, (req, res) => {
  console.log('Points route hit');
  userPointsController.getUserPoints(req, res);
});
router.post('/donate', authMiddleware, donationController.createDonation); // Thêm authMiddleware
module.exports = router;