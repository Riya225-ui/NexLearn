const express = require('express');
const router = express.Router();
const { createQuiz } = require('../controllers/quiz.controller');
const { protect } = require('../middleware/auth.middleware');
router.post('/generate', protect, createQuiz);
module.exports = router;
