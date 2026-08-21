import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Settings, X, CheckCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const MODES = {
  focus:       { label: 'Focus',       duration: 25 * 60, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  short_break: { label: 'Short Break', duration:  5 * 60, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  long_break:  { label: 'Long Break',  duration: 15 * 60, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
};

export default function Pomodoro() {
  const [mode, setMode]               = useState('focus');
  const [timeLeft, setTimeLeft]       = useState(MODES.focus.duration);
  const [running, setRunning]         = useState(false);
  const [sessions, setSessions]       = useState(0);
  const [completed, setCompleted]     = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [customMins, setCustomMins]   = useState({ focus: 25, short_break: 5, long_break: 15 });
  const intervalRef = useRef(null);
  const current = MODES[mode];

  // Apply custom durations
  const getDuration = (m) => customMins[m] * 60;

  const reset = useCallback((m = mode) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(getDuration(m));
  }, [mode, customMins]);

  const switchMode = (m) => {
    setMode(m);
    clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(getDuration(m));
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === 'focus') {
              setSessions(s => s + 1);
              setCompleted(c => [...c, { label: `Focus Session #${sessions + 1}`, time: new Date().toLocaleTimeString() }]);
            }
            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('NexLearn AI', {
                body: mode === 'focus' ? '✅ Focus session complete! Time for a break.' : '🎯 Break over! Back to studying.',
                icon: '/favicon.ico',
              });
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const requestNotification = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const totalDuration = getDuration(mode);
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <Sidebar />
      <main className="page-with-sidebar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 32px' }}>

        {/* Header */}
        <div style={{ width: '100%', maxWidth: 700, marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="section-title">🍅 Pomodoro Timer</h1>
              <p className="section-subtitle">Stay focused with the Pomodoro technique</p>
            </div>
            <button
              className="btn-ghost"
              style={{ padding: '8px 14px', fontSize: 13 }}
              onClick={() => { setShowSettings(true); requestNotification(); }}
            >
              <Settings size={15} /> Settings
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 40,
          background: 'rgba(0,0,0,0.05)', borderRadius: 12, padding: 6,
        }}>
          {Object.entries(MODES).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              style={{
                padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                background: mode === key ? current.color : 'transparent',
                color: mode === key ? 'white' : 'var(--text-secondary)',
                boxShadow: mode === key ? `0 4px 12px ${current.color}44` : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Circular Timer */}
        <div style={{ position: 'relative', marginBottom: 40 }}>
          <svg width={260} height={260} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={130} cy={130} r={110} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={10} />
            <circle
              cx={130} cy={130} r={110} fill="none"
              stroke={current.color}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              fontSize: 56, fontWeight: 800, fontFamily: 'Space Grotesk',
              color: current.color, lineHeight: 1, letterSpacing: '-2px',
            }}>
              {mins}:{secs}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
              {current.label}
            </div>
            {sessions > 0 && (
              <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                {[...Array(Math.min(sessions, 4))].map((_, i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6' }} />
                ))}
                {sessions > 4 && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{sessions - 4}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
          <button
            className="btn-ghost"
            style={{ padding: '12px 20px' }}
            onClick={() => reset()}
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setRunning(r => !r)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 44px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${current.color}, ${current.color}99)`,
              color: 'white', fontSize: 17, fontWeight: 700,
              boxShadow: running ? 'none' : `0 8px 24px ${current.color}44`,
              transition: 'all 0.2s',
            }}
          >
            {running ? <Pause size={22} /> : <Play size={22} />}
            {running ? 'Pause' : 'Start'}
          </button>
          <button
            className="btn-ghost"
            style={{ padding: '12px 20px' }}
            onClick={() => switchMode(mode === 'focus' ? 'short_break' : 'focus')}
          >
            {mode === 'focus' ? <Coffee size={18} /> : <BookOpen size={18} />}
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
          width: '100%', maxWidth: 520, marginBottom: 40,
        }}>
          {[
            { label: 'Sessions Today', value: sessions, color: '#8b5cf6' },
            { label: 'Focus Time',     value: `${sessions * (customMins.focus || 25)}m`, color: '#10b981' },
            { label: 'Breaks Taken',   value: Math.max(0, sessions - 1), color: '#3b82f6' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-card" style={{ padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: 'Space Grotesk' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Completed Sessions */}
        {completed.length > 0 && (
          <div style={{ width: '100%', maxWidth: 520 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>
              Completed Sessions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...completed].reverse().slice(0, 5).map(({ label, time }, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', borderRadius: 10,
                  background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle size={15} color="#10b981" />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
          }}>
            <div className="glass-card" style={{ padding: 32, width: 360, borderRadius: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Timer Settings</h3>
                <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>
              {[
                { key: 'focus',       label: 'Focus Duration (minutes)' },
                { key: 'short_break', label: 'Short Break (minutes)' },
                { key: 'long_break',  label: 'Long Break (minutes)' },
              ].map(({ key, label }) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label className="label">{label}</label>
                  <input
                    className="input-field"
                    type="number"
                    min="1"
                    max="90"
                    value={customMins[key]}
                    onChange={e => setCustomMins(m => ({ ...m, [key]: Math.max(1, parseInt(e.target.value) || 1) }))}
                  />
                </div>
              ))}
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                onClick={() => { setShowSettings(false); reset(mode); }}
              >
                Apply Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
