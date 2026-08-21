import { Brain, Target, Heart, Award, Users, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const values = [
  { icon: Brain,  title: 'AI-First',         desc: 'Every feature is powered by state-of-the-art AI to give you the best learning experience.' },
  { icon: Heart,  title: 'Student-Focused',  desc: 'Built by students, for students. We understand the challenges of modern studying.' },
  { icon: Target, title: 'Results-Driven',   desc: 'Our tools are designed to maximize retention and minimize study time.' },
  { icon: Award,  title: 'Open & Free',      desc: 'NexLearn AI is completely free to use with no hidden costs or paywalls.' },
];

export default function About() {
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
          <Users size={14} color="#8b5cf6" />
          <span style={{ fontSize: 13, color: '#8b5cf6', fontWeight: 600 }}>About Us</span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 900, marginBottom: 20 }}>
          About <span className="gradient-text">NexLearn AI</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>
          NexLearn AI was born from a simple idea — studying should be smarter, not harder.
          We are building tools we wish existed when we started.
        </p>
      </section>

      {/* ─── Mission ─── */}
      <section style={{ padding: '40px 32px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 900, margin: '0 auto', padding: '48px',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.08))',
          borderRadius: 24, border: '1px solid rgba(139,92,246,0.2)',
          textAlign: 'center',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16, margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={28} color="white" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Our Mission</h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 640, margin: '0 auto' }}>
            To democratize education by making AI-powered learning tools accessible to every student — regardless of their background, language, or resources. We believe every student deserves a personal AI study companion.
          </p>
        </div>
      </section>

      {/* ─── Values ─── */}
      <section style={{ padding: '20px 32px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>
            What We <span className="gradient-text">Stand For</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 24 }}>
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card" style={{ padding: 28 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: 'rgba(139,92,246,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                }}>
                  <Icon size={22} color="#8b5cf6" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
