// backend/server.js
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
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

// 4. Route đăng nhập (nếu bạn muốn giữ logic riêng ở đây, hoặc bạn có thể di chuyển vào userRoutes)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT * FROM users WHERE email = @email');

  const user = result.recordset[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
  }

  return res.json({
    message: 'Đăng nhập thành công',
    user: { user_id: user.user_id, name: user.name, email: user.email, phone: user.phone }
  });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
