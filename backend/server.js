// backend/server.js
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes'); // chứa /register, /login, / (getAllUsers)

const app = express();
const PORT = 5000;

// 1. Middleware chung
app.use(cors());
app.use(express.json());

// 2. Cấu hình SQL Server
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

// Gắn config lên global để controllers/models dùng
app.set('dbConfig', config);

// 3. Mount tất cả route liên quan user:
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
