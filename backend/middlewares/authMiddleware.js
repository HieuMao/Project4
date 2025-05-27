const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: 'Không có token, truy cập bị từ chối' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data (e.g., user_id) to request
    next();
  } catch (err) {
    console.error('Lỗi xác thực:', err);
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

module.exports = authMiddleware;