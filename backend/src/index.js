require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const youtubeRoutes = require('./routes/youtube.routes');
const documentRoutes = require('./routes/document.routes');
const teacherRoutes = require('./routes/teacher.routes');
const notesRoutes = require('./routes/notes.routes');
const chatRoutes = require('./routes/chat.routes');
const quizRoutes = require('./routes/quiz.routes');
const flashcardRoutes = require('./routes/flashcard.routes');
const contactRoutes = require('./routes/contact.routes');

const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;


const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/contact', contactRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NexLearn AI API is running', timestamp: new Date().toISOString() });
});


app.get('/api/key-status', (req, res) => {
  const { getKeyStatus } = require('./services/gemini.service');
  res.json(getKeyStatus());
});


app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized.');
    app.listen(PORT, () => {
      console.log(`🚀 NexLearn AI Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    console.log('⚠️  Starting server without database (some features will be unavailable)...');
    app.listen(PORT, () => {
      console.log(`🚀 NexLearn AI Server running on http://localhost:${PORT} (No DB)`);
    });
  }
};

startServer();
