const multer = require('multer');
const path = require('path');

// Hàm cấu hình multer theo thư mục upload và loại file
const configureUpload = (uploadPath) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(__dirname, '../public', folder);
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      });

  // Kiểm tra loại file (chỉ cho phép ảnh)
  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed!'), false);
    }
  };

  return multer({ storage, fileFilter });
};

module.exports = configureUpload;
