import React from 'react'
import { getAllCategories, getQuestionsByCategory, getRandomQuestions } from '../data/quizData'
import { GAME_MODES } from '../hooks/useGameModes'

const QuizSelector = ({ onStartQuiz }) => {
    const categories = getAllCategories();

    const handleCategorySelect = (category, gameMode = GAME_MODES.CLASSIC) => {
        const questions = getQuestionsByCategory(category);
        onStartQuiz(questions, gameMode);
    };

    const handleRandomQuiz = (gameMode = GAME_MODES.CLASSIC) => {
        const questions = getRandomQuestions(15);
        onStartQuiz(questions, gameMode);
    };

    const handleAllQuestions = (gameMode = GAME_MODES.CLASSIC) => {
        const questions = getRandomQuestions(20);
        onStartQuiz(questions, gameMode);
    };

    return (
        <div>
            <h2>Chọn chủ đề Quiz</h2>
            <p className="quiz-description">
                Chọn một chủ đề để bắt đầu quiz về thủ đô các quốc gia
            </p>
            
            <div className="quiz-categories">
                <button 
                    className="category-button all-questions" 
                    onClick={handleAllQuestions}
                >
                    🌍 Tất cả các quốc gia (20 câu)
                </button>
                
                <button 
                    className="category-button random" 
                    onClick={handleRandomQuiz}
                >
                    🎲 Câu hỏi ngẫu nhiên (15 câu)
                </button>

                {categories.map((category, index) => {
                    const questionCount = getQuestionsByCategory(category).length;
                    const categoryEmojis = {
                        'Europe': '🇪🇺',
                        'East Asia': '🇯🇵',
                        'Southeast Asia': '🇹🇭',
                        'South Asia': '🇮🇳',
                        'Central Asia': '🇰🇿'
                    };
                    
                    return (
                        <button 
                            key={index}
                            className="category-button" 
                            onClick={() => handleCategorySelect(category)}
                        >
                            {categoryEmojis[category] || '🌏'} {category} ({questionCount} câu)
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizSelector;
