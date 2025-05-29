const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/', donationController.createDonation);
router.get('/activities', donationController.getActiveActivities);
router.get('/list', donationController.getDonorsList);

module.exports = router;
