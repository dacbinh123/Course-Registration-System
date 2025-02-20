const express = require("express");
const router = express.Router();
const homeController = require("../controller/homeController");

// Route hiển thị trang chủ
router.get("/", homeController.getHomePage);

module.exports = router;
