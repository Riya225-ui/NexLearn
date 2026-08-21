import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, Sparkles, Copy, Globe, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DocumentAI() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState(user?.preferredLanguage || 'english');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const onFile = (f) => {
    const allowed = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!allowed.includes(f.type)) { toast.error('Unsupported file type. Please upload PDF, TXT, DOCX or PPT.'); return; }
    if (f.size > 20 * 1024 * 1024) { toast.error('File too large. Max 20MB.'); return; }
    setFile(f);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a file.'); return; }
    setLoading(true); setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    try {
      const res = await api.post('/document/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data);
      toast.success('Document analyzed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process document.');
    } finally {
      setLoading(false);
    }
  };

  const sizeKB = file ? (file.size / 1024).toFixed(1) : 0;

  return (
    <Layout>
      <div className="animate-fadeInUp">
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} color="#3b82f6" />
            </div>
            <div>
              <h1 className="section-title">Document AI</h1>
              <p className="section-subtitle">Upload a document and let AI extract key insights for you</p>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              style={{
                border: `2px dashed ${dragOver ? 'rgba(139,92,246,0.6)' : 'var(--border-subtle)'}`,
                borderRadius: 14, padding: 40, textAlign: 'center', cursor: 'pointer',
                background: dragOver ? 'rgba(139,92,246,0.05)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.25s ease'
              }}
            >
              <input ref={fileRef} type="file" accept=".pdf,.txt,.docx,.pptx" style={{ display: 'none' }} onChange={e => onFile(e.target.files[0])} />
              {file ? (
                <div>
                  <FileText size={36} color="#3b82f6" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 15 }}>{file.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{sizeKB} KB · {file.type.split('/')[1]?.toUpperCase()}</div>
                  <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                    style={{ marginTop: 12, background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '5px 14px', cursor: 'pointer', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <X size={12} /> Remove
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 15, marginBottom: 6 }}>Drop your file here or click to browse</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>PDF, TXT, DOCX, PPT · Max 20MB</div>
                </div>
              )}
            </div>

            <div>
              <label className="label"><Globe size={12} style={{ display: 'inline', marginRight: 6 }} />Output Language</label>
              <select className="input-field" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="english">English</option>
                <option value="bangla">বাংলা (Bangla)</option>
              </select>
            </div>

            <button id="doc-submit" type="submit" className="btn-primary" disabled={loading || !file} style={{ alignSelf: 'flex-start', padding: '11px 28px' }}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Analyzing...</> : <><Sparkles size={15} /> Analyze Document</>}
            </button>
          </form>
        </div>

        {result && (
          <div className="animate-fadeIn glass-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>📄 Document Summary</h2>
              <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }}
                onClick={() => { navigator.clipboard.writeText(result.summary); toast.success('Copied!'); }}>
                <Copy size={13} /> Copy
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span className="badge badge-blue">{result.originalName}</span>
              <span className={`badge ${result.language === 'bangla' ? 'badge-pink' : 'badge-violet'}`}>{result.language}</span>
            </div>
            <div className="result-box">{result.summary}</div>
            {result.documentId && (
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                Document ID: <code style={{ color: 'var(--text-secondary)' }}>{result.documentId}</code> — Use this in Chat with Document.
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
