import React, { useState, useEffect } from 'react'
import Resutl from './Resutl'
import Review from './Review'
import QuizSelector from './QuizSelector'
import Timer from './Timer'
import StreakDisplay from './StreakDisplay'
import ThemeToggle from './ThemeToggle'
import { useTimer, useStreak, GAME_MODES } from '../hooks/useGameModes'

const Quiz = () => {
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [optionSelected, setOptionSelected] = useState("");
    const [userAnswer, setUserAnswer] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [score, setScore] = useState(0);
    const [showSelector, setShowSelector] = useState(true);
    const [currentGameMode, setCurrentGameMode] = useState(GAME_MODES.CLASSIC);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize timer and streak hooks
    const timer = useTimer(currentGameMode.timeLimit || 30, handleTimeUp);
    const streak = useStreak();

    const handleTimeUp = () => {
        if (currentGameMode.name === 'Survival') {
            // In survival mode, time up means game over
            setIsQuizCompleted(true);
        } else {
            // In other modes, move to next question
            handleNextQuestion();
        }
    };

    const handleStartQuiz = (questions, gameMode = GAME_MODES.CLASSIC) => {
        setCurrentQuestions(questions);
        setUserAnswer(Array.from({ length: questions.length }));
        setShowSelector(false);
        setCurrentQuestion(0);
        setOptionSelected("");
        setIsQuizCompleted(false);
        setIsReviewMode(false);
        setScore(0);
        setCurrentGameMode(gameMode);
        
        // Reset timer for new game mode
        timer.resetTimer(gameMode.timeLimit || 30);
        
        // Start timer if game mode has time limit
        if (gameMode.timeLimit) {
            timer.startTimer();
        }
    };

    const handleSelectOption = (option, index) => {
        setOptionSelected(option);
        const newUserAnswer = [...userAnswer];
        newUserAnswer[currentQuestion] = index;
        setUserAnswer(newUserAnswer);
        
        // Check if answer is correct and update streak
        if (option === currentQuestions[currentQuestion].answer) {
            streak.addCorrectAnswer();
        } else {
            streak.resetStreak();
        }
    }

    const handleNextQuestion = () => {
        if (currentQuestion === currentQuestions.length - 1) {
            setIsQuizCompleted(true);
            timer.pauseTimer();
        } else {
            setCurrentQuestion((prev) => prev + 1);
            
            // Reset timer for next question if in timed mode
            if (currentGameMode.timeLimit) {
                timer.resetTimer(currentGameMode.timeLimit);
                timer.startTimer();
            }
        }
    }

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
            
            // Reset timer for previous question if in timed mode
            if (currentGameMode.timeLimit) {
                timer.resetTimer(currentGameMode.timeLimit);
                timer.startTimer();
            }
        }
    }

    const handleResetQuiz = () => {
        setShowSelector(true);
        setIsQuizCompleted(false);
        setIsReviewMode(false);
        setCurrentQuestion(0);
        setScore(0);
        setUserAnswer([]);
        setOptionSelected("");
        setCurrentQuestions([]);
        setCurrentGameMode(GAME_MODES.CLASSIC);
        timer.pauseTimer();
        streak.resetAll();
    }

    const handleReviewQuiz = () => {
        setIsReviewMode(true);
        setIsQuizCompleted(false);
        setCurrentQuestion(0);
    }

    const handleBackToResult = () => {
        setIsReviewMode(false);
        setIsQuizCompleted(true);
    }

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    }

    useEffect(() => {
        if (currentQuestions.length > 0) {
            const answer = Number(userAnswer[currentQuestion]);
            const pastOptionSelected = currentQuestions[currentQuestion].options[answer];
            if (answer !== undefined) {
                setOptionSelected(pastOptionSelected);
            } else {
                setOptionSelected("");
            }
        }
    }, [currentQuestion, userAnswer, currentQuestions]);

    useEffect(() => {
        if (currentQuestions.length > 0 && optionSelected === currentQuestions[currentQuestion].answer) {
            setScore((prev) => prev + 1);
        }
    }, [optionSelected, currentQuestion, currentQuestions]);

    if (isReviewMode) {
        return <Review 
            quizData={currentQuestions}
            userAnswers={userAnswer}
            handleBackToResult={handleBackToResult}
            handleRestartQuiz={handleResetQuiz}
        />
    }

    if (isQuizCompleted) {
        return <Resutl 
            score={score}
            totalQuestions={currentQuestions.length}
            handleReviewQuiz={handleReviewQuiz}
            handleResetQuiz={handleResetQuiz}
        />
    }

    if (showSelector) {
        return <QuizSelector onStartQuiz={handleStartQuiz} />
    }

    if (currentQuestions.length === 0) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h2>Câu {currentQuestion + 1}</h2>
            <p className='question'>{currentQuestions[currentQuestion].question}</p>

            {currentQuestions[currentQuestion].options.map((option, index) => (
                <button
                    key={index}
                    className={`option ${optionSelected === option ? 'selected' : ''}`}
                    disabled={!!optionSelected && optionSelected !== option}
                    onClick={() => handleSelectOption(option, index)}
                >
                    {option}
                </button>
            ))}

            {
                optionSelected ? (
                    optionSelected === currentQuestions[currentQuestion].answer ? (
                        <p className='correct-answer'>Câu trả lời của bạn là chính xác</p>
                    ) : (
                        <p className='incorrect-answer'>Câu trả lời của bạn chưa chính xác</p>
                    )
                ) : ""
            }


            <div className='nav-buttons'>
                <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                >
                    Trước
                </button>
                <button
                    onClick={handleNextQuestion}
                    disabled={!optionSelected}
                >
                    {currentQuestion === currentQuestions.length - 1 ? "Hoàn thành Quiz" : "Tiếp"}
                </button>
            </div>
        </div>
    );
};

export default Quiz