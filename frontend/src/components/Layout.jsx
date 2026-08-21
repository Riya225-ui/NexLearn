import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Sidebar />
      <main className="page-with-sidebar" style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
