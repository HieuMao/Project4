const { getConnection, sql } = require('../config/db');
const userPointsController = require('./userPointsController');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getActiveActivities = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT activity_id, name 
      FROM activities 
      WHERE GETDATE() BETWEEN start_date AND end_date AND status = 'active'
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi truy vấn hoạt động.' });
  }
};

exports.createDonation = async (req, res) => {
  const { donor_name, donor_type, amount, item_description, payment_method, activity_id } = req.body;
  let finalDonorName = donor_name;

  try {
    const pool = await getConnection();
    const request = pool.request();

    let user_id = null;

    // 👉 Tự decode token nếu có
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decoded.user_id;

        const userResult = await request
          .input('user_id', sql.Int, user_id)
          .query('SELECT name FROM users WHERE user_id = @user_id');

        if (userResult.recordset.length > 0) {
          finalDonorName = userResult.recordset[0].name;
          await require('./userPointsController').updateUserPoints(user_id, 10);
          console.log(`✅ Cộng điểm cho user_id ${user_id}`);
        }
      } catch (tokenErr) {
        console.warn('⚠️ Token không hợp lệ hoặc không có user. Bỏ qua cộng điểm.');
      }
    }

    request
      .input('donor_name', sql.NVarChar, finalDonorName)
      .input('donor_type', sql.NVarChar, donor_type)
      .input('amount', sql.Decimal(18, 2), amount || 0)
      .input('item_description', sql.NVarChar, item_description || '')
      .input('payment_method', sql.NVarChar, payment_method)
      .input('activity_id', sql.Int, activity_id);

    await request.query(`
      INSERT INTO donations (donor_name, donor_type, amount, item_description, payment_method, activity_id)
      VALUES (@donor_name, @donor_type, @amount, @item_description, @payment_method, @activity_id)
    `);

    res.json({ message: 'Ủng hộ thành công, bạn thật tuyệt! 🌟' });
  } catch (err) {
    console.error('Lỗi khi tạo ủng hộ:', err.message);
    res.status(500).json({ error: 'Lỗi tạo ủng hộ. Chi tiết: ' + err.message });
  }
};

exports.getDonorsList = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT donor_name, donor_type, amount, item_description, payment_method, donated_at, activity_id
      FROM donations
      ORDER BY donated_at DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi lấy danh sách người ủng hộ.' });
  }
};