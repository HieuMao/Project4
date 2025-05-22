const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const { sql } = require('./config/db'); // Đảm bảo bạn có `getConnection` ở file này

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình SQL Server cho toàn bộ ứng dụng
const config = {
  user: 'NguyenHieu',
  password: 'Mao2462004',
  server: 'localhost',
  database: 'TTCD4',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: 'ALABATER'
  }
};
app.set('dbConfig', config);

// Middleware chung
app.use(cors());
app.use(express.json());

// Serve ảnh tĩnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup (upload ảnh)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Route upload ảnh
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Chưa chọn file ảnh!' });
  }
  res.json({ filename: req.file.filename });
});

// Gắn các route API
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
});
