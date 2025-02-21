const User = require('../model/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies?.refreshToken) {
        token = req.cookies.refreshToken;
    } else if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.redirect("/login"); // Chặn truy cập khi chưa đăng nhập
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.redirect("/login");
        }

        req.user = user;
        res.locals.user = user; 
        next();
    } catch (error) {
        console.log("Token không hợp lệ:", error.message);
        return res.redirect("/login");
    }
});

const isAdmin = asyncHandler(async(req,res,next)=>{
    console.log(req.user)
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role !== 'admin'){
        throw new Error('You are not ad admin')
    }else{
        next()
    }

})
module.exports = {authMiddleware,isAdmin}