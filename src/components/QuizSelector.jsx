import React from 'react'
import { getAllCategories, getQuestionsByCategory, getRandomQuestions } from '../data/index'

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
                Chọn một chủ đề để bắt đầu quiz về thủ đô các quốc gia hoặc học tiếng Anh chuyên ngành
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
                        'Central Asia': '🇰🇿',
                        'Học tiếng Anh chuyên ngành': '📚'
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
