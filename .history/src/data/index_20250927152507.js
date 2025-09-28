// Combined quiz data from all sources
import { capitalsData } from './capitalsData.js';
import { itVocabularyData } from './itVocabularyData.js';
import { footballData } from './footballData.js';

// Combine all quiz data
export const quizData = [
    ...capitalsData,
    ...itVocabularyData,
    ...footballData
];

// Function to get questions by category
export const getQuestionsByCategory = (category) => {
    return quizData.filter(question => question.category === category);
};

// Function to get all categories
export const getAllCategories = () => {
    const categories = [...new Set(quizData.map(question => question.category))];
    return categories;
};

// Function to get random questions
export const getRandomQuestions = (count = 10) => {
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Export individual data sources for specific use cases
export { capitalsData, itVocabularyData };
