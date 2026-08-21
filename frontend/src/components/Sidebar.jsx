import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, MonitorPlay, FileText, GraduationCap,
  FileEdit, MessageSquare, HelpCircle, CreditCard,
  LogOut, Sparkles, Globe, User, Timer, Home
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/youtube',    icon: MonitorPlay,     label: 'YouTube Summarizer' },
  { to: '/documents',  icon: FileText,        label: 'Document AI' },
  { to: '/teacher',    icon: GraduationCap,   label: 'AI Teacher' },
  { to: '/notes',      icon: FileEdit,        label: 'Smart Notes' },
  { to: '/chat',       icon: MessageSquare,   label: 'Chat with Doc' },
  { to: '/quiz',       icon: HelpCircle,      label: 'Quiz Generator' },
  { to: '/flashcards', icon: CreditCard,      label: 'Flashcards' },
];

const toolItems = [
  { to: '/pomodoro', icon: Timer, label: 'Pomodoro Timer' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
              NexLearn AI
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Study Companion</div>
          </div>
        </div>
        {/* Back to Home */}
        <NavLink to="/" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none',
          padding: '4px 4px', borderRadius: 6,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#8b5cf6'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Home size={12} /> Back to Home
        </NavLink>
      </div>

      {/* Main Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', padding: '0 4px', marginBottom: 8 }}>
          AI Features
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Tools section */}
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', padding: '0 4px', marginBottom: 8, marginTop: 20 }}>
          Study Tools
        </div>
        {toolItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'rgba(255,255,255,0.03)', marginBottom: 8,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <User size={15} color="white" />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Student'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Globe size={10} />
              {user?.preferredLanguage === 'bangla' ? 'Bangla' : 'English'}
            </div>
          </div>
        </div>
        <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '8px' }} onClick={handleLogout}>
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
