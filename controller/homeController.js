const homeController = {
    getHomePage: (req, res) => {
        res.render("home", {
            title: "Trang Chủ",
            welcomeMessage: "Chào mừng đến với hệ thống đăng ký khóa học!"
        });
    }
};

module.exports = homeController;
