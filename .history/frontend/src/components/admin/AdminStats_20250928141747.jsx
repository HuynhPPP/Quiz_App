import React, { useState, useEffect } from 'react';
import AdminAPI from '../../services/adminAPI';
import '../../styles/admin.css';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const adminKey = localStorage.getItem('adminKey');
      const data = await AdminAPI.getStats(adminKey);
      setStats(data);
    } catch (err) {
      setError('Không thể tải thống kê');
      console.error('Lỗi khi tải thống kê:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải thống kê...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>❌ Có lỗi xảy ra</h3>
        <p>{error}</p>
        <button onClick={loadStats} className="retry-btn">
          Thử lại
        </button>
      </div>
    );
  }

  if (!stats) {
    return <div>Không có dữ liệu thống kê</div>;
  }

  // Safe destructuring with fallbacks
  const overview = stats.overview || {};
  const recentActivity = stats.recentActivity || [];
  const categoryDistribution = stats.categoryDistribution || [];
  const dailyActivity = stats.dailyActivity || [];

  return (
    <div className="admin-stats">
      <div className="stats-header">
        <h2>Thống kê tổng quan</h2>
        <button onClick={loadStats} className="refresh-btn">
          🔄 Làm mới
        </button>
      </div>

      {/* Overview Cards */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">❓</div>
          <div className="stat-content">
            <h3>{overview.totalQuestions || 0}</h3>
            <p>Tổng câu hỏi</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{overview.totalPlayers || 0}</h3>
            <p>Người chơi</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-content">
            <h3>{overview.totalGames || 0}</h3>
            <p>Lượt chơi</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{overview.averageScore || 0}</h3>
            <p>Điểm TB</p>
          </div>
        </div>
      </div>

      {/* Top Player */}
      {overview.topPlayer && (
        <div className="top-player-card">
          <h3>🏆 Người chơi xuất sắc nhất</h3>
          <div className="top-player-info">
            <div className="player-name">{overview.topPlayer.name}</div>
            <div className="player-score">{overview.topPlayer.points} điểm</div>
            <div className="player-date">
              {new Date(overview.topPlayer.date).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      )}

      {/* Category Distribution */}
      <div className="category-stats">
        <h3>📚 Phân bố theo danh mục</h3>
        <div className="category-list">
          {categoryDistribution.map((category, index) => (
            <div key={index} className="category-item">
              <span className="category-name">{category._id}</span>
              <span className="category-count">{category.count} câu</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>🕒 Hoạt động gần đây</h3>
        <div className="activity-list">
          {recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-player">{activity.name}</div>
              <div className="activity-score">{activity.points} điểm</div>
              <div className="activity-date">
                {new Date(activity.createdAt).toLocaleString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="daily-activity">
        <h3>📅 Hoạt động theo ngày (30 ngày gần nhất)</h3>
        <div className="daily-chart">
          {dailyActivity.slice(0, 7).map((day, index) => (
            <div key={index} className="daily-bar">
              <div className="bar-label">
                {day._id.day}/{day._id.month}
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ 
                    height: `${(day.games / Math.max(...dailyActivity.map(d => d.games))) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="bar-value">{day.games}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
