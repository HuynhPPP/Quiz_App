import React, { useState } from 'react'

const Review = ({ quizData, userAnswers, handleBackToResult, handleRestartQuiz }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const handleNextQuestion = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const getUserAnswer = () => {
        const answerIndex = userAnswers[currentQuestion];
        return answerIndex !== undefined ? quizData[currentQuestion].options[answerIndex] : null;
    };

    const isCorrect = () => {
        const userAnswer = getUserAnswer();
        return userAnswer === quizData[currentQuestion].answer;
    };

    return (
        <div>
            <h2>Xem lại câu trả lời</h2>
            <div className="review-question">
                <h3>Câu {currentQuestion + 1}</h3>
                <p className='question'>{quizData[currentQuestion].question}</p>
                
                <div className="review-options">
                    {quizData[currentQuestion].options.map((option, index) => {
                        const isUserAnswer = userAnswers[currentQuestion] === index;
                        const isCorrectAnswer = option === quizData[currentQuestion].answer;
                        
                        let className = 'option';
                        if (isUserAnswer && isCorrectAnswer) {
                            className += ' correct-user-answer';
                        } else if (isUserAnswer && !isCorrectAnswer) {
                            className += ' incorrect-user-answer';
                        } else if (isCorrectAnswer) {
                            className += ' correct-answer';
                        }
                        
                        return (
                            <div key={index} className={className}>
                                {option}
                                {isUserAnswer && <span className="answer-label"> (Câu trả lời của bạn)</span>}
                                {isCorrectAnswer && !isUserAnswer && <span className="answer-label"> (Đáp án đúng)</span>}
                            </div>
                        );
                    })}
                </div>
                
                <div className="answer-status">
                    {getUserAnswer() ? (
                        isCorrect() ? (
                            <p className='correct-answer'>✅ Câu trả lời của bạn là chính xác</p>
                        ) : (
                            <p className='incorrect-answer'>❌ Câu trả lời của bạn chưa chính xác. Đáp án đúng là: {quizData[currentQuestion].answer}</p>
                        )
                    ) : (
                        <p className='no-answer'>⚠️ Bạn chưa trả lời câu này</p>
                    )}
                </div>
            </div>

            <div className='nav-buttons'>
                <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                >
                    Trước
                </button>
                <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestion === quizData.length - 1}
                >
                    Tiếp
                </button>
            </div>

            <div className='review-buttons'>
                <button className='result-button' onClick={handleBackToResult}>
                    Quay lại kết quả
                </button>
                <button className='result-button' onClick={handleRestartQuiz}>
                    Làm lại quiz
                </button>
            </div>
        </div>
    );
};

export default Review;
