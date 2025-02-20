const asyncHandler = require('express-async-handler')
const User = require("../model/userModel")
const {generateToken} = require("../config/jwtToken")
const {validateMongoDbId} = require("../utils/validateMongodbId")
const {generateRefreshToken} = require("../config/refreshToken");
const jwt = require("jsonwebtoken")
const crypto = require('crypto')

const userController = {
    getLoginPage: (req, res) => {
        res.render("login", {
            title: "Trang Chủ",
            welcomeMessage: "Chào mừng đến với hệ thống đăng ký khóa học!"
        });
    },
    loginUser: asyncHandler(async(req,res)=>{
        const{email, password} = req.body;
        const findUser = await User.findOne({email})
        if(findUser && await findUser.isPasswordMatched(password)){
            const refreshToken = await generateRefreshToken(findUser?.id)
            const updateUser = await User.findByIdAndUpdate(
                findUser.id,
                {
                    refreshToken: refreshToken,
                },
                {
                    new:true,
                }
            )
            res.cookie('refreshToken', refreshToken,{
                httpOnly: true,
                maxAge: 24*60*60*1000,
            })
            console.log("User found:", findUser);
            return res.redirect("/"); // 🛠️ Dùng return để ngăn code chạy tiếp
        } 
        console.log("===== LOGIN FAILED =====");
        return res.status(400).render("login", {  // 🛠️ Dùng return ở đây
            title: "Đăng Nhập",
            error: "Email hoặc mật khẩu không đúng, vui lòng thử lại!"
        });
    }),
    getRegisterPage: (req, res) => {
        res.render("register", { title: "Đăng Ký" });
    },
    registerUser: asyncHandler(async (req, res) => {
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).render("register", { error: "Mật khẩu không khớp!" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).render("register", { error: "Email đã tồn tại!" });
        }

        const newUser = await User.create({ name, email, password });
        if (newUser) {
            res.redirect("/login");
        } else {
            res.status(400).render("register", { error: "Đăng ký thất bại!" });
        }
    }),
};

module.exports = userController;
