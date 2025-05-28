const { getConnection, sql } = require('../config/db');

// Register for an activity
exports.registerVolunteer = async (req, res) => {
  try {
    const { activity_id } = req.body;
    const user_id = req.user.user_id; // From auth middleware

    // Log request for debugging
    console.log('Register request:', { user_id, activity_id });

    // Validate activity_id
    if (!activity_id) {
      return res.status(400).json({ 
        error: 'Thiếu activity_id' 
      });
    }

    const pool = await getConnection();
    const request = pool.request();

    request.input('user_id', sql.Int, user_id);
    request.input('activity_id', sql.Int, parseInt(activity_id));

    // Check if activity exists and is open
    const activityCheck = await pool.request()
      .input('activity_id', sql.Int, parseInt(activity_id))
      .query(`SELECT status FROM activities WHERE activity_id = @activity_id`);

    if (activityCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Hoạt động không tồn tại' });
    }

    if (activityCheck.recordset[0].status === 'completed') {
      return res.status(400).json({ error: 'Hoạt động đã hoàn thành, không thể đăng ký' });
    }

    // Insert registration
    const query = `
      INSERT INTO volunteer_participation 
      (user_id, activity_id, status)
      OUTPUT INSERTED.id
      VALUES
      (@user_id, @activity_id, 'pending')
    `;

    const result = await request.query(query);

    res.status(201).json({
      message: 'Đăng ký hoạt động thành công!',
      participation_id: result.recordset[0].id
    });
  } catch (err) {
    console.error('Lỗi đăng ký hoạt động:', {
      message: err.message,
      stack: err.stack,
      user_id: req.user.user_id,
      activity_id: req.body.activity_id
    });
    if (err.message.includes('UQ_user_activity')) {
      return res.status(400).json({ error: 'Bạn đã đăng ký hoạt động này' });
    }
    res.status(500).json({
      error: 'Đăng ký hoạt động thất bại',
      detail: err.message
    });
  }
};

// Get user's registered activities
exports.getUserRegistrations = async (req, res) => {
  try {
    const user_id = req.user.user_id; // From auth middleware

    const pool = await getConnection();
    const request = pool.request();

    request.input('user_id', sql.Int, user_id);

    const query = `
      SELECT activity_id
      FROM volunteer_participation
      WHERE user_id = @user_id AND status = 'pending'
    `;

    const result = await request.query(query);

    res.status(200).json(result.recordset.map(row => row.activity_id));
  } catch (err) {
    console.error('Lỗi lấy danh sách đăng ký:', err);
    res.status(500).json({ error: 'Lấy danh sách đăng ký thất bại', detail: err.message });
  }
};

// Cancel registration
exports.cancelRegistration = async (req, res) => {
  try {
    const { activity_id } = req.body;
    const user_id = req.user.user_id; // From auth middleware

    // Log request for debugging
    console.log('Cancel registration request:', { user_id, activity_id });

    // Validate activity_id
    if (!activity_id) {
      return res.status(400).json({ 
        error: 'Thiếu activity_id' 
      });
    }

    const pool = await getConnection();
    const request = pool.request();

    request.input('user_id', sql.Int, user_id);
    request.input('activity_id', sql.Int, parseInt(activity_id));

    const query = `
      DELETE FROM volunteer_participation
      WHERE user_id = @user_id AND activity_id = @activity_id
    `;

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đăng ký để hủy' });
    }

    res.status(200).json({ message: 'Hủy đăng ký hoạt động thành công!' });
  } catch (err) {
    console.error('Lỗi hủy đăng ký:', {
      message: err.message,
      stack: err.stack,
      user_id: req.user.user_id,
      activity_id: req.body.activity_id
    });
    res.status(500).json({
      error: 'Hủy đăng ký thất bại',
      detail: err.message
    });
  }
};
exports.getActivitiesWithMembers = async (req, res) => {
  try {
    const user_id = req.user.user_id;  // Lấy user_id từ token (giả sử đã decode)

    const pool = await getConnection();

    const query = `
      SELECT 
        a.activity_id,
        a.name AS activity_name,
        a.status,
        a.start_date,
        a.end_date,
        vp.user_id AS member_id,
        u.name AS member_name
      FROM activities a
      LEFT JOIN volunteer_participation vp ON a.activity_id = vp.activity_id AND vp.status = 'pending'
      LEFT JOIN users u ON vp.user_id = u.user_id
      WHERE EXISTS (
        SELECT 1 FROM volunteer_participation vp2 WHERE vp2.activity_id = a.activity_id AND vp2.user_id = @user_id AND vp2.status = 'pending'
      )
      ORDER BY a.activity_id, vp.user_id
    `;

    const request = pool.request();
    request.input('user_id', sql.Int, user_id);

    const result = await request.query(query);

    // Gom nhóm hoạt động theo activity_id
    const activitiesMap = {};

    result.recordset.forEach(row => {
      if (!activitiesMap[row.activity_id]) {
        activitiesMap[row.activity_id] = {
          activity_id: row.activity_id,
          activity_name: row.activity_name,
          status: row.status,
          start_date: row.start_date,
          end_date: row.end_date,
          members: []
        };
      }
      if (row.member_id) {
        activitiesMap[row.activity_id].members.push({
          user_id: row.member_id,
          name: row.member_name
        });
      }
    });

    const activities = Object.values(activitiesMap);

    res.status(200).json({ activities });
  } catch (err) {
    console.error('Lỗi lấy danh sách hoạt động:', err);
    res.status(500).json({ error: 'Lấy danh sách hoạt động thất bại', detail: err.message });
  }
};