const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// สร้าง token
exports.signToken = (payload, options = {}) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h', // default
    ...options,
  });
};

// ตรวจสอบ token
exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
