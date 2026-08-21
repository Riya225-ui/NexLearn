const express = require('express');
const router = express.Router();
const { explain, explainStream } = require('../controllers/teacher.controller');
const { protect } = require('../middleware/auth.middleware');
router.post('/explain', protect, explain);
router.post('/explain/stream', protect, explainStream);
module.exports = router;
