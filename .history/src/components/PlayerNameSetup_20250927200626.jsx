import React, { useState } from 'react';
import QuizAPI from '../services/quizAPI';

const PlayerNameSetup = ({ onNameSet, onSkip }) => {
  const [playerName, setPlayerName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  const [nameExists, setNameExists] = useState(false);
  const [existingPlayerStats, setExistingPlayerStats] = useState(null);

  // Danh sách tên random với timestamp để tránh trùng lặp
  const generateRandomName = () => {
    const baseNames = [
      'Người chơi bí ẩn', 'Chiến binh Quiz', 'Thí sinh xuất sắc', 
      'Bậc thầy trí tuệ', 'Người chơi thông minh', 'Quiz Master',
      'Thí sinh tài năng', 'Người chơi giỏi giang', 'Trí tuệ vượt trội',
      'Quiz Champion', 'Thí sinh xuất chúng', 'Người chơi tài ba'
    ];
    
    const randomIndex = Math.floor(Math.random() * baseNames.length);
    const baseName = baseNames[randomIndex];
    const timestamp = Date.now().toString().slice(-4); // Lấy 4 số cuối của timestamp
    const randomName = `${baseName}_${timestamp}`;
    
    setPlayerName(randomName);
    setError('');
    setNameExists(false);
    setExistingPlayerStats(null);
  };

  const checkNameExists = async (name) => {
    try {
      const stats = await QuizAPI.getPlayerStats(name);
      return stats;
    } catch (error) {
      // Nếu không tìm thấy người chơi, trả về null
      return null;
    }
  };

  const handleNameChange = async (e) => {
    const name = e.target.value.trim();
    setPlayerName(name);
    setError('');
    setNameExists(false);
    setExistingPlayerStats(null);

    // Kiểm tra tên trùng lặp sau 1 giây delay
    if (name.length > 0) {
      setTimeout(async () => {
        setIsChecking(true);
        try {
          const stats = await checkNameExists(name);
          if (stats) {
            setNameExists(true);
            setExistingPlayerStats(stats);
          }
        } catch (error) {
          console.error('Lỗi khi kiểm tra tên:', error);
        } finally {
          setIsChecking(false);
        }
      }, 1000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Vui lòng nhập tên hoặc chọn tên ngẫu nhiên');
      return;
    }

    if (playerName.trim().length < 2) {
      setError('Tên phải có ít nhất 2 ký tự');
      return;
    }

    if (playerName.trim().length > 50) {
      setError('Tên không được quá 50 ký tự');
      return;
    }

    onNameSet(playerName.trim());
  };

  const handleSkip = () => {
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    onNameSet(randomName);
  };

  return (
    <div className="player-name-setup">
      <div className="name-setup-container">
        <h2>🎮 Thiết lập người chơi</h2>
        <p className="setup-description">
          Nhập tên của bạn để bắt đầu quiz và theo dõi điểm số. 
          Bạn có thể bỏ qua để sử dụng tên ngẫu nhiên.
        </p>

        <form onSubmit={handleSubmit} className="name-form">
          <div className="input-group">
            <label htmlFor="playerName">Tên người chơi:</label>
            <div className="input-container">
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={handleNameChange}
                placeholder="Nhập tên của bạn..."
                maxLength={50}
                className={`name-input ${nameExists ? 'name-exists' : ''}`}
                disabled={isChecking}
              />
              {isChecking && (
                <div className="checking-indicator">
                  <div className="spinner"></div>
                </div>
              )}
            </div>
            
            {nameExists && existingPlayerStats && (
              <div className="name-exists-warning">
                <div className="warning-icon">⚠️</div>
                <div className="warning-content">
                  <p><strong>Tên "{playerName}" đã tồn tại!</strong></p>
                  <div className="existing-stats">
                    <p>📊 Thống kê người chơi này:</p>
                    <ul>
                      <li>Tổng số lần chơi: {existingPlayerStats.statistics.totalGames}</li>
                      <li>Điểm cao nhất: {existingPlayerStats.statistics.highestScore}</li>
                      <li>Điểm trung bình: {existingPlayerStats.statistics.averageScore}</li>
                      <li>Lần chơi gần nhất: {existingPlayerStats.statistics.latestScore} điểm</li>
                    </ul>
                    <p className="suggestion">
                      💡 Bạn có thể thêm số hoặc ký tự để phân biệt (ví dụ: "{playerName}2", "{playerName}_2024")
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button
              type="button"
              onClick={generateRandomName}
              className="random-name-btn"
            >
              🎲 Tên ngẫu nhiên
            </button>
            
            <button
              type="submit"
              className="confirm-name-btn"
              disabled={!playerName.trim() || isChecking}
            >
              ✅ Xác nhận
            </button>
          </div>

          <div className="skip-section">
            <p className="skip-text">Hoặc</p>
            <button
              type="button"
              onClick={handleSkip}
              className="skip-btn"
            >
              ⏭️ Bỏ qua và chơi ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerNameSetup;
