const express = require('express');
const router = express.Router();
const { createFlashcards } = require('../controllers/flashcard.controller');
const { protect } = require('../middleware/auth.middleware');
router.post('/generate', protect, createFlashcards);
module.exports = router;
