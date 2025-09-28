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
        Array.from({ length: quizData.length }, () => null)
    );

    const handleSelectOption = (option) => {
        setOptionSelected(option);
    }

    return (
        <div>
            <h2>Câu 1</h2>
            <p className='question'>{quizData[0].question}</p>

            {quizData[0].options.map((option, index) => (
                <button
                    key={index}
                    className='option'
                    onClick={() => handleSelectOption(option)}
                >
                    {option}
                </button>
            ))}

            {
                optionSelected === quizData[0].answer && (
                    <p className='correct-answer'>Câu trả lời của bạn: {optionSelected} là chính xác</p>
                )}
            {
                optionSelected !== quizData[0].answer && (
                    <p className='incorrect-answer'>Câu trả lời của bạn: {optionSelected} chưa chính xác</p>
                )
            }

            <p>Câu trả lời của bạn: {optionSelected}</p>

            <div className='nav-buttons'>
                <button>Trước</button>
                <button>Tiếp</button>
            </div>
        </div>
    );
};

export default Quiz