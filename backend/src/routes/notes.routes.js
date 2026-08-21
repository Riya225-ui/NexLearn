const express = require('express');
const router = express.Router();
const { createNotes, createNotesStream } = require('../controllers/notes.controller');
const { protect } = require('../middleware/auth.middleware');
router.post('/generate', protect, createNotes);
router.post('/generate/stream', protect, createNotesStream);
module.exports = router;
