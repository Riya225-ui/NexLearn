# 🎓 NexLearn AI — AI-Powered Learning Assistant

> An intelligent study companion built with React.js, Node.js, and Gemini AI.
> Developed as a Software Engineering course project.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL (optional — app works without it, but auth/history won't persist)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

---

## 📁 Project Structure

```
NexLearn/
├── frontend/     # React + Vite + Tailwind CSS v4
└── backend/      # Node.js + Express + Sequelize
```

---

## ⚙️ Setup Instructions

### 1. Configure the Backend

Edit `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nexlearn_db
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

> **Important:** Replace `your_gemini_api_key_here` with your actual Gemini API key from Google AI Studio.

### 2. Start the Backend

```bash
cd backend
npm run dev
# Runs at http://localhost:5000
```

### 3. Start the Frontend

```bash
cd frontend
npm run dev
# Runs at http://localhost:5173
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎥 YouTube Summarizer | Paste a YouTube URL → Get a structured AI summary |
| 📄 Document AI | Upload PDF/DOCX/PPT/TXT → AI analyzes and summarizes |
| 👨‍🏫 AI Teacher | Enter any concept → Get a clear, simple explanation |
| 📝 Smart Notes | Paste content → Auto-generate revision-ready notes |
| 💬 Chat with Doc | Paste document text → Ask questions in a chat interface |
| ❓ Quiz Generator | Input study content → Get MCQs, True/False & Short Answer questions |
| 🃏 Flashcards | Input study content → Get a flip-card deck for active recall |
| 🌐 Bangla Support | All features support English → Bangla output |

---

## 🏗️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS v4**
- **React Router DOM**
- **Axios**
- **Lucide React** (icons)
- **Framer Motion** + **React Hot Toast**

### Backend
- **Node.js** + **Express.js**
- **Sequelize** ORM + **MySQL2**
- **JWT** + **bcrypt** (authentication)
- **Multer** (file uploads)
- **pdf-parse** (PDF text extraction)
- **@google/genai** (Gemini AI SDK)

---

## 👥 Team

- Riya Akter — 2022-3-60-176
- Mehrin Mahabub Kotha — 2022-3-60-284
- Md. Rayhan Ahamed — 2021-3-60-197

---

## 📝 Notes

- The app will run without MySQL, but user auth and chat history won't persist across sessions.
- YouTube summarization requires the video to have captions/subtitles enabled.
- File upload limit is 20MB.
