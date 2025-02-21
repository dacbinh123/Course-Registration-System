const express = require("express");
const router = express.Router();
const homeController = require("../controller/homeController");
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')

// Route hiển thị trang chủ
router.get("/",authMiddleware, homeController.getHomePage);

module.exports = router;
