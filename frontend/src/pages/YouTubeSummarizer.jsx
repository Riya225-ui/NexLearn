import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/useStream';
import { MonitorPlay, Link as LinkIcon, Sparkles, Copy, Globe, Square } from 'lucide-react';
import toast from 'react-hot-toast';

export default function YouTubeSummarizer() {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'english');
  const [meta, setMeta] = useState(null);
  const [finalSummary, setFinalSummary] = useState('');

  const { streamText, isStreaming, startStream, abortStream } = useStream();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setMeta(null);
    setFinalSummary('');

    await startStream('/youtube/summarize/stream', { url, language }, {
      onMeta: (m) => setMeta(m),
      onDone: (fullText) => {
        setFinalSummary(fullText);
        toast.success('Video summarized successfully!');
      },
      onError: (msg) => {
        toast.error(msg || 'Failed to summarize video.');
      },
    });
  };

  const summary = isStreaming ? streamText : finalSummary;

  const copy = () => {
    navigator.clipboard.writeText(summary);
    toast.success('Summary copied!');
  };

  return (
    <Layout>
      <div className="animate-fadeInUp">
        
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MonitorPlay size={22} color="#ef4444" />
            </div>
            <div>
              <h1 className="section-title">YouTube Summarizer</h1>
              <p className="section-subtitle">Paste a YouTube URL and get an AI-generated summary instantly</p>
            </div>
          </div>
        </div>

        
        <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label"><LinkIcon size={12} style={{ display: 'inline', marginRight: 6 }} />YouTube Video URL</label>
              <div style={{ position: 'relative' }}>
                <MonitorPlay size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }} />
                <input
                  id="yt-url-input"
                  type="url"
                  className="input-field"
                  style={{ paddingLeft: 42 }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label"><Globe size={12} style={{ display: 'inline', marginRight: 6 }} />Output Language</label>
              <select id="yt-language" className="input-field" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="english">English</option>
                <option value="bangla">বাংলা (Bangla)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button id="yt-submit" type="submit" className="btn-primary" disabled={isStreaming} style={{ alignSelf: 'flex-start', padding: '11px 28px' }}>
                {isStreaming ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Summarizing...</> : <><Sparkles size={15} /> Summarize Video</>}
              </button>
              {isStreaming && (
                <button type="button" className="btn-ghost" style={{ alignSelf: 'flex-start', padding: '11px 16px' }} onClick={abortStream}>
                  <Square size={14} /> Stop
                </button>
              )}
            </div>
          </form>
        </div>

        
        {(isStreaming || finalSummary) && (
          <div className="animate-fadeIn">
            
            {meta && (
              <div className="glass-card" style={{ padding: 16, marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                <img src={meta.thumbnailUrl} alt="thumbnail" style={{ width: 120, borderRadius: 8, flexShrink: 0 }} />
                <div>
                  <a href={meta.videoUrl} target="_blank" rel="noreferrer" style={{ color: '#a78bfa', fontWeight: 600, fontSize: 14 }}>{meta.videoUrl}</a>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge-violet">Video</span>
                    <span className={`badge ${meta.language === 'bangla' ? 'badge-pink' : 'badge-blue'}`}>{meta.language}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="glass-card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>📝 AI Summary</h2>
                {!isStreaming && summary && (
                  <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }} onClick={copy}>
                    <Copy size={13} /> Copy
                  </button>
                )}
              </div>
              <div className="result-box" style={{ whiteSpace: 'pre-wrap' }}>
                {summary}
                {isStreaming && <span className="streaming-cursor">▋</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
