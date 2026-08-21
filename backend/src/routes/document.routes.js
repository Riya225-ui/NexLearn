const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { uploadAndSummarize, getDocuments, getDocument, extractDocumentText } = require('../controllers/document.controller');
const { protect } = require('../middleware/auth.middleware');


const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`),
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } }); 

router.post('/upload', protect, upload.single('file'), uploadAndSummarize);
router.post('/extract', protect, upload.single('file'), extractDocumentText);
router.get('/', protect, getDocuments);
router.get('/:id', protect, getDocument);

module.exports = router;
