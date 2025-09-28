import React, { useState } from 'react'
import QuizAPI from '../services/quizAPI'

const Resutl = ({score, totalQuestions, playerName, handleReviewQuiz, handleResetQuiz}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const percentage = Math.round((score / totalQuestions) * 100);

  const handleSubmitScore = async () => {
    if (!playerName.trim()) {
      setSubmitError('Không có tên người chơi để lưu điểm');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      await QuizAPI.saveScore(playerName.trim(), score);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError('Không thể lưu điểm. Vui lòng thử lại.');
      console.error('Lỗi khi lưu điểm:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowLeaderboard = async () => {
    try {
      const data = await QuizAPI.getLeaderboard(10);
      setLeaderboard(data);
      setShowLeaderboard(true);
    } catch (error) {
      console.error('Lỗi khi lấy leaderboard:', error);
    }
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return 'Xuất sắc! 🌟';
    if (percentage >= 80) return 'Rất tốt! 👏';
    if (percentage >= 70) return 'Tốt! 👍';
    if (percentage >= 60) return 'Khá! 😊';
    return 'Cần cố gắng thêm! 💪';
  };

  return (
    <div>
        <h2>Kết quả Quiz</h2>
        <div className="result-summary">
          <p className='result'>Bạn đã trả lời đúng {score}/{totalQuestions} câu ({percentage}%)</p>
          <p className="score-message">{getScoreMessage()}</p>
          {playerName && (
            <div className="player-result-info">
              <p className="player-name-display">👤 <strong>{playerName}</strong></p>
            </div>
          )}
        </div>

        {/* Score Submission */}
        {playerName && !submitSuccess && (
          <div className="score-submission">
            <h3>Lưu điểm của bạn</h3>
            <div className="submit-section">
              <p className="submit-info">
                Điểm của bạn sẽ được lưu với tên: <strong>{playerName}</strong>
              </p>
              <button 
                onClick={handleSubmitScore}
                disabled={isSubmitting}
                className="submit-score-btn"
              >
                {isSubmitting ? 'Đang lưu...' : '💾 Lưu điểm'}
              </button>
            </div>
            {submitError && <p className="error-message">{submitError}</p>}
          </div>
        )}

        {!playerName && (
          <div className="no-name-notice">
            <p>ℹ️ Bạn đã chơi với tên ngẫu nhiên. Điểm sẽ không được lưu.</p>
            <p>Để lưu điểm, hãy chơi lại và đặt tên của bạn.</p>
          </div>
        )}

        {submitSuccess && (
          <div className="success-message">
            <p>✅ Điểm đã được lưu thành công!</p>
          </div>
        )}

        {/* Leaderboard */}
        <div className="leaderboard-section">
          <button 
            className="leaderboard-btn" 
            onClick={handleShowLeaderboard}
          >
            🏆 Xem bảng xếp hạng
          </button>
          
          {showLeaderboard && (
            <div className="leaderboard">
              <h3>Bảng xếp hạng Top 10</h3>
              {leaderboard.length > 0 ? (
                <div className="leaderboard-list">
                  {leaderboard.map((player, index) => (
                    <div key={player._id} className="leaderboard-item">
                      <span className="rank">#{player.rank}</span>
                      <span className="name">{player.name}</span>
                      <span className="points">{player.points} điểm</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Chưa có dữ liệu xếp hạng</p>
              )}
            </div>
          )}
        </div>

        <div className='resultButtonsContainer'>
            <button className='result-button' onClick={handleReviewQuiz}>Xem lại</button>
            <button className='result-button' onClick={handleResetQuiz}>Làm lại</button>
        </div>
    </div>
  )
}

export default Resutl