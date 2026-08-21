import { useNavigate } from 'react-router-dom';
import {
  MonitorPlay, FileText, GraduationCap, FileEdit,
  MessageSquare, HelpCircle, CreditCard, Globe,
  ArrowRight, Timer, BookMarked, Zap, CheckCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  {
    icon: MonitorPlay, label: 'YouTube Summarizer', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',
    desc: 'Paste any YouTube URL and get a structured AI summary in seconds. Supports videos with captions in any language.',
    points: ['Instant structured summaries', 'Key takeaways extraction', 'Bangla & English output', 'Save to your library'],
  },
  {
    icon: FileText, label: 'Document AI', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',
    desc: 'Upload PDFs and text files to get AI-powered analysis, summaries, and key point extraction.',
    points: ['PDF & TXT support', 'AI-powered summarization', 'Key concept extraction', 'Document chat'],
  },
  {
    icon: GraduationCap, label: 'AI Teacher', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',
    desc: 'Enter any concept or topic and get a crystal-clear explanation with analogies, examples, and related concepts.',
    points: ['Simple, clear explanations', 'Real-world analogies', 'Related concept suggestions', 'Streaming responses'],
  },
  {
    icon: FileEdit, label: 'Smart Notes', color: '#10b981', bg: 'rgba(16,185,129,0.1)',
    desc: 'Paste any content and get beautifully structured revision notes with headings, bullet points, and key takeaways.',
    points: ['Auto-structured headings', 'Bullet-point key facts', 'Key takeaways section', 'Save & export'],
  },
  {
    icon: MessageSquare, label: 'Chat with Document', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
    desc: 'Upload a document and start a conversation with it. Ask any question and get answers grounded in your material.',
    points: ['Context-aware answers', 'Multi-turn conversation', 'Chat history saved', 'Based on your document only'],
  },
  {
    icon: HelpCircle, label: 'Quiz Generator', color: '#ec4899', bg: 'rgba(236,72,153,0.1)',
    desc: 'Generate comprehensive quizzes from any study material with MCQs, True/False, and Short Answer questions.',
    points: ['MCQ + True/False + Short Answer', 'Instant feedback', 'Explanations for each answer', 'Save quiz results'],
  },
  {
    icon: CreditCard, label: 'Flashcards', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',
    desc: 'Create interactive flip-card decks for active recall. The most effective method for long-term memory retention.',
    points: ['Flip-card interaction', '10-15 cards per session', 'Front & back review', 'Save flashcard sets'],
  },
  {
    icon: Globe, label: 'Bangla Support', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)',
    desc: 'All AI features fully support Bangla language output. Perfect for Bangladeshi students studying in their native language.',
    points: ['Full Bangla AI output', 'Per-feature language toggle', 'Natural Bangla text', 'All 7 features supported'],
  },
  {
    icon: Timer, label: 'Pomodoro Timer', color: '#f97316', bg: 'rgba(249,115,22,0.1)',
    desc: 'Stay focused with the proven Pomodoro technique. 25-minute study sessions with 5-minute breaks to maximize productivity.',
    points: ['25/5 minute cycles', 'Session tracking', 'Focus mode', 'Custom intervals'],
  },
  {
    icon: BookMarked, label: 'Content Library', color: '#84cc16', bg: 'rgba(132,204,22,0.1)',
    desc: 'All your generated quizzes, notes, flashcards, and summaries saved in one place. Access your study history anytime.',
    points: ['All content saved to DB', 'Search & filter', 'Delete & manage', 'Organized by type'],
  },
];

export default function Features() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <Navbar />

      {/* ─── Hero ─── */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: 999, padding: '6px 16px', marginBottom: 24,
        }}>
          <Zap size={14} color="#8b5cf6" />
          <span style={{ fontSize: 13, color: '#8b5cf6', fontWeight: 600 }}>10 Powerful Features</span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 20 }}>
          Everything You Need to <span className="gradient-text">Succeed</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto 36px', lineHeight: 1.7 }}>
          NexLearn AI combines 10 powerful study tools into one seamless platform — designed to help you learn smarter and faster.
        </p>
        <button className="btn-primary" style={{ padding: '13px 32px', fontSize: 15 }} onClick={() => navigate('/register')}>
          Try All Features Free <ArrowRight size={16} />
        </button>
      </section>

      {/* ─── Features List ─── */}
      <section style={{ padding: '20px 32px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {features.map(({ icon: Icon, label, color, bg, desc, points }, idx) => (
            <div key={label} className="glass-card-hover" style={{
              padding: 36,
              display: 'grid',
              gridTemplateColumns: idx % 2 === 0 ? '1fr 1.5fr' : '1.5fr 1fr',
              gap: 40,
              alignItems: 'center',
            }} className="feature-row glass-card-hover">
              <div style={{ order: idx % 2 === 0 ? 0 : 1 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
                }}>
                  <Icon size={26} color={color} />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>{label}</h2>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{desc}</p>
                <button
                  className="btn-primary"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}99)`, fontSize: 13, padding: '8px 20px' }}
                  onClick={() => navigate('/register')}
                >
                  Try It Free <ArrowRight size={13} />
                </button>
              </div>
              <div style={{ order: idx % 2 === 0 ? 1 : 0 }}>
                <div style={{
                  background: bg, borderRadius: 16, padding: 24,
                  border: `1px solid ${color}33`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    What you get
                  </div>
                  {points.map(point => (
                    <div key={point} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <CheckCircle size={15} color={color} />
                      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '20px 32px 80px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{
          maxWidth: 640, margin: '0 auto', padding: '52px 40px', borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.12))',
          border: '1px solid rgba(139,92,246,0.25)',
        }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 14 }}>Start Using All Features Free</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
            No credit card. No limits. Just sign up and start studying smarter today.
          </p>
          <button className="btn-primary" style={{ padding: '14px 36px', fontSize: 16 }} onClick={() => navigate('/register')}>
            Create Free Account <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .feature-row { grid-template-columns: 1fr !important; }
          .feature-row > div { order: unset !important; }
        }
      `}</style>
    </div>
  );
}
