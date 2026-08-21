import { Link } from 'react-router-dom';
import { Sparkles, ExternalLink, Mail, Heart } from 'lucide-react';

const footerLinks = {
  Product:  [
    { label: 'Home',     to: '/' },
    { label: 'Features', to: '/features' },
    { label: 'About',    to: '/about' },
    { label: 'Contact',  to: '/contact' },
  ],
  Tools: [
    { label: 'YouTube Summarizer', to: '/register' },
    { label: 'Document AI',        to: '/register' },
    { label: 'Quiz Generator',     to: '/register' },
    { label: 'Flashcards',         to: '/register' },
  ],
  'Quick Access': [
    { label: 'Sign In',      to: '/login' },
    { label: 'Get Started',  to: '/register' },
    { label: 'AI Teacher',   to: '/register' },
    { label: 'Smart Notes',  to: '/register' },
  ],
};

export default function Footer() {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      borderTop: '1px solid rgba(139,92,246,0.2)',
      paddingTop: 56,
      paddingBottom: 24,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>

        {/* Top row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr repeat(3, 1fr)',
          gap: 40,
          marginBottom: 48,
        }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={20} color="white" />
              </div>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20, color: '#f0f0f5' }}>
                NexLearn <span style={{ color: '#a78bfa' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 260, color: '#64748b' }}>
              Your AI-powered study companion. Summarize, quiz, note, and learn smarter — built for students, by students.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <a href="mailto:nexlearn@ewu.edu.bd" style={{
                width: 38, height: 38, borderRadius: 9,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#94a3b8', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.color = '#a78bfa'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}>
                <Mail size={16} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" style={{
                width: 38, height: 38, borderRadius: 9,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#94a3b8', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.color = '#a78bfa'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 16 }}>
                {heading}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} style={{
                      fontSize: 14, color: '#64748b', textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 24 }} />

        {/* Bottom bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
        }}>
          <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
            © 2026 NexLearn AI · All rights reserved
          </p>
          <p style={{ fontSize: 13, color: '#475569', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            Made with <Heart size={13} color="#ec4899" fill="#ec4899" /> by Team NexLearn
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
