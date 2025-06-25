const { getConnection, sql } = require('../config/db');

exports.getUserPoints = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    console.log(`Fetching points for user_id: ${user_id}`);
    const pool = await getConnection();
    const result = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query('SELECT total_points, last_updated FROM user_points WHERE user_id = @user_id');

    if (result.recordset.length === 0) {
      console.log(`No record found for user_id ${user_id}, inserting default`);
      await pool.request()
        .input('user_id', sql.Int, user_id)
        .query('INSERT INTO user_points (user_id, total_points) VALUES (@user_id, 0)');
      return res.json({ total_points: 0, last_updated: new Date() });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching user points:', err);
    res.status(500).json({ error: 'Lỗi lấy điểm người dùng.' });
  }
};

exports.updateUserPoints = async (user_id, pointsToAdd) => {
  try {
    console.log(`🧩 updateUserPoints START for user_id=${user_id}`);

    const pool = await getConnection();

    const check = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query('SELECT total_points FROM user_points WHERE user_id = @user_id');

    console.log('✅ Trước khi cộng điểm:', check.recordset[0]);

    if (check.recordset.length > 0) {
      await pool.request()
        .input('user_id', sql.Int, user_id)
        .input('pointsToAdd', sql.Int, pointsToAdd)
        .query(`
          UPDATE user_points 
          SET total_points = total_points + @pointsToAdd, last_updated = GETDATE()
          WHERE user_id = @user_id
        `);
      console.log('✅ Đã update điểm');
    } else {
      await pool.request()
        .input('user_id', sql.Int, user_id)
        .input('pointsToAdd', sql.Int, pointsToAdd)
        .query(`
          INSERT INTO user_points (user_id, total_points) VALUES (@user_id, @pointsToAdd)
        `);
      console.log('🆕 Đã insert mới user_points');
    }

    const after = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query('SELECT total_points FROM user_points WHERE user_id = @user_id');
    
    console.log('🏁 Sau khi cập nhật:', after.recordset[0]);
  } catch (err) {
    console.error('❌ Lỗi updateUserPoints:', err.message);
    throw err;
  }
};
