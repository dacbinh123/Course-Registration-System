const asyncHandler = require('express-async-handler')
const User = require("../model/userModel")
const {generateToken} = require("../config/jwtToken")
const {validateMongoDbId} = require("../utils/validateMongodbId")
const {generateRefreshToken} = require("../config/refreshToken");
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const mongoose = require('mongoose')

const userController = {
    //login
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
            return res.redirect("/"); // 🛠️ Dùng return để ngăn code chạy tiếp
        } 
        console.log("===== LOGIN FAILED =====");
        return res.status(400).render("login", {  // 🛠️ Dùng return ở đây
            title: "Đăng Nhập",
            error: "Email hoặc mật khẩu không đúng, vui lòng thử lại!"
        });
    }),
    // register
    getRegisterPage: (req, res) => {
        res.render("register", { title: "Đăng Ký" });
    },
    registerUser: asyncHandler(async (req, res) => {
        const { name, email, password, confirmPassword,phone,age,address } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).render("register", { error: "Mật khẩu không khớp!" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).render("register", { error: "Email đã tồn tại!" });
        }

        const newUser = await User.create({ name, email, password,phone,age,address });
        if (newUser) {
            res.redirect("/login");
        } else {
            res.status(400).render("register", { error: "Đăng ký thất bại!" });
        }
    }),
    //update page
    getUpdateUserPage: (req, res) => {
        const userData = req.user.toObject(); 
        res.render("updateUser", { 
            title: "Cập nhật tài khoản", 
            user: userData  // Truyền object thuần vào template
        })
    },
    UpdateUser: asyncHandler(async (req, res) => {
        const { id } = req.user;
        validateMongoDbId(id)
        try{
            const updateUser = await User.findByIdAndUpdate(id,{
                name:req?.body?.name,
                age:req?.body?.age,
                address:req?.body?.address,
                phone:req?.body?.phone,
            },{
                new:true
            })
            return res.redirect("/update")
        }catch(error){
            return res.status(400).render("home", { error: "Cập nhật thất bại!" });
        }
    }),
    //getalluser
    getAllUser : asyncHandler(async(req,res)=>{
        try{
            const getUsers = await User.find().lean();  // Chỉ thêm .lean() sau truy vấn
            res.render("allUsers", { users: getUsers });
        }catch(error){
            return res.status(400).render("allUsers", { error: "Lỗi" });
        }
    }),
    getaUser: asyncHandler(async (req, res) => {
        const { id } = req.params;
        console.log("User ID:", id);
        validateMongoDbId(id); // Kiểm tra ID hợp lệ
    
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).send("User not found");
            }
            console.log(user)
            res.render("detailUser", { user: user.toObject() }); // Chuyển sang plain object
        } catch (error) {
            throw new Error(error);
        }
    }),
    UpdateUserByAdmin : asyncHandler(async (req, res) => {
        const { id } = req.params;
    
        // Kiểm tra ID có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID không hợp lệ");
        }
    
        validateMongoDbId(id);
    
        try {
            const updateUser = await User.findByIdAndUpdate(
                id,
                {
                    name: req?.body?.name,
                    age: req?.body?.age,
                    address: req?.body?.address,
                    phone: req?.body?.phone,
                    role: req?.body?.role,
                },
                { new: true }
            );
    
            if (!updateUser) {
                return res.status(404).send("Không tìm thấy người dùng");
            }
    
            return res.redirect("/allUsers"); // ✅ Đúng
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            return res.status(500).render("home", { error: "Cập nhật thất bại!" });
        }
    }),
    blockUser: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id);
    
        try {
            const blockedUser = await User.findByIdAndUpdate(
                id,
                { isBlocked: true },
                { new: true }
            );
    
            if (!blockedUser) {
                return res.status(404).json({ message: "User not found" });
            }
    
            req.session.message = "Người dùng đã bị chặn.";
            res.redirect("/allUsers");
        } catch (error) {
            console.error("Error blocking user:", error);
            res.status(500).send("Internal Server Error");
        }
    }),
    
    unblockUser: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id);
    
        try {
            const unblockedUser = await User.findByIdAndUpdate(
                id,
                { isBlocked: false },
                { new: true }
            );
    
            if (!unblockedUser) {
                return res.status(404).json({ message: "User not found" });
            }
    
            req.session.message = "Người dùng đã được bỏ chặn.";
            res.redirect("/allUsers");
        } catch (error) {
            console.error("Error unblocking user:", error);
            res.status(500).send("Internal Server Error");
        }
    }),
    
    
    //logout
    logout : asyncHandler(async (req, res) => {
        const cookie = req.cookies;
        
        // Kiểm tra cookie để lấy refresh token
        if (!cookie?.refreshToken) {
            return res.status(400).json({ message: "No refresh token in Cookies" }); // Trả về thông báo lỗi
        }
    
        const refreshToken = cookie.refreshToken;
        
        // Tìm người dùng dựa trên refresh token
        const user = await User.findOne({ refreshToken });
        if (!user) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true
            });
            return res.sendStatus(204); // Không có nội dung
        }
    
        // Cập nhật người dùng để xóa refresh token
        await User.findOneAndUpdate({ _id: user._id }, {
            refreshToken: ""
        });
    
        // Xóa cookie refresh token
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });
    
        // Trả về mã trạng thái 204
        return res.redirect("/login"); // Không có nội dung
    }),
    deleteaUser: asyncHandler(async (req,res)=>{
        console.log(req.params)
        const {id}=req.params;
        console.log(id);
        validateMongoDbId(id)
    
        try {
            const deleteaUser= await User.findByIdAndDelete(id);
            return res.redirect("/allUsers")
        } catch (error) {
            throw new Error(error)
        }
    })
};

module.exports = userController;
