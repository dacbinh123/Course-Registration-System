const express = require('express');
const router = express.Router();
const enrollmentController = require('../controller/enrollmentController');

// router.post('/enroll', enrollmentController.enrollCourse);
router.get('/payment', enrollmentController.generateQRPage);
router.post('/confirm-payment', enrollmentController.confirmPayment);

module.exports = router;
