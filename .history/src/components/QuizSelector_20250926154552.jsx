import React from 'react'
import { getAllCategories, getQuestionsByCategory, getRandomQuestions } from '../data/quizData'

const QuizSelector = ({ onStartQuiz }) => {
    const categories = getAllCategories();

    const handleCategorySelect = (category) => {
        const questions = getQuestionsByCategory(category);
        onStartQuiz(questions);
    };

    const handleRandomQuiz = () => {
        const questions = getRandomQuestions(15);
        onStartQuiz(questions);
    };

    const handleAllQuestions = () => {
        const questions = getRandomQuestions(20);
        onStartQuiz(questions);
    };

    return (
        <div>
            <h2>Chọn chủ đề Quiz</h2>
            <p className="quiz-description">
                Chọn một chủ đề và chế độ chơi để bắt đầu quiz về thủ đô các quốc gia
            </p>
            
            {/* Game Modes Section */}
            <div className="game-modes-section">
                <h3>🎮 Chế độ chơi</h3>
                <div className="game-modes">
                    {Object.values(GAME_MODES).map((mode, index) => (
                        <div key={index} className="game-mode-card">
                            <div className="mode-icon">{mode.icon}</div>
                            <div className="mode-info">
                                <h4>{mode.name}</h4>
                                <p>{mode.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quiz Categories Section */}
            <div className="quiz-categories-section">
                <h3>🌍 Chủ đề Quiz</h3>
                <div className="quiz-categories">
                    <button 
                        className="category-button all-questions" 
                        onClick={() => handleAllQuestions()}
                    >
                        🌍 Tất cả các quốc gia (20 câu)
                    </button>
                    
                    <button 
                        className="category-button random" 
                        onClick={() => handleRandomQuiz()}
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

            {/* Game Mode Quick Start */}
            <div className="quick-start-section">
                <h3>⚡ Bắt đầu nhanh</h3>
                <div className="quick-start-buttons">
                    <button 
                        className="quick-start-btn time-attack"
                        onClick={() => handleRandomQuiz(GAME_MODES.TIME_ATTACK)}
                    >
                        ⏰ Time Attack (15 câu)
                    </button>
                    <button 
                        className="quick-start-btn blitz"
                        onClick={() => handleRandomQuiz(GAME_MODES.BLITZ)}
                    >
                        ⚡ Blitz Mode (15 câu)
                    </button>
                    <button 
                        className="quick-start-btn survival"
                        onClick={() => handleRandomQuiz(GAME_MODES.SURVIVAL)}
                    >
                        💀 Survival Mode
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizSelector;
