import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/useStream';
import { FileEdit, Sparkles, Copy, Download, Globe, Square } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SmartNotes() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'english');
  const [finalNotes, setFinalNotes] = useState('');

  const { streamText, isStreaming, startStream, abortStream } = useStream();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim().length < 50) { toast.error('Please enter at least 50 characters of content.'); return; }
    setFinalNotes('');

    await startStream('/notes/generate/stream', { text, language }, {
      onDone: (fullText) => {
        setFinalNotes(fullText);
        toast.success('Smart notes generated!');
      },
      onError: (msg) => {
        toast.error(msg || 'Failed to generate notes.');
      },
    });
  };

  const notes = isStreaming ? streamText : finalNotes;

  const downloadNotes = () => {
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'nexlearn-notes.txt'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Notes downloaded!');
  };

  return (
    <Layout>
      <div className="animate-fadeInUp">
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileEdit size={22} color="#10b981" />
            </div>
            <div>
              <h1 className="section-title">Smart Notes</h1>
              <p className="section-subtitle">Paste any content and get structured revision notes automatically</p>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Content to convert into Notes</label>
              <textarea
                id="notes-content"
                className="input-field"
                style={{ minHeight: 200 }}
                placeholder="Paste your lecture content, article, video transcript or any text here..."
                value={text}
                onChange={e => setText(e.target.value)}
                required
              />
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>{text.length} characters</div>
            </div>

            <div>
              <label className="label"><Globe size={12} style={{ display: 'inline', marginRight: 6 }} />Language</label>
              <select className="input-field" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="english">English</option>
                <option value="bangla">বাংলা (Bangla)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button id="notes-submit" type="submit" className="btn-primary" disabled={isStreaming} style={{ alignSelf: 'flex-start', padding: '11px 28px' }}>
                {isStreaming ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Generating Notes...</> : <><Sparkles size={15} /> Generate Smart Notes</>}
              </button>
              {isStreaming && (
                <button type="button" className="btn-ghost" style={{ alignSelf: 'flex-start', padding: '11px 16px' }} onClick={abortStream}>
                  <Square size={14} /> Stop
                </button>
              )}
            </div>
          </form>
        </div>

        {(isStreaming || finalNotes) && (
          <div className="animate-fadeIn glass-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>📝 Generated Notes</h2>
              {!isStreaming && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }}
                    onClick={() => { navigator.clipboard.writeText(notes); toast.success('Copied!'); }}>
                    <Copy size={13} /> Copy
                  </button>
                  <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }} onClick={downloadNotes}>
                    <Download size={13} /> Download
                  </button>
                </div>
              )}
            </div>
            <div className="result-box" style={{ whiteSpace: 'pre-wrap' }}>
              {notes}
              {isStreaming && <span className="streaming-cursor">▋</span>}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
