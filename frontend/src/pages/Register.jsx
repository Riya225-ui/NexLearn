import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Globe, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', preferredLanguage: 'english' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.preferredLanguage);
      toast.success('Account created! Welcome to NexLearn AI 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-dark)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative'
    }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="animate-fadeInUp" style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} className="animate-pulse-glow">
            <Sparkles size={26} color="white" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Space Grotesk' }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>Start learning smarter with AI today</p>
        </div>

        <div className="glass-card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-name" type="text" className="input-field" style={{ paddingLeft: 40 }}
                  placeholder="Riya Akter" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-email" type="email" className="input-field" style={{ paddingLeft: 40 }}
                  placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-password" type={showPass ? 'text' : 'password'} className="input-field"
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                  placeholder="Min. 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label"><Globe size={12} style={{ display: 'inline', marginRight: 5 }} />Preferred Language</label>
              <select id="reg-language" className="input-field" value={form.preferredLanguage}
                onChange={e => setForm({ ...form, preferredLanguage: e.target.value })}>
                <option value="english">English</option>
                <option value="bangla">বাংলা (Bangla)</option>
              </select>
            </div>

            <button id="reg-submit" type="submit" className="btn-primary" style={{ padding: '13px', fontSize: 15, marginTop: 4 }} disabled={loading}>
              {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-muted)', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
