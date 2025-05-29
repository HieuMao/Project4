const { getConnection, sql } = require('../config/db');

// Lấy các hoạt động đang diễn ra
exports.getActiveActivities = async (req, res) => {
  try {
    const pool = await getConnection(); // lấy pool từ hàm getConnection()
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

// Tạo mới ủng hộ
exports.createDonation = async (req, res) => {
  const { donor_name, donor_type, amount, item_description, payment_method, activity_id } = req.body;

  try {
    const pool = await getConnection(); // gọi hàm lấy pool
    await pool.request()
      .input('donor_name', sql.NVarChar, donor_name)
      .input('donor_type', sql.NVarChar, donor_type)
      .input('amount', sql.Decimal(18,2), amount) // hoặc kiểu tương ứng với amount
      .input('item_description', sql.NVarChar, item_description)
      .input('payment_method', sql.NVarChar, payment_method)
      .input('activity_id', sql.Int, activity_id)
      .query(`
        INSERT INTO donations (donor_name, donor_type, amount, item_description, payment_method, activity_id)
        VALUES (@donor_name, @donor_type, @amount, @item_description, @payment_method, @activity_id)
      `);

    res.json({ message: 'Ủng hộ thành công!' });
  } catch (err) {
    console.error('Error creating donation:', err);
    res.status(500).json({ error: 'Lỗi tạo ủng hộ.' });
  }
};
// Lấy danh sách người đã ủng hộ (có thể phân trang hoặc không)
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
