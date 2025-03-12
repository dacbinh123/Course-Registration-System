const asyncHandler = require('express-async-handler')
const Course = require("../model/courseModel")
const { generateToken } = require("../config/jwtToken")
const { validateMongoDbId } = require("../utils/validateMongodbId")
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const mongoose = require('mongoose')
const slugify = require('slugify');
const User = require('../model/userModel');


const courseController = {
    getCoursePage: asyncHandler(async(req, res) => {
        try {
            const courses = await Course.find().lean();
            const isAdmin = req.user && req.user.role === "admin"; // Kiểm tra quyền admin
            res.render("course", {
                title: "Trang khóa học",
                welcomeMessage: "Chào mừng với trang khóa học!",
                courses,
                isAdmin
            });
        } catch (error) {
            res.status(500).send("Lỗi server: " + error.message);
        }
    }),
    getCreateCoursePage: asyncHandler(async(req, res) => {
        try {
            const teachers = await User.find({ role: 'teacher' }).lean(); // Chuyển đổi Mongoose Documents thành plain objects
            res.render('createCourse', { teachers });
        } catch (error) {
            res.status(500).send('Lỗi server: ' + error.message);
        }
    }),

    createCourse: asyncHandler(async(req, res) => {
        try {
            if (!req.file) {
                return res.status(400).send('No file uploaded.');
            }

            const { title, description, category, price, teacher } = req.body;
            const image = req.file.filename;
            console.log("image", image)
            console.log("body", req.body)

            const newCourse = await Course.create({
                title,
                description,
                category,
                price,
                teacher,
                image,
            });

            res.redirect('/course');
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Lỗi server: ' + error.message);
        }
    }),
    getCourseDetailPage: async(req, res) => {
        try {
            const course = await Course.findById(req.params.id)
                .populate('teacher', 'name')
                .lean();

            if (!course) {
                return res.status(404).send("Không tìm thấy khóa học");
            }

            const isAdmin = req.user && req.user.role === 'admin';
            const user = req.user ? req.user.toObject() : null;
            res.render("course-detail", { course, isAdmin, user });
        } catch (error) {
            res.status(500).send("Lỗi server: " + error.message);
        }
    },



    updateCourse: async(req, res) => {
        try {
            const { title, description, category, price } = req.body;
            await Course.findByIdAndUpdate(req.params.id, { title, description, category, price });
            res.redirect(`/course/detail-course/${req.params.id}`);
        } catch (error) {
            res.status(500).send("Lỗi server: " + error.message);
        }
    },

    deleteCourse: async(req, res) => {
        try {
            await Course.findByIdAndDelete(req.params.id);
            res.redirect("/course");
        } catch (error) {
            res.status(500).send("Lỗi server: " + error.message);
        }
    },
}
module.exports = courseController;