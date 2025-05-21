const sql = require('mssql');

const config = {
  user: 'NguyenHieu',
  password: 'Mao2462004',
  server: 'localhost',
  database: 'TTCD4',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: 'ALABATER'
  }
};


let pool;

async function getConnection() {
  if (pool) return pool;
  pool = await sql.connect(config);
  return pool;
}

module.exports = { getConnection, sql };