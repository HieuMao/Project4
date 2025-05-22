const multer = require('multer');
const path = require('path');

// Cấu hình lưu ảnh vào thư mục uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Bộ lọc file – chỉ cho phép ảnh jpg, jpeg, png
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ hỗ trợ ảnh JPG, JPEG, PNG'), false);
  }
};

module.exports = multer({ storage, fileFilter });
