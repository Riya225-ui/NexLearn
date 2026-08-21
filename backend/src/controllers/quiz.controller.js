const { generateQuiz } = require('../services/gemini.service');

const createQuiz = async (req, res) => {
  try {
    const { text, questionCount = 10, language = 'english' } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text content is required.' });
    const questions = await generateQuiz(text, questionCount, language);
    res.json({ success: true, questions, language });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createQuiz };
