const express = require("express");
const router = express.Router();
const courseController = require("../controller/courseController");
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')
const configureUpload = require('../utils/upload');
const upload = configureUpload('uploads/courses');

// Route hiển thị trang chủ
router.get("/",authMiddleware, courseController.getCoursePage);
router.get("/create",authMiddleware,isAdmin, courseController.getCreateCoursePage);

router.post(
    '/register',
    authMiddleware,
    isAdmin,
    upload.single('image'),
    courseController.createCourse
  );

router.get("/detail-course/:id",authMiddleware, courseController.getCourseDetailPage);
// Cập nhật khóa học (PUT)
router.put("/update/:id", authMiddleware, isAdmin, courseController.updateCourse);

// Xóa khóa học (DELETE)
router.delete("/delete/:id", authMiddleware, isAdmin, courseController.deleteCourse);
module.exports = router;
