import React, { useState, useEffect } from 'react'
import Resutl from './Resutl'
import Review from './Review'

const quizData = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        answer: "Paris"
    },
    {
        question: "What is the capital of Germany?",
        options: ["Berlin", "London", "Madrid", "Paris"],
        answer: "Berlin"
    },
    {
        question: "What is the capital of Italy?",
        options: ["Rome", "London", "Madrid", "Paris"],
        answer: "Rome"
    },
    {
        question: "What is the capital of Spain?",
        options: ["Madrid", "London", "Paris", "Rome"],
        answer: "Madrid"
    },
    {
        question: "What is the capital of Portugal?",
        options: ["Lisbon", "London", "Madrid", "Paris"],
        answer: "Lisbon"
    },

]

const Quiz = () => {
    const [optionSelected, setOptionSelected] = useState("");
    const [userAnswer, setUserAnswer] = useState(
        Array.from({ length: quizData.length })
    );
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
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
        setCurrentQuestion(0);
        setScore(0);
        setUserAnswer(Array.from({ length: quizData.length }));
        setOptionSelected("");
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
    }, [optionSelected]);

    if (isQuizCompleted) {
        return <Resutl 
            score={score}
            totalQuestions={quizData.length}
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