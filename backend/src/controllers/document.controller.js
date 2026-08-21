const fs = require('fs');
const path = require('path');
const { Document } = require('../models');
const { summarize } = require('../services/gemini.service');

let pdfParse;
try { pdfParse = require('pdf-parse'); } catch(e) { pdfParse = null; }

let mammoth;
try { mammoth = require('mammoth'); } catch(e) { mammoth = null; }

const extractText = async (filePath, mimeType) => {
  // PDF
  if (mimeType === 'application/pdf' && pdfParse) {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }
  // Plain text
  if (mimeType === 'text/plain') {
    return fs.readFileSync(filePath, 'utf-8');
  }
  // DOCX (Word)
  if (
    (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
     filePath.toLowerCase().endsWith('.docx')) && mammoth
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  return `[File uploaded: ${path.basename(filePath)}. Text extraction for this file type requires additional processing.]`;
};

const uploadAndSummarize = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { language = 'english' } = req.body;
    const { originalname, filename, mimetype, path: filePath } = req.file;

    const extractedText = await extractText(filePath, mimetype);
    const summary = await summarize(extractedText, language);

    let doc = null;
    try {
      doc = await Document.create({
        userId: req.user.id,
        originalName: originalname,
        fileName: filename,
        fileType: mimetype,
        filePath,
        extractedText,
        summary,
      });
    } catch (dbError) {
      console.warn('DB save failed (DB may not be configured):', dbError.message);
    }

    res.json({
      success: true,
      documentId: doc ? doc.id : null,
      originalName: originalname,
      summary,
      extractedText: extractedText.substring(0, 1000) + (extractedText.length > 1000 ? '...' : ''),
      language,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDocuments = async (req, res) => {
  try {
    const docs = await Document.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.json({ success: true, documents: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found.' });
    res.json({ success: true, document: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const extractDocumentText = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    const text = await extractText(req.file.path, req.file.mimetype);
    res.json({ success: true, text });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadAndSummarize, getDocuments, getDocument, extractDocumentText };
