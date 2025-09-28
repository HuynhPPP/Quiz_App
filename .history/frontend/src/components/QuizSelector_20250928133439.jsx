import React, { useState, useEffect } from 'react'
import QuizAPI from '../services/quizAPI'
import PlayerNameSetup from './PlayerNameSetup'
import Leaderboard from './Leaderboard'

const QuizSelector = ({ onStartQuiz }) => {
    const [categories, setCategories] = useState([]);
    const [questionCount, setQuestionCount] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNameSetup, setShowNameSetup] = useState(false);
    const [selectedQuizType, setSelectedQuizType] = useState(null);
    const [playerName, setPlayerName] = useState('');

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

    const handleQuizSelection = (quizType, quizData) => {
        setSelectedQuizType({ type: quizType, data: quizData });
        setShowNameSetup(true);
    };

    const handleCategorySelect = (category) => {
        handleQuizSelection('category', category);
    };

    const handleRandomQuiz = () => {
        handleQuizSelection('random', questionCount);
    };

    const handleAllQuestions = () => {
        handleQuizSelection('all', Math.min(questionCount, 30));
    };

    const handleNameSet = (name) => {
        setPlayerName(name);
        setShowNameSetup(false);
        
        // Bắt đầu quiz với tên đã chọn
        startQuizWithName(name);
    };

    const startQuizWithName = async (name) => {
        try {
            let questions;
            
            switch (selectedQuizType.type) {
                case 'category':
                    questions = await QuizAPI.getQuestionsByCategory(selectedQuizType.data);
                    break;
                case 'random':
                    questions = await QuizAPI.getRandomQuestions(selectedQuizType.data);
                    break;
                case 'all':
                    questions = await QuizAPI.getRandomQuestions(selectedQuizType.data);
                    break;
                default:
                    throw new Error('Loại quiz không hợp lệ');
            }
            
            // Truyền cả questions và playerName cho Quiz component
            await onStartQuiz(questions, name);
        } catch (err) {
            console.error('Lỗi khi bắt đầu quiz:', err);
            setError('Không thể tải câu hỏi. Vui lòng thử lại.');
        }
    };

    const handleQuestionCountChange = (count) => {
        setQuestionCount(count);
    };

    const handleBackToSelector = () => {
        setShowNameSetup(false);
        setSelectedQuizType(null);
        setPlayerName('');
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

    if (showNameSetup) {
        return (
            <div>
                <div className="quiz-selection-info">
                    <h3>📋 Thông tin quiz đã chọn:</h3>
                    <div className="selection-details">
                        {selectedQuizType.type === 'category' && (
                            <p>🎯 <strong>Chủ đề:</strong> {selectedQuizType.data}</p>
                        )}
                        {selectedQuizType.type === 'random' && (
                            <p>🎲 <strong>Loại:</strong> Câu hỏi ngẫu nhiên ({selectedQuizType.data} câu)</p>
                        )}
                        {selectedQuizType.type === 'all' && (
                            <p>🌍 <strong>Loại:</strong> Tất cả chủ đề ({selectedQuizType.data} câu)</p>
                        )}
                    </div>
                    <button onClick={handleBackToSelector} className="back-btn">
                        ← Quay lại chọn quiz
                    </button>
                </div>
                
                <PlayerNameSetup 
                    onNameSet={handleNameSet}
                    onSkip={() => handleNameSet('')}
                />
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