// routes/auth.js
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const isAuth = require('../middleware/isAuth');
const User = require('../models/User');

router.post('/signup', signup);
router.post('/login', login);

// ✅ Add this:
router.get('/me', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ role: user.role });
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
