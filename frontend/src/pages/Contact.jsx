import { useState } from 'react';
import { Mail, Send, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const faqs = [
  { q: 'Is NexLearn AI completely free?',              a: 'Yes! NexLearn AI is 100% free to use. No credit card, no hidden fees. Just create an account and start learning.' },
  { q: 'What file formats does Document AI support?',  a: 'We support PDF, TXT, and DOCX (Word) files. You can upload and get AI summaries, quizzes, flashcards, and notes from all these formats.' },
  { q: 'Does it support Bangla language?',             a: 'Yes! All AI features support both English and Bangla output. Just select your preferred language before generating content.' },
  { q: 'Can I use it for YouTube videos without captions?', a: 'Unfortunately no — YouTube summarization requires captions/subtitles to be enabled on the video.' },
  { q: 'Is my data safe?',                             a: 'Your documents and data are stored securely in our database. We never share your data with third parties.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, form);
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <Mail size={14} color="#8b5cf6" />
          <span style={{ fontSize: 13, color: '#8b5cf6', fontWeight: 600 }}>Get in Touch</span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 16 }}>
          Contact <span className="gradient-text">Us</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          Have a question, suggestion, or feedback? We would love to hear from you. Fill in the form and we will get back to you soon.
        </p>
      </section>

      {/* ─── Main Content ─── */}
      <section style={{ padding: '0 32px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 40 }} className="contact-grid">

          {/* Left — Email Card only */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="glass-card" style={{ padding: 22, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'rgba(139,92,246,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Mail size={20} color="#8b5cf6" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Email Us</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>nexlearn@gmail.com</div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="glass-card" style={{ padding: 36 }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px',
                  background: 'rgba(16,185,129,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircle size={36} color="#10b981" />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Thank you for reaching out. We have received your message and will get back to you within 24 hours.
                </p>
                <button
                  className="btn-primary"
                  style={{ marginTop: 28 }}
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Send a Message</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="label">Your Name *</label>
                    <input
                      className="input-field"
                      name="name"
                      placeholder="e.g. Riya Akter"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input
                      className="input-field"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="label">Subject *</label>
                  <input
                    className="input-field"
                    name="subject"
                    placeholder="e.g. Feature Request, Bug Report..."
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label className="label">Message *</label>
                  <textarea
                    className="input-field"
                    name="message"
                    placeholder="Tell us your thoughts, suggestions, or questions..."
                    value={form.message}
                    onChange={handleChange}
                    style={{ minHeight: 140, resize: 'vertical' }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '13px', fontSize: 15, justifyContent: 'center' }}
                  disabled={loading}
                >
                  {loading ? (
                    <><div className="spinner" style={{ width: 18, height: 18 }} /> Sending...</>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ padding: '0 32px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Quick answers to common questions</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="glass-card" style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '18px 24px', background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', paddingRight: 16 }}>{q}</span>
                  {openFaq === i
                    ? <ChevronUp size={18} color="#8b5cf6" style={{ flexShrink: 0 }} />
                    : <ChevronDown size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  }
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 18px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
