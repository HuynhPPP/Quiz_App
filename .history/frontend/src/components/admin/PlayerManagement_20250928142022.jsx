import React, { useState, useEffect } from 'react';
import AdminAPI from '../../services/adminAPI';
import '../../styles/admin.css';

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  
  // Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerDetails, setPlayerDetails] = useState(null);

  useEffect(() => {
    loadPlayers();
  }, [currentPage, searchTerm]);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      setError('');
      const adminKey = localStorage.getItem('adminKey');
      const data = await AdminAPI.getPlayers(adminKey, currentPage, 10, searchTerm);
      console.log('Players response:', data); // Debug log
      
      // Handle different response structures
      if (data.success && data.data) {
        setPlayers(data.data || []);
        setPagination(data.pagination || {});
      } else {
        // Fallback for direct array response
        setPlayers(Array.isArray(data) ? data : []);
        setPagination({});
      }
    } catch (err) {
      setError(`Không thể tải danh sách người chơi: ${err.message}`);
      console.error('Lỗi khi tải người chơi:', err);
      setPlayers([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const handleViewPlayer = async (playerName) => {
    try {
      const adminKey = localStorage.getItem('adminKey');
      const data = await AdminAPI.getPlayer(adminKey, playerName);
      setPlayerDetails(data);
      setSelectedPlayer(playerName);
      setShowPlayerModal(true);
    } catch (err) {
      alert('Không thể tải thông tin người chơi');
      console.error('Lỗi khi tải thông tin người chơi:', err);
    }
  };

  const handleDeletePlayer = async (playerName) => {
    if (!confirm(`Bạn có chắc muốn xóa tất cả điểm của "${playerName}"?`)) {
      return;
    }

    try {
      const adminKey = localStorage.getItem('adminKey');
      await AdminAPI.deletePlayer(adminKey, playerName);
      loadPlayers();
      alert('Đã xóa thành công');
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa người chơi');
      console.error('Lỗi khi xóa người chơi:', err);
    }
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: '#27ae60' };
    if (score >= 80) return { grade: 'A', color: '#2ecc71' };
    if (score >= 70) return { grade: 'B', color: '#f39c12' };
    if (score >= 60) return { grade: 'C', color: '#e67e22' };
    return { grade: 'D', color: '#e74c3c' };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách người chơi...</p>
      </div>
    );
  }

  return (
    <div className="player-management">
      <div className="management-header">
        <h2>👥 Quản lý người chơi</h2>
        <button onClick={loadPlayers} className="refresh-btn">
          🔄 Làm mới
        </button>
      </div>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Tìm kiếm theo tên người chơi..."
          className="search-input"
        />
      </div>

      {/* Players List */}
      <div className="players-list">
        {players.map(player => {
          const latestGrade = getScoreGrade(player.latestScore);
          return (
            <div key={player._id} className="player-card">
              <div className="player-header">
                <div className="player-name">{player._id}</div>
                <div className="player-grade" style={{ color: latestGrade.color }}>
                  {latestGrade.grade}
                </div>
              </div>
              
              <div className="player-stats">
                <div className="stat-item">
                  <span className="stat-label">Lượt chơi:</span>
                  <span className="stat-value">{player.totalGames}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Điểm cao nhất:</span>
                  <span className="stat-value">{player.highestScore}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Điểm TB:</span>
                  <span className="stat-value">{player.averageScore.toFixed(1)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Lần cuối:</span>
                  <span className="stat-value">
                    {new Date(player.latestPlayed).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
              
              <div className="player-actions">
                <button 
                  onClick={() => handleViewPlayer(player._id)}
                  className="view-btn"
                >
                  👁️ Xem chi tiết
                </button>
                <button 
                  onClick={() => handleDeletePlayer(player._id)}
                  className="delete-btn"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Trước
          </button>
          
          <span>
            Trang {pagination.currentPage} / {pagination.totalPages}
          </span>
          
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
          >
            Sau →
          </button>
        </div>
      )}

      {/* Player Details Modal */}
      {showPlayerModal && playerDetails && (
        <div className="modal-overlay">
          <div className="modal player-modal">
            <div className="modal-header">
              <h3>👤 Chi tiết người chơi: {selectedPlayer}</h3>
              <button onClick={() => setShowPlayerModal(false)} className="close-btn">
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="player-summary">
                <div className="summary-card">
                  <h4>Tổng lượt chơi</h4>
                  <div className="summary-value">{playerDetails.stats.totalGames}</div>
                </div>
                <div className="summary-card">
                  <h4>Điểm cao nhất</h4>
                  <div className="summary-value">{playerDetails.stats.highestScore}</div>
                </div>
                <div className="summary-card">
                  <h4>Điểm trung bình</h4>
                  <div className="summary-value">{playerDetails.stats.averageScore.toFixed(1)}</div>
                </div>
                <div className="summary-card">
                  <h4>Lần chơi gần nhất</h4>
                  <div className="summary-value">{playerDetails.stats.latestScore}</div>
                </div>
              </div>

              <div className="player-timeline">
                <h4>📈 Lịch sử điểm số (50 lần gần nhất)</h4>
                <div className="timeline-list">
                  {playerDetails.recentScores.map((score, index) => {
                    const grade = getScoreGrade(score.points);
                    return (
                      <div key={index} className="timeline-item">
                        <div className="timeline-date">
                          {new Date(score.createdAt).toLocaleString('vi-VN')}
                        </div>
                        <div className="timeline-score" style={{ color: grade.color }}>
                          {score.points} điểm ({grade.grade})
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button onClick={() => setShowPlayerModal(false)} className="close-modal-btn">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerManagement;
