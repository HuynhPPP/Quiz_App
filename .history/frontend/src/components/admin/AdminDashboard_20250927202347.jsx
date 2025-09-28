import React, { useState, useEffect } from 'react';
import AdminAPI from '../services/adminAPI';
import QuestionManagement from './admin/QuestionManagement';
import PlayerManagement from './admin/PlayerManagement';
import AdminStats from './admin/AdminStats';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra xem đã đăng nhập admin chưa
    const savedKey = localStorage.getItem('adminKey');
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setError('Vui lòng nhập Admin Key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Test admin key bằng cách gọi API stats
      await AdminAPI.getStats(adminKey);
      setIsAuthenticated(true);
      localStorage.setItem('adminKey', adminKey);
    } catch (error) {
      setError('Admin Key không hợp lệ');
      console.error('Lỗi đăng nhập admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    localStorage.removeItem('adminKey');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h1>🔐 Admin Login</h1>
          <p className="login-description">
            Nhập Admin Key để truy cập bảng điều khiển quản trị
          </p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="adminKey">Admin Key:</label>
              <input
                id="adminKey"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Nhập Admin Key..."
                disabled={loading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              disabled={loading || !adminKey.trim()}
              className="login-btn"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🎛️ Admin Dashboard</h1>
        <div className="admin-actions">
          <span className="admin-status">✅ Đã đăng nhập</span>
          <button onClick={handleLogout} className="logout-btn">
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Thống kê
        </button>
        <button 
          className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          ❓ Quản lý câu hỏi
        </button>
        <button 
          className={`tab-btn ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          👥 Quản lý người chơi
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'stats' && <AdminStats />}
        {activeTab === 'questions' && <QuestionManagement />}
        {activeTab === 'players' && <PlayerManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
