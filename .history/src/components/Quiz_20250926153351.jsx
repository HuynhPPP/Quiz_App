import React, { useState, useEffect } from 'react'
import Resutl from './Resutl'
import Review from './Review'
import QuizSelector from './QuizSelector'
import { quizData } from '../data/quizData'

const Quiz = () => {
    const [optionSelected, setOptionSelected] = useState("");
    const [userAnswer, setUserAnswer] = useState(
        Array.from({ length: quizData.length })
    );
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [score, setScore] = useState(0);

    const handleSelectOption = (option, index) => {
        setOptionSelected(option);
        const newUserAnswer = [...userAnswer];
        newUserAnswer[currentQuestion] = index;
        setUserAnswer(newUserAnswer);
    }

    const handleNextQuestion = () => {
        if (currentQuestion === quizData.length - 1) {
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
        setIsQuizCompleted(false);
        setIsReviewMode(false);
        setCurrentQuestion(0);
        setScore(0);
        setUserAnswer(Array.from({ length: quizData.length }));
        setOptionSelected("");
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

    useEffect(() => {
        const answer = Number(userAnswer[currentQuestion]);
        const pastOptionSelected = quizData[currentQuestion].options[answer];
        if (answer !== undefined) {
            setOptionSelected(pastOptionSelected);
        } else {
            setOptionSelected("");
        }
    }, [currentQuestion, userAnswer]);

    useEffect(() => {
        if (optionSelected === quizData[currentQuestion].answer) {
            setScore((prev) => prev + 1);
        }
    }, [optionSelected, currentQuestion]);

    if (isReviewMode) {
        return <Review 
            quizData={quizData}
            userAnswers={userAnswer}
            handleBackToResult={handleBackToResult}
            handleRestartQuiz={handleResetQuiz}
        />
    }

    if (isQuizCompleted) {
        return <Resutl 
            score={score}
            totalQuestions={quizData.length}
            handleReviewQuiz={handleReviewQuiz}
            handleResetQuiz={handleResetQuiz}
        />
    }

    return (
        <div>
            <h2>Câu {currentQuestion + 1}</h2>
            <p className='question'>{quizData[currentQuestion].question}</p>

            {quizData[currentQuestion].options.map((option, index) => (
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
                    optionSelected === quizData[currentQuestion].answer ? (
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
                    {currentQuestion === quizData.length - 1 ? "Hoàn thành Quiz" : "Tiếp"}
                </button>
            </div>
        </div>
    );
};

export default Quiz