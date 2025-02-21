const express = require("express");
const router = express.Router();
const authController = require("../controller/userController");
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')

router.get("/login", authController.getLoginPage);
router.post("/login", authController.loginUser);
router.get("/register", authController.getRegisterPage);
router.post("/register", authController.registerUser);
router.get("/update", authMiddleware,authController.getUpdateUserPage);
router.put("/update", authMiddleware,authController.UpdateUser);
router.get("/logout", authMiddleware,authController.logout);

router.get("/allUsers", authMiddleware,isAdmin,authController.getAllUser);
router.get("/detailUser/:id", authMiddleware, isAdmin, authController.getaUser);
router.put("/detailUser/:id", authMiddleware,isAdmin,authController.UpdateUserByAdmin);
router.delete('/deleteUser/:id', authMiddleware,isAdmin, authController.deleteaUser);

module.exports = router;
