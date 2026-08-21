import { useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Sparkles, Globe, ChevronLeft, ChevronRight, RotateCcw, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Flashcards() {
  const handleExtractUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const toastId = toast.loading('Extracting text...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/document/extract', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setText(res.data.text);
      toast.success('Text extracted!', { id: toastId });
    } catch (err) {
      toast.error('Failed to extract text.', { id: toastId });
    }
    e.target.value = null;
  };

  const { user } = useAuth();
  const [text, setText] = useState('');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'english');
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [deckMode, setDeckMode] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (text.trim().length < 50) { toast.error('Please enter at least 50 characters.'); return; }
    setLoading(true); setCards([]);
    try {
      const res = await api.post('/flashcards/generate', { text, language });
      if (Array.isArray(res.data.flashcards)) {
        setCards(res.data.flashcards);
        setCurrentIdx(0); setFlipped(false); setDeckMode(true);
        toast.success(`${res.data.flashcards.length} flashcards created!`);
      } else {
        toast.error('Could not parse flashcards. Try again.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const next = () => { setFlipped(false); setTimeout(() => setCurrentIdx(i => (i + 1) % cards.length), 150); };
  const prev = () => { setFlipped(false); setTimeout(() => setCurrentIdx(i => (i - 1 + cards.length) % cards.length), 150); };
  const restart = () => { setCurrentIdx(0); setFlipped(false); toast('Deck restarted!', { icon: '🔄' }); };

  return (
    <Layout>
      <div className="animate-fadeInUp">
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={22} color="#06b6d4" />
            </div>
            <div>
              <h1 className="section-title">Flashcard Generator</h1>
              <p className="section-subtitle">Create flip-card decks for active recall and memory retention</p>
            </div>
          </div>
        </div>

        {!deckMode ? (
          <div className="glass-card" style={{ padding: 28 }}>
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="label" style={{ marginBottom: 0 }}>Study Content</label>
                <label style={{ cursor: 'pointer', fontSize: 13, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: 6 }}>
                  <Upload size={14} /> Upload File
                  <input type="file" accept=".pdf,.txt,.docx,.pptx" hidden onChange={handleExtractUpload} />
                </label>
              </div>
              <textarea id="flash-content" className="input-field" style={{ minHeight: 200 }}
                  placeholder="Paste your study material here to generate flashcards..."
                  value={text} onChange={e => setText(e.target.value)} required />
              </div>
              <div>
                <label className="label"><Globe size={12} style={{ display: 'inline', marginRight: 5 }} />Language</label>
                <select className="input-field" value={language} onChange={e => setLanguage(e.target.value)}>
                  <option value="english">English</option>
                  <option value="bangla">বাংলা (Bangla)</option>
                </select>
              </div>
              <button id="flash-generate" type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', padding: '11px 28px' }}>
                {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Generating...</> : <><Sparkles size={15} /> Generate Flashcards</>}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-fadeIn">
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span className="badge badge-blue" style={{ fontSize: 13, padding: '5px 14px' }}>
                  Card {currentIdx + 1} of {cards.length}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }} onClick={restart}>
                  <RotateCcw size={14} /> Restart
                </button>
                <button className="btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => setDeckMode(false)}>
                  New Deck
                </button>
              </div>
            </div>

            
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 28 }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                width: `${((currentIdx + 1) / cards.length) * 100}%`,
                transition: 'width 0.4s ease'
              }} />
            </div>

            
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
              <div className={`flashcard-flip-container ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
                <div className="flashcard-inner">
                  <div className="flashcard-front">
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#8b5cf6', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>TERM</div>
                      <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        {cards[currentIdx]?.front}
                      </p>
                    </div>
                  </div>
                  <div className="flashcard-back">
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>ANSWER</div>
                      <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.7 }}>
                        {cards[currentIdx]?.back}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 12 }}>
                👆 Click the card to flip
              </p>

              
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
                <button id="flash-prev" className="btn-ghost" style={{ padding: '10px 20px' }} onClick={prev}>
                  <ChevronLeft size={18} /> Previous
                </button>
                <button id="flash-next" className="btn-primary" style={{ padding: '10px 20px' }} onClick={next}>
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>

            
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>All Cards ({cards.length})</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {cards.map((card, i) => (
                  <div key={i} className="glass-card-hover" style={{ padding: 16, cursor: 'pointer' }}
                    onClick={() => { setCurrentIdx(i); setFlipped(false); window.scrollTo({ top: 200, behavior: 'smooth' }); }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>#{i + 1}</div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: i === currentIdx ? '#a78bfa' : 'var(--text-primary)', marginBottom: 4 }}>{card.front}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.back}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
