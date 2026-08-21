const express = require('express');
const router = express.Router();
const { chat, chatStream } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');
router.post('/', protect, chat);
router.post('/stream', protect, chatStream);
module.exports = router;
