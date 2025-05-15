const db = require('../config/db');

exports.getAllUsers = async () => {
  const pool = await db.getConnection();
  const result = await pool.request().query('SELECT * FROM users');
  return result.recordset;
};
