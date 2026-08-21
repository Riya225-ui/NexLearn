const { ContactMessage } = require('../models');

// Submit a contact message (public — no auth required)
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, subject, message) are required.',
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters.',
      });
    }

    const contact = await ContactMessage.create({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: 'Your message has been received! We will get back to you soon.',
      id: contact.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all contact messages (admin use)
const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark as read
const markRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    await msg.update({ status: 'read' });
    res.json({ success: true, message: 'Marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitContact, getMessages, markRead };
