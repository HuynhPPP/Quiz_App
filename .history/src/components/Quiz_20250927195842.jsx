import React, { useState, useEffect } from 'react'
import Resutl from './Resutl'
import Review from './Review'
import QuizSelector from './QuizSelector'
import QuizAPI from '../services/quizAPI'

const Quiz = () => {
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [optionSelected, setOptionSelected] = useState("");
    const [userAnswer, setUserAnswer] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [score, setScore] = useState(0);
    const [showSelector, setShowSelector] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [playerName, setPlayerName] = useState('');

    const handleStartQuiz = async (questions, name = '') => {
        try {
            setLoading(true);
            setError(null);
            
            // Lưu tên người chơi
            setPlayerName(name);
            
            // Nếu questions là string (category), gọi API để lấy câu hỏi
            if (typeof questions === 'string') {
                const apiQuestions = await QuizAPI.getQuestionsByCategory(questions);
                setCurrentQuestions(apiQuestions);
                setUserAnswer(Array.from({ length: apiQuestions.length }));
            } else {
                // Nếu questions là array (random questions)
                setCurrentQuestions(questions);
                setUserAnswer(Array.from({ length: questions.length }));
            }
            
            setShowSelector(false);
            setCurrentQuestion(0);
            setOptionSelected("");
            setIsQuizCompleted(false);
            setIsReviewMode(false);
            setScore(0);
        } catch (err) {
            setError('Không thể tải câu hỏi. Vui lòng thử lại.');
            console.error('Lỗi khi bắt đầu quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = (option, index) => {
        setOptionSelected(option);
        const newUserAnswer = [...userAnswer];
        newUserAnswer[currentQuestion] = index;
        setUserAnswer(newUserAnswer);
    }

    const handleNextQuestion = () => {
        if (currentQuestion === currentQuestions.length - 1) {
            setIsQuizCompleted(true);
        } else {
            setCurrentQuestion((prev) => prev + 1);
        }
    }

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
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
        setError(null);
        setPlayerName('');
    }

    const handleReviewQuiz = () => {
        setIsReviewMode(true);
        setIsQuizCompleted(false);
        setCurrentQuestion(0);
    }

    const handleBackToSelector = () => {
        setShowSelector(true);
        setIsQuizCompleted(false);
        setIsReviewMode(false);
        setCurrentQuestion(0);
        setScore(0);
        setUserAnswer([]);
        setOptionSelected("");
        setCurrentQuestions([]);
        setError(null);
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

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải câu hỏi...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h3>❌ Có lỗi xảy ra</h3>
                <p>{error}</p>
                <button onClick={handleBackToSelector} className="retry-btn">
                    Thử lại
                </button>
            </div>
        );
    }

    if (isReviewMode) {
        return <Review 
            quizData={currentQuestions}
            userAnswers={userAnswer}
            handleBackToResult={handleBackToSelector}
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
            <div className="quiz-header">
                <button 
                    className="back-to-selector-btn"
                    onClick={handleBackToSelector}
                    title="Quay lại chọn chủ đề"
                >
                    ← Quay lại chọn chủ đề
                </button>
                <h2>Câu {currentQuestion + 1}</h2>
            </div>
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