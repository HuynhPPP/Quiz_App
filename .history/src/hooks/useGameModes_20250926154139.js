import { useState, useEffect, useCallback } from 'react';

// Custom hook for timer functionality
export const useTimer = (initialTime, onTimeUp) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            onTimeUp();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onTimeUp]);

    const startTimer = useCallback(() => {
        setIsActive(true);
    }, []);

    const pauseTimer = useCallback(() => {
        setIsActive(false);
    }, []);

    const resetTimer = useCallback((newTime = initialTime) => {
        setTimeLeft(newTime);
        setIsActive(false);
    }, [initialTime]);

    const addTime = useCallback((seconds) => {
        setTimeLeft(prev => prev + seconds);
    }, []);

    return {
        timeLeft,
        isActive,
        startTimer,
        pauseTimer,
        resetTimer,
        addTime
    };
};

// Custom hook for streak management
export const useStreak = () => {
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);

    const addCorrectAnswer = useCallback(() => {
        setCurrentStreak(prev => {
            const newStreak = prev + 1;
            if (newStreak > bestStreak) {
                setBestStreak(newStreak);
            }
            return newStreak;
        });
        setTotalCorrect(prev => prev + 1);
    }, [bestStreak]);

    const resetStreak = useCallback(() => {
        setCurrentStreak(0);
    }, []);

    const resetAll = useCallback(() => {
        setCurrentStreak(0);
        setBestStreak(0);
        setTotalCorrect(0);
    }, []);

    return {
        currentStreak,
        bestStreak,
        totalCorrect,
        addCorrectAnswer,
        resetStreak,
        resetAll
    };
};

// Game modes configuration
export const GAME_MODES = {
    CLASSIC: {
        name: 'Classic',
        description: 'Chế độ cổ điển không giới hạn thời gian',
        timeLimit: null,
        icon: '📚'
    },
    TIME_ATTACK: {
        name: 'Time Attack',
        description: '15 giây cho mỗi câu hỏi',
        timeLimit: 15,
        icon: '⏰'
    },
    BLITZ: {
        name: 'Blitz',
        description: '10 giây cho mỗi câu hỏi - Thử thách tốc độ',
        timeLimit: 10,
        icon: '⚡'
    },
    SURVIVAL: {
        name: 'Survival',
        description: 'Chơi đến khi trả lời sai',
        timeLimit: 20,
        icon: '💀'
    }
};
