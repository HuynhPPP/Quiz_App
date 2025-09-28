import React from 'react';

const Timer = ({ timeLeft, timeLimit, isActive, gameMode }) => {
    const percentage = timeLimit ? (timeLeft / timeLimit) * 100 : 100;
    
    const getTimerColor = () => {
        if (!timeLimit) return '#42a5f5';
        if (percentage > 50) return '#4caf50';
        if (percentage > 25) return '#ff9800';
        return '#f44336';
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : secs.toString();
    };

    return (
        <div className="timer-container">
            <div className="timer-header">
                <span className="game-mode-icon">{gameMode.icon}</span>
                <span className="game-mode-name">{gameMode.name}</span>
            </div>
            
            {timeLimit && (
                <div className="timer-display">
                    <div className="timer-circle">
                        <svg className="timer-svg" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#e0e0e0"
                                strokeWidth="8"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke={getTimerColor()}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                                className={`timer-progress ${isActive ? 'active' : 'paused'}`}
                            />
                        </svg>
                        <div className="timer-text">
                            <span className="time-number">{formatTime(timeLeft)}</span>
                            <span className="time-label">giây</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Timer;
