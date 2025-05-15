const sql = require('mssql');

const config = {
  user: 'NguyenHieu',
  password: 'Mao2462004Mao2462004',
  server: 'ALABATER',
  database: 'TTCD4',
  options: {
    encrypt: false,
    enableArithAbort: true
  }
};

let pool;

async function getConnection() {
  if (pool) return pool;
  pool = await sql.connect(config);
  return pool;
}

module.exports = { getConnection };
