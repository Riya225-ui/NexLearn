const { chatWithDocument, chatWithDocumentStream } = require('../services/gemini.service');
const { ChatHistory, Document } = require('../models');
const { v4: uuidv4 } = require('uuid');

const chat = async (req, res) => {
  try {
    const { question, documentId, sessionId, language = 'english' } = req.body;
    if (!question) return res.status(400).json({ success: false, message: 'Question is required.' });

    const currentSessionId = sessionId || uuidv4();
    let documentText = req.body.documentText || '';

    if (documentId && !documentText) {
      try {
        const doc = await Document.findOne({ where: { id: documentId, userId: req.user.id } });
        if (doc) documentText = doc.extractedText || '';
      } catch (dbErr) {  }
    }

    if (!documentText) {
      return res.status(400).json({ success: false, message: 'Document text is required for chat.' });
    }

    let history = [];
    try {
      const historyRecords = await ChatHistory.findAll({
        where: { userId: req.user.id, sessionId: currentSessionId },
        order: [['createdAt', 'ASC']],
        limit: 10,
      });
      history = historyRecords.map(h => ({ role: h.role, content: h.content }));
    } catch (dbErr) {  }

    const answer = await chatWithDocument(question, documentText, history, language);

    try {
      await ChatHistory.bulkCreate([
        { userId: req.user.id, documentId: documentId || null, role: 'user', content: question, sessionId: currentSessionId },
        { userId: req.user.id, documentId: documentId || null, role: 'assistant', content: answer, sessionId: currentSessionId },
      ]);
    } catch (dbErr) {  }

    res.json({ success: true, answer, sessionId: currentSessionId, language });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const chatStream = async (req, res) => {
  try {
    const { question, documentId, sessionId, language = 'english' } = req.body;
    if (!question) {
      res.status(400).json({ success: false, message: 'Question is required.' });
      return;
    }

    const currentSessionId = sessionId || uuidv4();
    let documentText = req.body.documentText || '';

    if (documentId && !documentText) {
      try {
        const doc = await Document.findOne({ where: { id: documentId, userId: req.user.id } });
        if (doc) documentText = doc.extractedText || '';
      } catch (dbErr) {  }
    }

    if (!documentText) {
      res.status(400).json({ success: false, message: 'Document text is required for chat.' });
      return;
    }

    let history = [];
    try {
      const historyRecords = await ChatHistory.findAll({
        where: { userId: req.user.id, sessionId: currentSessionId },
        order: [['createdAt', 'ASC']],
        limit: 10,
      });
      history = historyRecords.map(h => ({ role: h.role, content: h.content }));
    } catch (dbErr) {  }

    const answer = await chatWithDocumentStream(question, documentText, history, language, res);

    try {
      await ChatHistory.bulkCreate([
        { userId: req.user.id, documentId: documentId || null, role: 'user', content: question, sessionId: currentSessionId },
        { userId: req.user.id, documentId: documentId || null, role: 'assistant', content: answer, sessionId: currentSessionId },
      ]);
    } catch (dbErr) {  }

  } catch (error) {
    console.error('Chat stream error:', error.message);
  }
};

module.exports = { chat, chatStream };
