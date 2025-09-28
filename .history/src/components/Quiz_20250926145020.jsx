import React, { useState } from 'react'

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

    const handleSelectOption = (option, index) => {
        setOptionSelected(option);
        const newUserAnswer = [...userAnswer];
        newUserAnswer[currentQuestion] = index;
        setUserAnswer(newUserAnswer);
    }

    const handleNextQuestion = () => {
        setCurrentQuestion(currentQuestion + 1);
    }

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    }

    return (
        <div>
            <h2>Câu {currentQuestion + 1}</h2>
            <p className='question'>{quizData[currentQuestion].question}</p>

            {quizData[currentQuestion].options.map((option, index) => (
                <button
                    key={index}
                    className='option'
                    onClick={() => handleSelectOption(option, index)}
                >
                    {option}
                </button>
            ))}

            {
                optionSelected === quizData[currentQuestion].answer && (
                    <p className='correct-answer'>Câu trả lời của bạn là chính xác</p>
                )}
            {
                optionSelected !== quizData[currentQuestion].answer && (
                    <p className='incorrect-answer'>Câu trả lời của bạn chưa chính xác</p>
                )
            }


            <div className='nav-buttons'>
                <button onClick={handlePreviousQuestion}>Trước</button>
                <button onClick={handleNextQuestion}>Tiếp</button>
            </div>
        </div>
    );
};

export default Quiz