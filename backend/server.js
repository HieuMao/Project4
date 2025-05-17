// backend/server.js
const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const PORT = 5000;

// cấu hình kết nối SQL Server (thay info phù hợp máy bạn)
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

// Middleware
app.use(cors());
app.use(express.json());

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
    }

    // So sánh mật khẩu trực tiếp (nếu chưa mã hóa)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
    }

    // Trả về thông tin user (bạn có thể thêm tạo JWT ở đây nếu muốn)
    return res.json({
      message: 'Đăng nhập thành công',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
