// const multer = require('multer');
// const path = require('path');

// // Hàm cấu hình multer theo thư mục upload và loại file
// const configureUpload = (uploadPath) => {
//     const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//           const uploadPath = path.join(__dirname, '../public', folder);
//           cb(null, uploadPath);
//         },
//         filename: (req, file, cb) => {
//           cb(null, `${Date.now()}-${file.originalname}`);
//         },
//       });

//   // Kiểm tra loại file (chỉ cho phép ảnh)
//   const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed!'), false);
//     }
//   };

//   return multer({ storage, fileFilter });
// };

// module.exports = configureUpload;
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const configureUpload = (folder) => {
  const uploadPath = path.join(__dirname, '../public', folder);

  // Kiểm tra và tạo thư mục nếu chưa có
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

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
