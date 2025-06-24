const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.get('/', userController.getAllUsers);
router.post('/login', userController.loginUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', (req, res, next) => {
  console.log('DELETE user with id:', req.params.id);
  next();
}, userController.deleteUser);
router.get('/users/me', userController.getUserProfile);

module.exports = router;
