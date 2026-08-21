const express = require('express');
const router = express.Router();
const { summarizeVideo, summarizeVideoStream } = require('../controllers/youtube.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/summarize', protect, summarizeVideo);
router.post('/summarize/stream', protect, summarizeVideoStream);

module.exports = router;
