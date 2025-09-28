import React, { useState, useEffect } from 'react';
import AdminAPI from '../../services/adminAPI';
import QuestionManagement from './QuestionManagement';
import PlayerManagement from './PlayerManagement';
import AdminStats from './AdminStats';
import CategoryManagement from './CategoryManagement';
import '../../styles/admin.css';

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

  const handleBackToHome = () => {
    // Chuyển về trang chủ quiz
    window.location.href = '/';
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
        <h1>Trang quản trị</h1>
        <div className="admin-actions">
          <button onClick={handleBackToHome} className="home-btn">
            🏠 Về trang chủ
          </button>
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
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          📂 Danh mục
        </button>
        <button
          className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          ❓ Câu hỏi
        </button>
        <button
          className={`tab-btn ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          👥 Người chơi
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'stats' && <AdminStats />}
        {activeTab === 'categories' && <CategoryManagement />}
        {activeTab === 'questions' && <QuestionManagement />}
        {activeTab === 'players' && <PlayerManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
