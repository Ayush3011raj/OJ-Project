// middleware/isAuth.js
const jwt = require('jsonwebtoken');

module.exports = function isAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Just { id: ... }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
