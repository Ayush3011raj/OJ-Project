const express = require('express');
const router = express.Router();
const { aiReview } = require('../controllers/aiController');

router.post('/ai-review', aiReview);

module.exports = router;
