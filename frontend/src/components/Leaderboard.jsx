import React, { useState, useEffect } from 'react';
import QuizAPI from '../services/quizAPI';

const Leaderboard = ({ limit = 10 }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, [limit]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await QuizAPI.getLeaderboard(limit);
      setLeaderboard(data);
    } catch (err) {
      setError('Không thể tải bảng xếp hạng');
      console.error('Lỗi khi tải leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankClass = (rank) => {
    switch (rank) {
      case 1: return 'rank-first';
      case 2: return 'rank-second';
      case 3: return 'rank-third';
      default: return 'rank-normal';
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <h3>🏆 Bảng xếp hạng</h3>
        <div className="leaderboard-loading">
          <div className="loading-spinner-small"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <h3>🏆 Bảng xếp hạng</h3>
        <div className="leaderboard-error">
          <p>❌ {error}</p>
          <button onClick={loadLeaderboard} className="retry-btn-small">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h3>🏆 Bảng xếp hạng</h3>
        <button onClick={loadLeaderboard} className="refresh-btn-small" title="Làm mới">
          🔄
        </button>
      </div>
      
      {leaderboard.length === 0 ? (
        <div className="leaderboard-empty">
          <p>📊 Chưa có điểm nào</p>
          <p className="empty-subtitle">Hãy là người đầu tiên!</p>
        </div>
      ) : (
        <div className="leaderboard-list">
          {leaderboard.map((entry, index) => (
            <div 
              key={entry._id} 
              className={`leaderboard-item ${getRankClass(index + 1)}`}
            >
              <div className="rank-info">
                <span className="rank-icon">{getRankIcon(index + 1)}</span>
                <span className="rank-number">{index + 1}</span>
              </div>
              <div className="player-info">
                <span className="player-name">{entry.name}</span>
                <span className="player-date">
                  {new Date(entry.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="score-info">
                <span className="player-score">{entry.points}</span>
                <span className="score-label">điểm</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="leaderboard-footer">
        <p className="leaderboard-note">
          💡 Top {limit} người chơi xuất sắc nhất
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
