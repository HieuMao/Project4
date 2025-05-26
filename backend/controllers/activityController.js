const { getConnection, sql } = require('../config/db');

exports.createActivity = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      location,
      start_date,
      end_date,
      status,
      created_by
    } = req.body;

    const image_url = req.file ? req.file.filename : null;

    const pool = await getConnection();
    const request = pool.request();

    request.input('name', sql.NVarChar(200), name);
    request.input('description', sql.NVarChar(sql.MAX), description);
    request.input('category', sql.NVarChar(20), category);
    request.input('location', sql.NVarChar(200), location);
    request.input('start_date', sql.Date, start_date);
    request.input('end_date', sql.Date, end_date);
    request.input('status', sql.NVarChar(20), status);
    request.input('created_by', sql.Int, created_by);
    request.input('image_url', sql.NVarChar(255), image_url);  // Sửa ở đây

    const query = `
      INSERT INTO activities 
      (name, description, category, location, start_date, end_date, status, created_by, image_url)
      VALUES
      (@name, @description, @category, @location, @start_date, @end_date, @status, @created_by, @image_url)
    `;

    await request.query(query);

    res.status(201).json({ message: 'Tạo hoạt động thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Tạo hoạt động thất bại', detail: err.message });
  }
};

exports.getAllActivities = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM activities');
    console.log('Dữ liệu từ database:', result.recordset); // 🧪
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Lỗi lấy dữ liệu:', err);
    res.status(500).json({ error: 'Lỗi lấy danh sách hoạt động', detail: err.message });
  }
};

// Update an activity
exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params; // Assuming activity_id is passed as a URL parameter
    const {
      name,
      description,
      category,
      location,
      start_date,
      end_date,
      status,
    } = req.body;

    const image_url = req.file ? req.file.filename : null;

    const pool = await getConnection();
    const request = pool.request();

    request.input('id', sql.Int, id);
    request.input('name', sql.NVarChar(200), name);
    request.input('description', sql.NVarChar(sql.MAX), description);
    request.input('category', sql.NVarChar(20), category);
    request.input('location', sql.NVarChar(200), location);
    request.input('start_date', sql.Date, start_date);
    request.input('end_date', sql.Date, end_date);
    request.input('status', sql.NVarChar(20), status);
    request.input('image_url', sql.NVarChar(255), image_url);

    const query = `
      UPDATE activities 
      SET 
        name = @name,
        description = @description,
        category = @category,
        location = @location,
        start_date = @start_date,
        end_date = @end_date,
        status = @status,
        image_url = COALESCE(@image_url, image_url)
      WHERE activity_id = @id;
    `;

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Hoạt động không tồn tại' });
    }

    res.status(200).json({ message: 'Cập nhật hoạt động thành công!' });
  } catch (err) {
    console.error('Lỗi cập nhật hoạt động:', err);
    res.status(500).json({ error: 'Cập nhật hoạt động thất bại', detail: err.message });
  }
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params; // Assuming activity_id is passed as a URL parameter

    const pool = await getConnection();
    const request = pool.request();

    request.input('id', sql.Int, id);

    const query = `DELETE FROM activities WHERE activity_id = @id`;

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Hoạt động không tồn tại' });
    }

    res.status(200).json({ message: 'Xóa hoạt động thành công!' });
  } catch (err) {
    console.error('Lỗi xóa hoạt động:', err);
    res.status(500).json({ error: 'Xóa hoạt động thất bại', detail: err.message });
  }
};
// Create a new activity
exports.createActivity = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      location,
      start_date,
      end_date,
      status,
      created_by
    } = req.body;

    // Handle file upload
    const image_url = req.file ? `uploads/${req.file.filename}` : null;

    const pool = await getConnection();
    const request = pool.request();

    request.input('name', sql.NVarChar(200), name);
    request.input('description', sql.NVarChar(sql.MAX), description);
    request.input('category', sql.NVarChar(20), category);
    request.input('location', sql.NVarChar(200), location);
    request.input('start_date', sql.Date, start_date ? new Date(start_date) : null);
    request.input('end_date', sql.Date, end_date ? new Date(end_date) : null);
    request.input('status', sql.NVarChar(20), status);
    request.input('image_url', sql.NVarChar(255), image_url);

    const query = `
      INSERT INTO activities 
      (name, description, category, location, start_date, end_date, status, image_url)
      OUTPUT INSERTED.activity_id, INSERTED.image_url
      VALUES
      (@name, @description, @category, @location, @start_date, @end_date, @status, @image_url)
    `;

    const result = await request.query(query);

    res.status(201).json({
      message: 'Tạo hoạt động thành công!',
      activity_id: result.recordset[0].activity_id,
      image_url: result.recordset[0].image_url
    });
  } catch (err) {
    console.error('Lỗi tạo hoạt động:', err);
    res.status(500).json({ error: 'Tạo hoạt động thất bại', detail: err.message });
  }
}