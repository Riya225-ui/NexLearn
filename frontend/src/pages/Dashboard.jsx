import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { MonitorPlay, FileText, GraduationCap, FileEdit, MessageSquare, HelpCircle, CreditCard, Globe, ArrowRight, BookOpen, Star } from 'lucide-react';

const featureCards = [
  { to: '/youtube',   icon: MonitorPlay,       label: 'YouTube Summarizer', desc: 'Summarize any YouTube video instantly',     color: '#18181b', bg: 'rgba(0,0,0,0.04)' },
  { to: '/documents', icon: FileText,      label: 'Document AI',        desc: 'Upload & analyze PDF, DOCX, PPT files',   color: '#18181b', bg: 'rgba(0,0,0,0.04)' },
  { to: '/teacher',   icon: GraduationCap, label: 'AI Teacher',         desc: 'Get concepts explained like a tutor',     color: '#18181b', bg: 'rgba(0,0,0,0.04)' },
  { to: '/notes',     icon: FileEdit,      label: 'Smart Notes',        desc: 'Auto-generate revision notes from text',  color: '#18181b', bg: 'rgba(0,0,0,0.04)' },
  { to: '/chat',      icon: MessageSquare, label: 'Chat with Doc',      desc: 'Ask questions from your documents',       color: '#18181b', bg: 'rgba(0,0,0,0.04)' },
  { to: '/quiz',      icon: HelpCircle,    label: 'Quiz Generator',     desc: 'Create self-assessment quizzes',          color: '#18181b', bg: 'rgba(0,0,0,0.04)' },
  { to: '/flashcards',icon: CreditCard,    label: 'Flashcards',         desc: 'Flip-card revision for key concepts',     color: '#18181b', bg: 'rgba(0,0,0,0.04)' },
  { to: '/teacher',   icon: Globe,         label: 'Bangla Mode',        desc: 'Learn in Bangla with AI support',         color: '#18181b', bg: 'rgba(0,0,0,0.04)' },
];

const tips = [
  'Start by uploading a PDF or entering a YouTube URL.',
  'Use AI Teacher to break down difficult concepts.',
  'Test yourself with quizzes after studying.',
  'Generate flashcards for active recall sessions.',
];

export default function Dashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout>
      <div className="animate-fadeInUp">
        
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="section-title">{greeting}, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Student'}</span> 👋</h1>
          <p className="section-subtitle">What would you like to study today?</p>
        </div>

        
        <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 14, borderColor: 'rgba(245,158,11,0.2)' }}>
          <BookOpen size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            <strong style={{ color: '#f59e0b' }}>💡 Tip: </strong>
            {tips[Math.floor(Math.random() * tips.length)]}
          </p>
        </div>

        
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>
            All Features
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16
          }}>
            {featureCards.map(({ to, icon: Icon, label, desc, color, bg }) => (
              <Link
                key={label}
                to={to}
                className="glass-card-hover"
                style={{ padding: 24, textDecoration: 'none', display: 'block' }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14
                }}>
                  <Icon size={20} color={color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>{desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color, fontWeight: 600 }}>
                  Open <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
