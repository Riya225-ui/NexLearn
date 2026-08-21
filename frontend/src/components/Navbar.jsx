import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { to: '/',         label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/about',    label: 'About' },
  { to: '/contact',  label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(139,92,246,0.15)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(139,92,246,0.08)' : 'none',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: 68,
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
            }}>
              <Sparkles size={20} color="white" />
            </div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20, color: '#0f172a' }}>
              NexLearn <span style={{ color: '#8b5cf6' }}>AI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                  textDecoration: 'none', transition: 'all 0.2s ease',
                  color: active ? '#8b5cf6' : '#475569',
                  background: active ? 'rgba(139,92,246,0.1)' : 'transparent',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} className="nav-desktop">
            <Link to="/login" className="btn-ghost" style={{ padding: '8px 20px', fontSize: 14 }}>Sign In</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>
              Get Started <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="nav-mobile"
            onClick={() => setMobileOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#0f172a' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{
            padding: '12px 24px 20px',
            background: 'rgba(255,255,255,0.98)',
            borderTop: '1px solid rgba(139,92,246,0.1)',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                padding: '12px 16px', borderRadius: 10, fontSize: 15, fontWeight: 500,
                textDecoration: 'none', color: location.pathname === to ? '#8b5cf6' : '#475569',
                background: location.pathname === to ? 'rgba(139,92,246,0.08)' : 'transparent',
              }}>
                {label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <Link to="/login" className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Sign In</Link>
              <Link to="/register" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .nav-desktop { display: flex; }
        .nav-mobile  { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: block !important; }
        }
      `}</style>
    </>
  );
}
