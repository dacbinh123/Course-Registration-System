const express = require('express');
const router = express.Router();
const { dashboardController } = require('../controller/dashboardController');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')

router.get('/',authMiddleware,isAdmin, dashboardController.getDashboard);

module.exports = router;
