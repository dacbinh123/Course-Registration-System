const asyncHandler = require('express-async-handler')
const Course = require("../model/courseModel")
const {generateToken} = require("../config/jwtToken")
const {validateMongoDbId} = require("../utils/validateMongodbId")
const {generateRefreshToken} = require("../config/refreshToken");
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const mongoose = require('mongoose')
const slugify = require('slugify');
const User = require('../model/userModel');


const courseController = {
    getCoursePage: asyncHandler(async (req, res) => {
        try {
            const courses = await Course.find().lean();
            console.log(courses)

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
    getCreateCoursePage: asyncHandler(async (req, res) => {
        try {
            const teachers = await User.find({ role: 'teacher' }).lean(); // Chuyển đổi Mongoose Documents thành plain objects
            res.render('createCourse', { teachers });
        } catch (error) {
            res.status(500).send('Lỗi server: ' + error.message);
        }
    }),

     createCourse : asyncHandler(async (req, res) => {
        try {
            console.log("Request body:", req.body);
            console.log("Uploaded file:", req.file);
    
            const { title, description, category, price, teacher } = req.body;
            const image = req.file ? req.file.filename : null;
    
            const newCourse = await Course.create({
                title,
                description,
                category,
                price,
                teacher,
                image,
            });
    
            console.log("New course:", newCourse);
            res.redirect('/course');
        } catch (error) {
            res.status(500).send('Lỗi server: ' + error.message);
        }
    }),
}
module.exports = courseController;
