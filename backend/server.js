const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const PORT = 5000;


const config = {
  user: 'NguyenHieu',         
  password: 'Mao2462004',     
  server: 'localhost',           
  database: 'TTCD4',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: 'ALABATER'   // dùng nếu có instance SQL Server
  }
};

app.use(cors());

app.get('/api/users', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM users');
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi truy vấn DB:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
