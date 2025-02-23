const User = require('../model/userModel');
const Course = require('../model/courseModel');
const asyncHandler = require('express-async-handler');

const dashboardController = {
    getDashboard: asyncHandler(async (req, res) => {
        try {
            const users = await User.find().lean();
            const students = await User.find({ role: 'student' }).lean();
            const teachers = await User.find({ role: 'teacher' }).lean();
            const courses = await Course.find().populate('teacher', 'name email').lean();

            res.render('dashboard-mng', { students, teachers, courses,users  });
        } catch (error) {
            console.error('❌ Lỗi khi tải dashboard:', error.message);
            res.status(500).send('Lỗi khi tải trang dashboard');
        }
    })
};

module.exports = { dashboardController };
