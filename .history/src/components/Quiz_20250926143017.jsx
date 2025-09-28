import React from 'react'

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
  return (
    <div>
        {quizData.map((question, index) => (
            <div key={index}>
                <h2>{question.question}</h2>
                {question.options.map((option, index) => (
                    <div key={index}>{option}</div>
                ))}
            </div>
        ))}
    </div>
  )
}

export default Quiz