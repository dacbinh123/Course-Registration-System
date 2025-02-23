const Course = require("../model/courseModel")
const asyncHandler = require('express-async-handler')

const homeController = {
    getHomePage: async(req, res) => {
        try {
            const courses = await Course.find().lean();
            console.log(courses)
            res.render("home", {
                title: "Trang khóa học",
                welcomeMessage: "Chào mừng với trang khóa học!",
                courses,
            });
        } catch (error) {
            res.status(500).send("Lỗi server: " + error.message);
        }
    }
};

module.exports = homeController;
