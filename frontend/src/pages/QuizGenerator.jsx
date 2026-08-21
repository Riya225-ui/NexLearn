import { useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, Sparkles, Globe, CheckCircle, XCircle, ChevronRight, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuizGenerator() {
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
  const [questionCount, setQuestionCount] = useState(10);
  const [language, setLanguage] = useState(user?.preferredLanguage || 'english');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizMode, setQuizMode] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (text.trim().length < 50) { toast.error('Please enter at least 50 characters.'); return; }
    setLoading(true); setQuestions([]); setAnswers({}); setSubmitted(false); setQuizMode(false);
    try {
      const res = await api.post('/quiz/generate', { text, questionCount, language });
      if (Array.isArray(res.data.questions)) {
        setQuestions(res.data.questions);
        setQuizMode(true);
        toast.success(`${res.data.questions.length} questions generated!`);
      } else {
        toast.error('Could not parse quiz. Try again.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Quiz generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx, value) => {
    if (!submitted) setAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i]?.toLowerCase().trim() === q.answer?.toLowerCase().trim()) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    toast.success(`Quiz submitted! Score: ${correct}/${questions.length}`);
  };

  const resetQuiz = () => {
    setAnswers({}); setSubmitted(false); setScore(0);
    toast('Quiz reset. Try again!', { icon: '🔄' });
  };

  return (
    <Layout>
      <div className="animate-fadeInUp">
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(236,72,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={22} color="#ec4899" />
            </div>
            <div>
              <h1 className="section-title">Quiz Generator</h1>
              <p className="section-subtitle">Auto-create MCQs, True/False, and Short Answer questions</p>
            </div>
          </div>
        </div>

        {!quizMode ? (
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
              <textarea id="quiz-content" className="input-field" style={{ minHeight: 200 }}
                  placeholder="Paste lecture notes, document text, or any study content here..."
                  value={text} onChange={e => setText(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="label">Number of Questions</label>
                  <select id="quiz-count" className="input-field" value={questionCount} onChange={e => setQuestionCount(Number(e.target.value))}>
                    {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} Questions</option>)}
                  </select>
                </div>
                <div>
                  <label className="label"><Globe size={12} style={{ display: 'inline', marginRight: 5 }} />Language</label>
                  <select className="input-field" value={language} onChange={e => setLanguage(e.target.value)}>
                    <option value="english">English</option>
                    <option value="bangla">বাংলা (Bangla)</option>
                  </select>
                </div>
              </div>
              <button id="quiz-generate" type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', padding: '11px 28px' }}>
                {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Generating Quiz...</> : <><Sparkles size={15} /> Generate Quiz</>}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-fadeIn">
            
            {submitted && (
              <div style={{
                padding: '16px 24px', borderRadius: 12, marginBottom: 20,
                background: score >= questions.length * 0.7 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                border: `1px solid ${score >= questions.length * 0.7 ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>
                    {score >= questions.length * 0.7 ? '🎉 Great job!' : '📚 Keep studying!'}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    You scored <strong>{score}/{questions.length}</strong> ({Math.round(score / questions.length * 100)}%)
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-ghost" style={{ padding: '8px 16px' }} onClick={resetQuiz}>Try Again</button>
                  <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={() => setQuizMode(false)}>New Quiz</button>
                </div>
              </div>
            )}

            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {questions.map((q, i) => (
                <div key={i} className="glass-card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, background: 'rgba(236,72,153,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#ec4899' }}>{i + 1}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span className={`badge ${q.type === 'mcq' ? 'badge-pink' : q.type === 'truefalse' ? 'badge-blue' : 'badge-violet'}`}>
                          {q.type === 'mcq' ? 'MCQ' : q.type === 'truefalse' ? 'True/False' : 'Short Answer'}
                        </span>
                        {submitted && (
                          answers[i]?.toLowerCase().trim() === q.answer?.toLowerCase().trim()
                            ? <span style={{ color: '#4ade80', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={14} /> Correct</span>
                            : <span style={{ color: '#f87171', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><XCircle size={14} /> Incorrect</span>
                        )}
                      </div>
                      <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 15, margin: 0 }}>{q.question}</p>
                    </div>
                  </div>

                  
                  {q.type === 'mcq' && q.options && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 40 }}>
                      {q.options.map((opt, j) => {
                        const isSelected = answers[i] === opt;
                        const isCorrect = submitted && opt.toLowerCase().trim() === q.answer?.toLowerCase().trim();
                        const isWrong = submitted && isSelected && !isCorrect;
                        return (
                          <button key={j} type="button" onClick={() => handleAnswer(i, opt)}
                            style={{
                              padding: '10px 14px', borderRadius: 10, textAlign: 'left', cursor: submitted ? 'default' : 'pointer',
                              background: isCorrect && submitted ? 'rgba(16,185,129,0.2)' : isWrong ? 'rgba(239,68,68,0.15)' : isSelected ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${isCorrect && submitted ? 'rgba(16,185,129,0.5)' : isWrong ? 'rgba(239,68,68,0.4)' : isSelected ? 'rgba(139,92,246,0.4)' : 'var(--border-subtle)'}`,
                              color: isCorrect && submitted ? '#4ade80' : isWrong ? '#f87171' : 'var(--text-primary)',
                              fontSize: 14, transition: 'all 0.2s ease',
                            }}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'truefalse' && (
                    <div style={{ display: 'flex', gap: 8, paddingLeft: 40 }}>
                      {['True', 'False'].map(opt => {
                        const isSelected = answers[i] === opt;
                        const isCorrect = submitted && opt.toLowerCase() === q.answer?.toLowerCase();
                        const isWrong = submitted && isSelected && !isCorrect;
                        return (
                          <button key={opt} type="button" onClick={() => handleAnswer(i, opt)}
                            style={{
                              padding: '10px 24px', borderRadius: 10, cursor: submitted ? 'default' : 'pointer',
                              background: isCorrect && submitted ? 'rgba(16,185,129,0.2)' : isWrong ? 'rgba(239,68,68,0.15)' : isSelected ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${isCorrect && submitted ? 'rgba(16,185,129,0.5)' : isWrong ? 'rgba(239,68,68,0.4)' : isSelected ? 'rgba(59,130,246,0.4)' : 'var(--border-subtle)'}`,
                              color: isCorrect && submitted ? '#4ade80' : isWrong ? '#f87171' : 'var(--text-primary)',
                              fontWeight: 600, fontSize: 14, transition: 'all 0.2s ease',
                            }}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'short' && (
                    <div style={{ paddingLeft: 40 }}>
                      <input type="text" className="input-field" placeholder="Type your answer..." value={answers[i] || ''}
                        onChange={e => handleAnswer(i, e.target.value)} disabled={submitted} />
                    </div>
                  )}

                  
                  {submitted && q.explanation && (
                    <div style={{ marginTop: 12, paddingLeft: 40 }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>
                        💡 <strong style={{ color: 'var(--text-primary)' }}>Explanation: </strong>{q.explanation}
                        {q.type !== 'mcq' && <div style={{ marginTop: 4 }}>✅ <strong>Answer: </strong>{q.answer}</div>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!submitted && questions.length > 0 && (
              <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <button id="quiz-submit" className="btn-primary" style={{ padding: '12px 32px' }} onClick={handleSubmitQuiz}>
                  <ChevronRight size={16} /> Submit Quiz
                </button>
                <button className="btn-ghost" style={{ padding: '12px 20px' }} onClick={() => setQuizMode(false)}>
                  Start Over
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
