import React from 'react';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
    return (
        <div className="theme-toggle">
            <button 
                className={`theme-toggle-btn ${isDarkMode ? 'dark' : 'light'}`}
                onClick={toggleTheme}
                title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
        </div>
    );
};

export default ThemeToggle;
