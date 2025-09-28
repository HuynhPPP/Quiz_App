import React, { useState } from 'react'
import { getAllCategories, getQuestionsByCategory, getRandomQuestions } from '../data/index'

const QuizSelector = ({ onStartQuiz }) => {
    const categories = getAllCategories();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [questionCount, setQuestionCount] = useState(10);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        const questions = getQuestionsByCategory(category);
        const limitedQuestions = questions.slice(0, Math.min(questionCount, questions.length));
        onStartQuiz(limitedQuestions);
    };

    const handleRandomQuiz = () => {
        const questions = getRandomQuestions(questionCount);
        onStartQuiz(questions);
    };

    const handleAllQuestions = () => {
        const questions = getRandomQuestions(Math.min(questionCount, 30));
        onStartQuiz(questions);
    };

    const handleQuestionCountChange = (count) => {
        setQuestionCount(count);
    };

    return (
        <div>
            <h2>Chọn chủ đề Quiz</h2>
            <p className="quiz-description">
                Chọn một chủ đề để bắt đầu quiz về thủ đô các quốc gia, học tiếng Anh chuyên ngành hoặc bóng đá
            </p>
            
            {/* Question Count Selector */}
            <div className="question-count-selector">
                <h3>Số lượng câu hỏi</h3>
                <div className="count-options">
                    {[5, 10, 15, 20, 25, 30].map(count => (
                        <button
                            key={count}
                            className={`count-option ${questionCount === count ? 'selected' : ''}`}
                            onClick={() => handleQuestionCountChange(count)}
                        >
                            {count} câu
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="quiz-categories">
                <button 
                    className="category-button all-questions" 
                    onClick={handleAllQuestions}
                >
                    🌍 Tất cả các chủ đề ({Math.min(questionCount, 30)} câu)
                </button>
                
                <button 
                    className="category-button random" 
                    onClick={handleRandomQuiz}
                >
                    🎲 Câu hỏi ngẫu nhiên ({questionCount} câu)
                </button>

                {categories.map((category, index) => {
                    const totalQuestions = getQuestionsByCategory(category).length;
                    const displayCount = Math.min(questionCount, totalQuestions);
                    const categoryEmojis = {
                        'Europe': '🇪🇺',
                        'East Asia': '🇯🇵',
                        'Southeast Asia': '🇹🇭',
                        'South Asia': '🇮🇳',
                        'Central Asia': '🇰🇿',
                        'Học tiếng Anh chuyên ngành': '📚',
                        'Bóng đá': '⚽'
                    };
                    
                    return (
                        <button 
                            key={index}
                            className="category-button" 
                            onClick={() => handleCategorySelect(category)}
                        >
                            {categoryEmojis[category] || '🌏'} {category} ({displayCount}/{totalQuestions} câu)
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizSelector;
