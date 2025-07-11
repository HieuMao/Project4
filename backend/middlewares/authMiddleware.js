// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Không có token, truy cập bị từ chối' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log payload { user_id, role }
    req.user = decoded; // { user_id, role }
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
};