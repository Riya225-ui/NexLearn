const express = require('express');
const router = express.Router();
const { submitContact, getMessages, markRead } = require('../controllers/contact.controller');

// Public — anyone can send a contact message
router.post('/', submitContact);

// Admin routes (no auth middleware for now — can add later)
router.get('/messages', getMessages);
router.patch('/messages/:id/read', markRead);

module.exports = router;
