const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Lấy config từ server
function getConfig(req) {
  return req.app.get('dbConfig');
}

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  const config = getConfig(req);
  const pool = await sql.connect(config);

  // Kiểm tra email
  const exists = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT 1 FROM users WHERE email = @email');
  if (exists.recordset.length) {
    return res.status(400).json({ message: 'Email đã được đăng ký' });
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  // Insert
  await pool.request()
    .input('name', sql.NVarChar, name)
    .input('email', sql.NVarChar, email)
    .input('password', sql.NVarChar, hash)
    .input('phone', sql.NVarChar, phone)
    .query(`
      INSERT INTO users (name, email, password, phone, created_at)
      VALUES (@name, @email, @password, @phone, GETDATE())
    `);

  res.json({ message: 'Đăng ký thành công!' });
});

// GET /api/users
router.get('/', async (req, res) => {
  const config = getConfig(req);
  const pool = await sql.connect(config);
  const result = await pool.request()
  .query('SELECT user_id, name, email, phone, role, created_at FROM users');
  res.json(result.recordset);
});

module.exports = router;
