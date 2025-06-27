const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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

//xóa

exports.deleteUser = async (req, res) => {
  try {
    const pool = await getConnection();
    const id = req.params.id;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Users WHERE user_id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    console.error('Lỗi xóa user:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa' });
  }
};
// userController.js (phần getUserProfile)
exports.getUserProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    console.log('Fetching profile for user_id:', user_id);
    const pool = await getConnection();
    const result = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query('SELECT user_id, name, email, phone, role FROM users WHERE user_id = @user_id');

    if (result.recordset.length === 0) {
      console.log('User not found for user_id:', user_id);
      return res.status(404).json({ error: 'Người dùng không tồn tại.' });
    }

    console.log('User Profile:', result.recordset[0]);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Lỗi lấy thông tin người dùng.' });
  }
};
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const token = crypto.randomBytes(32).toString('hex');
    const expire = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    const pool = await getConnection();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT user_id FROM users WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Email không tồn tại.' });
    }

    await pool.request()
      .input('token', sql.NVarChar, token)
      .input('expire', sql.DateTime, expire)
      .input('email', sql.NVarChar, email)
      .query(`
        UPDATE users SET reset_token = @token, reset_token_expire = @expire
        WHERE email = @email
      `);

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    console.log('👉 Link reset mật khẩu:', resetLink);

    // TODO: Gửi email thật ở đây

    res.json({ message: 'Đã gửi link đặt lại mật khẩu. Kiểm tra email.' });
  } catch (err) {
    console.error('Lỗi requestPasswordReset:', err.message);
    res.status(500).json({ error: 'Có lỗi xảy ra.' });
  }
};

// reset pass
exports.resetPassword = async (req, res) => {
  const { token, new_password } = req.body;

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('token', sql.NVarChar, token)
      .query(`
        SELECT user_id, reset_token_expire
        FROM users WHERE reset_token = @token
      `);

    if (result.recordset.length === 0) {
      return res.status(400).json({ error: 'Token không hợp lệ.' });
    }

    const user = result.recordset[0];
    if (new Date(user.reset_token_expire) < new Date()) {
      return res.status(400).json({ error: 'Token đã hết hạn.' });
    }

    const hashed = require('bcryptjs').hashSync(new_password, 10);
    await pool.request()
      .input('token', sql.NVarChar, token)
      .input('hashed', sql.NVarChar, hashed)
      .query(`
        UPDATE users 
        SET password = @hashed, reset_token = NULL, reset_token_expire = NULL 
        WHERE reset_token = @token
      `);

    res.json({ message: 'Đặt lại mật khẩu thành công.' });
  } catch (err) {
    console.error('Lỗi resetPassword:', err.message);
    res.status(500).json({ error: 'Lỗi khi đặt lại mật khẩu.' });
  }
};
