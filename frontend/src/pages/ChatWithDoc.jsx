import { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/useStream';
import { api } from '../context/AuthContext';
import { MessageSquare, Send, Bot, User, Trash2, Globe, Square, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export default function ChatWithDoc() {
  const handleExtractUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const toastId = toast.loading('Extracting text...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/document/extract', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setDocumentText(res.data.text);
      toast.success('Text extracted!', { id: toastId });
    } catch (err) {
      toast.error('Failed to extract text.', { id: toastId });
    }
    e.target.value = null;
  };

  const { user } = useAuth();
  const [documentText, setDocumentText] = useState('');
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'english');
  const [messages, setMessages] = useState([]);
  const [sessionId] = useState(uuidv4());
  const [docReady, setDocReady] = useState(false);
  const messagesEndRef = useRef(null);

  const { streamText, isStreaming, startStream, abortStream, setStreamText } = useStream();

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streamText]);

  const startChat = () => {
    if (documentText.trim().length < 50) { toast.error('Please paste at least 50 characters of document text.'); return; }
    setDocReady(true);
    setMessages([{ role: 'assistant', content: '👋 Hello! I\'ve read your document. Ask me anything about it!' }]);
    toast.success('Document loaded. Start chatting!');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!question.trim() || isStreaming) return;

    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setStreamText('');


    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }]);

    await startStream('/chat/stream', {
      question: userMsg.content,
      documentText,
      sessionId,
      language,
    }, {
      onChunk: (accumulated) => {

        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx]?.streaming) {
            updated[lastIdx] = { role: 'assistant', content: accumulated, streaming: true };
          }
          return updated;
        });
      },
      onDone: (fullText) => {

        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx]?.streaming) {
            updated[lastIdx] = { role: 'assistant', content: fullText, streaming: false };
          }
          return updated;
        });
      },
      onError: (msg) => {
        toast.error(msg || 'Chat failed.');
        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx]?.streaming) {
            updated[lastIdx] = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', streaming: false };
          }
          return updated;
        });
      },
    });
  };

  const clearChat = () => {
    setMessages([]);
    setDocReady(false);
    setDocumentText('');
    toast.success('Chat cleared.');
  };

  return (
    <Layout>
      <div className="animate-fadeInUp" style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={22} color="#f59e0b" />
            </div>
            <div>
              <h1 className="section-title">Chat with Document</h1>
              <p className="section-subtitle">Ask questions directly from your document</p>
            </div>
          </div>
        </div>

        {!docReady ? (
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Step 1: Paste or Upload document</h3>
              <label style={{ cursor: 'pointer', fontSize: 13, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: 6 }}>
                <Upload size={14} /> Upload File
                <input type="file" accept=".pdf,.txt,.docx,.pptx" hidden onChange={handleExtractUpload} />
              </label>
            </div>
            <textarea
              id="chat-doc-text"
              className="input-field"
              style={{ minHeight: 200, marginBottom: 16 }}
              placeholder="Paste the text of your document, lecture notes, or any study material here..."
              value={documentText}
              onChange={e => setDocumentText(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label className="label"><Globe size={12} style={{ display: 'inline', marginRight: 5 }} />Language</label>
                <select className="input-field" value={language} onChange={e => setLanguage(e.target.value)}>
                  <option value="english">English</option>
                  <option value="bangla">বাংলা (Bangla)</option>
                </select>
              </div>
              <button id="chat-start" className="btn-primary" style={{ marginTop: 20, padding: '11px 28px' }} onClick={startChat}>
                <MessageSquare size={15} /> Start Chatting
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
            
            <div className="glass-card" style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', animation: 'fadeInUp 0.3s ease' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'rgba(245,158,11,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2
                  }}>
                    {msg.role === 'user' ? <User size={15} color="white" /> : <Bot size={15} color="#f59e0b" />}
                  </div>
                  <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ maxWidth: '80%', whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                    {msg.streaming && <span className="streaming-cursor">▋</span>}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: 10 }}>
              <input
                id="chat-question-input"
                type="text"
                className="input-field"
                style={{ flex: 1 }}
                placeholder="Ask a question about your document..."
                value={question}
                onChange={e => setQuestion(e.target.value)}
                disabled={isStreaming}
              />
              <button id="chat-send" type="submit" className="btn-primary" style={{ padding: '11px 18px' }} disabled={isStreaming || !question.trim()}>
                <Send size={16} />
              </button>
              {isStreaming && (
                <button type="button" className="btn-ghost" style={{ padding: '11px 14px' }} onClick={abortStream}>
                  <Square size={16} />
                </button>
              )}
              <button type="button" className="btn-ghost" style={{ padding: '11px 14px' }} onClick={clearChat}>
                <Trash2 size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
