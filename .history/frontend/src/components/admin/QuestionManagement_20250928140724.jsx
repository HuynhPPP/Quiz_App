import React, { useState, useEffect } from 'react';
import AdminAPI from '../../services/adminAPI';
import '../../styles/admin.css';

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [formState, setFormState] = useState({
    category: '',
    question: '',
    options: ['', '', '', ''],
    answer: ''
  });
  const [formError, setFormError] = useState('');

  const adminKey = localStorage.getItem('adminKey');

  const fetchQuestions = async (page = currentPage, search = searchQuery, category = selectedCategory) => {
    setLoading(true);
    setError('');
    try {
      const response = await AdminAPI.getQuestions(adminKey, page, 10, category, search);
      setQuestions(response.data?.docs || []);
      setTotalPages(response.data?.totalPages || 1);
      setCurrentPage(response.data?.page || 1);
    } catch (err) {
      setError('Không thể tải câu hỏi. Vui lòng thử lại.');
      console.error('Error fetching questions:', err);
      setQuestions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await AdminAPI.getCategories(adminKey);
      setCategories(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  useEffect(() => {
    if (adminKey) {
      fetchQuestions();
      fetchCategories();
    }
  }, [adminKey]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchQuestions(1, searchQuery, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
    fetchQuestions(1, searchQuery, e.target.value);
  };

  const handleAddQuestion = () => {
    setCurrentQuestion(null);
    setFormState({
      category: selectedCategory || '',
      question: '',
      options: ['', '', '', ''],
      answer: ''
    });
    setFormError('');
    setShowAddEditModal(true);
  };

  const handleEditQuestion = (question) => {
    setCurrentQuestion(question);
    setFormState({
      category: question.category,
      question: question.question,
      options: question.options,
      answer: question.answer
    });
    setFormError('');
    setShowAddEditModal(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    setLoading(true);
    setError('');
    try {
      await AdminAPI.deleteQuestion(adminKey, id);
      fetchQuestions();
    } catch (err) {
      setError('Không thể xóa câu hỏi. Vui lòng thử lại.');
      console.error('Error deleting question:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formState.options];
    newOptions[index] = value;
    setFormState(prevState => ({ ...prevState, options: newOptions }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formState.category || !formState.question || formState.options.some(opt => !opt) || !formState.answer) {
      setFormError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }
    if (!formState.options.includes(formState.answer)) {
      setFormError('Đáp án phải là một trong các lựa chọn.');
      return;
    }

    setLoading(true);
    try {
      if (currentQuestion) {
        await AdminAPI.updateQuestion(adminKey, currentQuestion._id, formState);
      } else {
        await AdminAPI.createQuestion(adminKey, formState);
      }
      setShowAddEditModal(false);
      fetchQuestions();
    } catch (err) {
      setFormError(err.message || 'Lỗi khi lưu câu hỏi. Vui lòng thử lại.');
      console.error('Error saving question:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !questions.length) {
    return <div className="admin-loading">Đang tải câu hỏi...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="question-management">
      <div className="management-header">
        <h2>❓ Quản lý câu hỏi</h2>
        <button onClick={handleAddQuestion} className="add-btn">
          ➕ Thêm câu hỏi
        </button>
      </div>

      <div className="filters-and-search">
        <div className="filter-group">
          <label htmlFor="categoryFilter">Danh mục:</label>
          <select id="categoryFilter" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Tất cả</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.emoji} {cat.name}</option>
            ))}
          </select>
        </div>
        <div className="search-group">
          <label htmlFor="searchQuery">Tìm kiếm:</label>
          <input
            type="text"
            id="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo câu hỏi hoặc đáp án"
          />
          <button onClick={handleSearch} className="search-btn">🔍</button>
        </div>
      </div>

      <div className="question-list">
        {questions && questions.length > 0 ? (
          questions.map(question => (
            <div key={question._id} className="question-card">
              <div className="question-header">
                <span className="category-tag">{question.category}</span>
                <div className="question-actions">
                  <button onClick={() => handleEditQuestion(question)} className="edit-btn">
                    ✏️
                  </button>
                  <button onClick={() => handleDeleteQuestion(question._id)} className="delete-btn">
                    🗑️
                  </button>
                </div>
              </div>
              <p className="question-text">{question.question}</p>
              <div className="options-display">
                {question.options.map((option, index) => (
                  <span
                    key={index}
                    className={`option-item ${option === question.answer ? 'correct' : ''}`}
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">Không tìm thấy câu hỏi nào.</p>
        )}
      </div>

      <div className="pagination">
        <button onClick={() => fetchQuestions(currentPage - 1)} disabled={currentPage === 1}>
          ← Trước
        </button>
        <span>Trang {currentPage} / {totalPages}</span>
        <button onClick={() => fetchQuestions(currentPage + 1)} disabled={currentPage === totalPages}>
          Tiếp →
        </button>
      </div>

      {showAddEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{currentQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Danh mục:</label>
                <select
                  name="category"
                  value={formState.category}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.emoji} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Câu hỏi:</label>
                <textarea
                  name="question"
                  value={formState.question}
                  onChange={handleFormChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Các lựa chọn:</label>
                {formState.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Lựa chọn ${index + 1}`}
                    required
                  />
                ))}
              </div>
              <div className="form-group">
                <label>Đáp án:</label>
                <input
                  type="text"
                  name="answer"
                  value={formState.answer}
                  onChange={handleFormChange}
                  required
                />
              </div>
              {formError && <p className="form-error">{formError}</p>}
              <div className="modal-actions">
                <button type="submit" className="save-btn">Lưu</button>
                <button type="button" onClick={() => setShowAddEditModal(false)} className="cancel-btn">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;