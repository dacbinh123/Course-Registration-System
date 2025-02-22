const express = require("express");
const router = express.Router();
const courseController = require("../controller/courseController");
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')
const configureUpload = require('../utils/upload');
const upload = configureUpload('uploads/courses');

// Route hiển thị trang chủ
router.get("/",authMiddleware, courseController.getCoursePage);
router.get("/create",authMiddleware,isAdmin, courseController.getCreateCoursePage);

router.post("/register",authMiddleware,isAdmin, upload.single('image'),courseController.createCourse);

module.exports = router;
