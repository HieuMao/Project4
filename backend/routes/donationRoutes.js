const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/', donationController.createDonation); // tự kiểm tra có token hay không

router.get('/activities', donationController.getActiveActivities);
router.get('/list', donationController.getDonorsList);

module.exports = router;
