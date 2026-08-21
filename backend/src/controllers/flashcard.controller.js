const { generateFlashcards } = require('../services/gemini.service');

const createFlashcards = async (req, res) => {
  try {
    const { text, language = 'english' } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text content is required.' });
    const flashcards = await generateFlashcards(text, language);
    res.json({ success: true, flashcards, language });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createFlashcards };
