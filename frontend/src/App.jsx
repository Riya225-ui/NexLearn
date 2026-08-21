import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing   from './pages/Landing';
import Login     from './pages/Login';
import Register  from './pages/Register';
import About     from './pages/About';
import Contact   from './pages/Contact';
import Features  from './pages/Features';

import Dashboard        from './pages/Dashboard';
import YouTubeSummarizer from './pages/YouTubeSummarizer';
import DocumentAI       from './pages/DocumentAI';
import AITeacher        from './pages/AITeacher';
import SmartNotes       from './pages/SmartNotes';
import ChatWithDoc      from './pages/ChatWithDoc';
import QuizGenerator    from './pages/QuizGenerator';
import Flashcards       from './pages/Flashcards';
import Pomodoro         from './pages/Pomodoro';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1e28',
              color: '#f0f0f5',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#1e1e28' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#1e1e28' } },
          }}
        />
        <Routes>
          {/* ── Public Pages ── */}
          <Route path="/"         element={<Landing />} />
          <Route path="/about"    element={<About />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/features" element={<Features />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Protected App Pages ── */}
          <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/youtube"    element={<ProtectedRoute><YouTubeSummarizer /></ProtectedRoute>} />
          <Route path="/documents"  element={<ProtectedRoute><DocumentAI /></ProtectedRoute>} />
          <Route path="/teacher"    element={<ProtectedRoute><AITeacher /></ProtectedRoute>} />
          <Route path="/notes"      element={<ProtectedRoute><SmartNotes /></ProtectedRoute>} />
          <Route path="/chat"       element={<ProtectedRoute><ChatWithDoc /></ProtectedRoute>} />
          <Route path="/quiz"       element={<ProtectedRoute><QuizGenerator /></ProtectedRoute>} />
          <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
          <Route path="/pomodoro"   element={<ProtectedRoute><Pomodoro /></ProtectedRoute>} />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
