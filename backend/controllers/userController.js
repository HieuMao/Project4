const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection, sql } = require('../config/db');  // chỉ import 1 lần

require('dotenv').config();

// đăng nhập (dùng SQL trực tiếp)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const pool = await getConnection();  // dùng getConnection

    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    const user = result.recordset[0];
    if (!user) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      message: 'Đăng nhập thành công',
      token,
      user: { user_id: user.user_id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ message: 'Lỗi server, vui lòng thử lại sau' });
  }
};


// đăng nhập (dùng SQL trực tiếp)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const pool = await sql.connect(req.app.get('dbConfig'));

    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    const user = result.recordset[0];
    if (!user) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      message: 'Đăng nhập thành công',
      token,
      user: { user_id: user.user_id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ message: 'Lỗi server, vui lòng thử lại sau' });
  }
};

// đăng ký
exports.registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được đăng ký' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.createUser(name, email, hashedPassword, phone);

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// lấy danh sách user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng' });
  }
};

// cập nhật user

exports.updateUser = async (req, res) => {
  try {
    const pool = await getConnection(); // Lấy pool đúng cách

    const id = req.params.id;
    const { name, email, phone } = req.body;

    const result = await pool.request()  // gọi request() trên pool
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone)
      .query(`UPDATE Users SET name = @name, email = @email, phone = @phone WHERE user_id = @id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.status(200).json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi khi cập nhật:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật' });
  }
};