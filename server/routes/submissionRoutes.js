const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const isAuth = require('../middleware/isAuth');

router.get('/user/:userId/problem/:problemId', isAuth, async (req, res) => {
  try {
    const { userId, problemId } = req.params;
    const submissions = await Submission.find({ userId, problemId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching submissions' });
  }
});

// GET /api/submissions/user/:userId/summary
router.get('/user/:userId/summary', isAuth, async (req, res) => {
  try {
    const userId = req.params.userId;

    const total = await Submission.countDocuments({ userId });
    const accepted = await Submission.countDocuments({ userId, verdict: /Accepted/i });

    const submissions = await Submission.find({ userId })
      .sort({ createdAt: -1 })
      .select('verdict createdAt problemId code')
      .populate('problemId', 'name');

    res.json({
      total,
      accepted,
      accuracy: total ? ((accepted / total) * 100).toFixed(2) : 0,
      submissions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
