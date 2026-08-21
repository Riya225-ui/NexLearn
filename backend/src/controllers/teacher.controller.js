const { explainConcept, explainConceptStream } = require('../services/gemini.service');

const explain = async (req, res) => {
  try {
    const { concept, context = '', language = 'english' } = req.body;
    if (!concept) return res.status(400).json({ success: false, message: 'Concept is required.' });
    const explanation = await explainConcept(concept, context, language);
    res.json({ success: true, concept, explanation, language });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const explainStream = async (req, res) => {
  try {
    const { concept, context = '', language = 'english' } = req.body;
    if (!concept) {
      res.status(400).json({ success: false, message: 'Concept is required.' });
      return;
    }
    await explainConceptStream(concept, context, language, res);
  } catch (error) {

    console.error('Teacher stream error:', error.message);
  }
};

module.exports = { explain, explainStream };
