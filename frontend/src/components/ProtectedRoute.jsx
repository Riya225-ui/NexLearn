import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-dark)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px', width: 40, height: 40 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading NexLearn AI...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
