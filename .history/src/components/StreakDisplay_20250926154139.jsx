import React from 'react';

const StreakDisplay = ({ currentStreak, bestStreak, totalCorrect }) => {
    const getStreakEmoji = (streak) => {
        if (streak === 0) return '🔥';
        if (streak < 5) return '🔥';
        if (streak < 10) return '🔥🔥';
        if (streak < 20) return '🔥🔥🔥';
        return '🔥🔥🔥🔥';
    };

    const getStreakMessage = (streak) => {
        if (streak === 0) return 'Bắt đầu streak của bạn!';
        if (streak < 5) return 'Tuyệt vời!';
        if (streak < 10) return 'Xuất sắc!';
        if (streak < 20) return 'Thần thánh!';
        return 'LEGENDARY!';
    };

    return (
        <div className="streak-container">
            <div className="streak-main">
                <div className="streak-fire">
                    {getStreakEmoji(currentStreak)}
                </div>
                <div className="streak-info">
                    <div className="streak-number">{currentStreak}</div>
                    <div className="streak-message">{getStreakMessage(currentStreak)}</div>
                </div>
            </div>
            
            <div className="streak-stats">
                <div className="stat-item">
                    <span className="stat-label">Tốt nhất:</span>
                    <span className="stat-value">{bestStreak}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Đúng:</span>
                    <span className="stat-value">{totalCorrect}</span>
                </div>
            </div>
        </div>
    );
};

export default StreakDisplay;
