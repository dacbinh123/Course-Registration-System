const express = require("express");
const router = express.Router();
const authController = require("../controller/userController");

router.get("/login", authController.getLoginPage);
router.post("/login", authController.loginUser);
router.get("/register", authController.getRegisterPage);
router.post("/register", authController.registerUser);
module.exports = router;
