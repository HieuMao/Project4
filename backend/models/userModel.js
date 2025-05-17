const { getConnection } = require('../config/db');

exports.findByEmail = async (email) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('email', email)
    .query('SELECT * FROM users WHERE email = @email');
  return result.recordset[0];
};

exports.getAllUsers = async () => {
  const pool = await getConnection();
  const result = await pool.request().query('SELECT * FROM users');
  return result.recordset;
};
