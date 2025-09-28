import { useState } from 'react';
import Quiz from "./components/Quiz";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminDemo from "./components/AdminDemo";

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    setIsDemoMode(false);
  };

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
    setIsAdminMode(false);
  };

  if (isAdminMode) {
    return <AdminDashboard />;
  }

  if (isDemoMode) {
    return <AdminDemo />;
  }

  return (
    <div className="container">
      <div className="app-header">
        <h1>Quiz Vui</h1>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={toggleAdminMode}
            className="admin-toggle-btn"
            title="Chuyển sang chế độ Admin"
          >
            🎛️ Admin
          </button>
          <button
            onClick={toggleDemoMode}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
            title="Xem demo giao diện Admin"
          >
            🎨 Demo UI
          </button>
        </div>
      </div>
      <Quiz />
    </div>
  );
}

export default App;
