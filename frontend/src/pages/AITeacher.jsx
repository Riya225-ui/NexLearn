import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/useStream';
import { GraduationCap, Sparkles, Copy, Globe, BookOpen, Send, Square } from 'lucide-react';
import toast from 'react-hot-toast';

const exampleConcepts = ['Neural Networks', 'Recursion', 'Binary Search Trees', 'Object-Oriented Programming', 'HTTP vs HTTPS', 'Big O Notation'];

export default function AITeacher() {
  const { user } = useAuth();
  const [concept, setConcept] = useState('');
  const [context, setContext] = useState('');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'english');
  const [result, setResult] = useState(null);

  const { streamText, isStreaming, startStream, abortStream } = useStream();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!concept.trim()) return;
    setResult(null);

    await startStream('/teacher/explain/stream', { concept, context, language }, {
      onDone: (fullText) => {
        setResult({ concept, explanation: fullText, language });
        toast.success('Explanation ready!');
      },
      onError: (msg) => {
        toast.error(msg || 'Failed to get explanation.');
      },
    });
  };

  const displayText = isStreaming ? streamText : result?.explanation || '';

  return (
    <Layout>
      <div className="animate-fadeInUp">
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={22} color="#8b5cf6" />
            </div>
            <div>
              <h1 className="section-title">AI Teacher</h1>
              <p className="section-subtitle">Get any concept explained clearly, like a personal tutor</p>
            </div>
          </div>
        </div>

        
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>Try an example:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {exampleConcepts.map(c => (
              <button key={c} onClick={() => setConcept(c)}
                className="badge badge-violet"
                style={{ cursor: 'pointer', padding: '6px 14px', fontSize: 12, border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.1)', color: '#a78bfa' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label"><BookOpen size={12} style={{ display: 'inline', marginRight: 6 }} />Concept or Topic</label>
              <input id="teacher-concept" type="text" className="input-field"
                placeholder="e.g., Neural Networks, Recursion, Binary Search..." value={concept}
                onChange={e => setConcept(e.target.value)} required />
            </div>

            <div>
              <label className="label">Additional Context (optional)</label>
              <textarea id="teacher-context" className="input-field" style={{ minHeight: 80 }}
                placeholder="e.g., I'm a beginner in programming, explain it in simple terms..."
                value={context} onChange={e => setContext(e.target.value)} />
            </div>

            <div>
              <label className="label"><Globe size={12} style={{ display: 'inline', marginRight: 6 }} />Language</label>
              <select className="input-field" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="english">English</option>
                <option value="bangla">বাংলা (Bangla)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button id="teacher-submit" type="submit" className="btn-primary" disabled={isStreaming} style={{ alignSelf: 'flex-start', padding: '11px 28px' }}>
                {isStreaming ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Thinking...</> : <><Send size={15} /> Explain This</>}
              </button>
              {isStreaming && (
                <button type="button" className="btn-ghost" style={{ alignSelf: 'flex-start', padding: '11px 16px' }} onClick={abortStream}>
                  <Square size={14} /> Stop
                </button>
              )}
            </div>
          </form>
        </div>

        {(isStreaming || result) && (
          <div className="animate-fadeIn glass-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>
                🎓 Explanation: <span className="gradient-text">{concept}</span>
              </h2>
              {!isStreaming && displayText && (
                <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }}
                  onClick={() => { navigator.clipboard.writeText(displayText); toast.success('Copied!'); }}>
                  <Copy size={13} /> Copy
                </button>
              )}
            </div>
            <div className="result-box" style={{ whiteSpace: 'pre-wrap' }}>
              {displayText}
              {isStreaming && <span className="streaming-cursor">▋</span>}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
