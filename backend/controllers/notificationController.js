const { getConnection, sql } = require('../config/db');

exports.getAllNotifications = async (req, res) => {
  const userId = req.params.userId;

  try {
    const pool = await getConnection();
    const request = pool.request();

    request.input('userId', sql.Int, userId);

    const result = await request.query(`
      SELECT * FROM notifications
      WHERE sent_to = @userId
      ORDER BY sent_at DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi lấy thông báo:', error);
    res.status(500).json({ error: 'Không thể lấy thông báo.' });
  }
};
