import React, { useState, useEffect } from 'react'
import QuizAPI from '../services/quizAPI'

const QuizSelector = ({ onStartQuiz }) => {
    const [categories, setCategories] = useState([]);
    const [questionCount, setQuestionCount] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const apiCategories = await QuizAPI.getCategories();
            setCategories(apiCategories);
        } catch (err) {
            setError('Không thể tải danh mục. Vui lòng thử lại.');
            console.error('Lỗi khi tải danh mục:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = async (category) => {
        try {
            await onStartQuiz(category);
        } catch (err) {
            console.error('Lỗi khi chọn danh mục:', err);
        }
    };

    const handleRandomQuiz = async () => {
        try {
            const questions = await QuizAPI.getRandomQuestions(questionCount);
            await onStartQuiz(questions);
        } catch (err) {
            console.error('Lỗi khi tạo quiz ngẫu nhiên:', err);
        }
    };

    const handleAllQuestions = async () => {
        try {
            const questions = await QuizAPI.getRandomQuestions(Math.min(questionCount, 30));
            await onStartQuiz(questions);
        } catch (err) {
            console.error('Lỗi khi tạo quiz tất cả:', err);
        }
    };

    const handleQuestionCountChange = (count) => {
        setQuestionCount(count);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải danh mục...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h3>❌ Có lỗi xảy ra</h3>
                <p>{error}</p>
                <button onClick={loadCategories} className="retry-btn">
                    Thử lại
                </button>
            </div>
        );
    }

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
                    const categoryEmojis = {
                        'Europe': '🇪🇺',
                        'Asia': '🇯🇵',
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
                            {categoryEmojis[category] || '🌏'} {category}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizSelector;