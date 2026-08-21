const { generateNotes, generateNotesStream } = require('../services/gemini.service');

const createNotes = async (req, res) => {
  try {
    const { text, language = 'english' } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text content is required.' });
    const notes = await generateNotes(text, language);
    res.json({ success: true, notes, language });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const createNotesStream = async (req, res) => {
  try {
    const { text, language = 'english' } = req.body;
    if (!text) {
      res.status(400).json({ success: false, message: 'Text content is required.' });
      return;
    }
    await generateNotesStream(text, language, res);
  } catch (error) {
    console.error('Notes stream error:', error.message);
  }
};

module.exports = { createNotes, createNotesStream };
