const { getConnection, sql } = require('../config/db'); // Import both getConnection and sql

exports.findByEmail = async (email) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT * FROM users WHERE email = @email');
  return result.recordset[0];
};

exports.getAllUsers = async () => {
  const pool = await getConnection();
  const result = await pool.request().query('SELECT * FROM users');
  return result.recordset;
};

exports.createUser = async (name, email, password, phone) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('name', sql.NVarChar, name)
    .input('email', sql.NVarChar, email)
    .input('password', sql.NVarChar, password)
    .input('phone', sql.NVarChar, phone)
    .query('INSERT INTO users (name, email, password, phone) VALUES (@name, @email, @password, @phone)');
  return result;
};