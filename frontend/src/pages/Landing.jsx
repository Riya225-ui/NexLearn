import { useNavigate } from 'react-router-dom';
import {
  Sparkles, MonitorPlay, FileText, GraduationCap,
  HelpCircle, CreditCard, MessageSquare, FileEdit,
  ArrowRight, Globe, Shield, Zap, Star, Users, BookOpen
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  { icon: MonitorPlay,   label: 'YouTube Summarizer',  desc: 'Get instant AI summaries from any YouTube video with captions',      color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
  { icon: FileText,      label: 'Document AI',         desc: 'Upload PDFs, PPTs, DOCs and extract key insights with AI',           color: '#3b82f6', bg: 'rgba(59,130,246,0.1)'  },
  { icon: GraduationCap, label: 'AI Teacher',          desc: 'Explain any concept like a personal tutor with examples',            color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'  },
  { icon: FileEdit,      label: 'Smart Notes',         desc: 'Auto-generate revision-ready structured notes from any text',        color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  { icon: MessageSquare, label: 'Chat with Document',  desc: 'Ask questions directly from your uploaded documents',                color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  { icon: HelpCircle,    label: 'Quiz Generator',      desc: 'Create MCQs, True/False & Short-answer quizzes instantly',          color: '#ec4899', bg: 'rgba(236,72,153,0.1)'  },
  { icon: CreditCard,    label: 'Flashcards',          desc: 'Flip-card decks for active recall and long-term memory retention',   color: '#06b6d4', bg: 'rgba(6,182,212,0.1)'   },
  { icon: Globe,         label: 'Bangla Support',      desc: 'Full English-to-Bangla support across all AI features',             color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
];

const stats = [
  { value: '8+',   label: 'AI Features',   icon: Zap },
  { value: '100%', label: 'Free to Use',   icon: Star },
  { value: '2',    label: 'Languages',     icon: Globe },
  { value: '∞',    label: 'Documents',     icon: BookOpen },
];

const testimonials = [
  { name: 'Riya Akter',         role: 'CSE Student, EWU',    text: 'NexLearn helped me prepare for finals in half the time. The quiz generator is incredible!' },
  { name: 'Mehrin Mahabub',     role: 'Software Engineering', text: 'The AI teacher explains concepts so clearly. It is like having a tutor available 24/7.' },
  { name: 'Md. Rayhan Ahamed',  role: 'EWU Student',         text: 'Generating flashcards from my lecture notes saves me hours every week.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Navbar />

      {/* ─── Hero ─── */}
      <section style={{ 
        textAlign: 'center', 
        padding: '120px 24px 80px', 
        position: 'relative', 
        zIndex: 1,
        background: 'url(/home-bg.jpg) center/cover no-repeat',
        borderBottom: '1px solid var(--border-subtle)',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ 
          maxWidth: 900,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'radial-gradient(ellipse 70% 60% at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0) 80%)',
          padding: '60px 20px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(217, 119, 87, 0.1)', border: '1px solid rgba(217, 119, 87, 0.25)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 28,
          }}>
            <Sparkles size={14} color="#d97757" />
            <span style={{ fontSize: 13, color: '#d97757', fontWeight: 600 }}>AI-Powered Learning Platform</span>
          </div>

          <div style={{ 
            fontSize: 'clamp(60px, 11vw, 130px)', 
            fontWeight: 900, 
            color: 'var(--text-primary)', 
            lineHeight: 0.9, 
            marginBottom: 16,
            letterSpacing: '-0.04em',
            textShadow: '0 0 40px rgba(255,255,255,1), 0 0 80px rgba(255,255,255,1)'
          }}>
            NexLearn
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 5vw, 54px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: 'var(--text-secondary)' }}>
            Your AI-Powered<br />
            <span className="gradient-text">Study Companion</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Summarize videos, analyze documents, generate quizzes and flashcards,
            and chat with your study materials — your ultimate AI Study Companion.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ padding: '14px 32px', fontSize: 16 }} onClick={() => navigate('/register')}>
              Start Learning Free <ArrowRight size={17} />
            </button>
            <button className="btn-ghost" style={{ padding: '14px 32px', fontSize: 16 }} onClick={() => navigate('/features')}>
              Explore Features
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap',
          marginTop: 60, padding: '28px 40px', borderRadius: 24,
          background: 'rgba(255,255,255,0.8)', border: '1px solid var(--border-subtle)',
          maxWidth: 640, margin: '60px auto 0',
          boxShadow: '0 8px 32px rgba(45, 42, 38, 0.04)',
        }}>
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                <Icon size={16} color="#d97757" />
                <div style={{ fontSize: 30, fontWeight: 800, fontFamily: 'Lora' }} className="gradient-text">{value}</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section style={{ padding: '60px 32px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800 }}>
            Everything You Need to <span className="gradient-text">Study Smarter</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16 }}>
            8 powerful AI features designed specifically for students
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20, maxWidth: 1200, margin: '0 auto',
        }}>
          {features.map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className="glass-card-hover" style={{ padding: 28, cursor: 'pointer' }} onClick={() => navigate('/register')}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{label}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                marginTop: 14, fontSize: 12, fontWeight: 600, color,
              }}>
                Try it free <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section style={{ padding: '80px 32px', background: 'rgba(139,92,246,0.03)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, marginBottom: 12 }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 52 }}>Get started in 3 simple steps</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Create an Account', desc: 'Sign up for free in seconds. No credit card needed.', color: '#8b5cf6' },
              { step: '02', title: 'Upload or Paste Content', desc: 'Add a YouTube URL, upload a PDF, or paste your study notes.', color: '#3b82f6' },
              { step: '03', title: 'Let AI Do the Work', desc: 'Get instant summaries, quizzes, flashcards, and notes.', color: '#10b981' },
            ].map(({ step, title, desc, color }) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                  background: `rgba(${color === '#8b5cf6' ? '139,92,246' : color === '#3b82f6' ? '59,130,246' : '16,185,129'},0.12)`,
                  border: `2px solid ${color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, color,
                }}>
                  {step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section style={{ padding: '80px 32px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800 }}>
              What <span className="gradient-text">Students Say</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {testimonials.map(({ name, role, text }) => (
              <div key={name} className="glass-card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} color="#f59e0b" fill="#f59e0b" />)}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  "{text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: 'white', fontSize: 15,
                  }}>
                    {name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 700, margin: '0 auto', padding: '60px 40px', borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.12))',
          border: '1px solid rgba(139,92,246,0.25)',
          boxShadow: '0 20px 60px rgba(139,92,246,0.1)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={28} color="white" />
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, marginBottom: 16 }}>
            Ready to Study Smarter?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 16, lineHeight: 1.6 }}>
            Join students using NexLearn AI to learn more efficiently. It is free, no credit card needed.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ padding: '14px 36px', fontSize: 16 }} onClick={() => navigate('/register')}>
              Create Free Account <ArrowRight size={17} />
            </button>
            <button className="btn-ghost" style={{ padding: '14px 28px', fontSize: 16 }} onClick={() => navigate('/about')}>
              Learn About Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
