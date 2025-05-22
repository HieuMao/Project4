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
