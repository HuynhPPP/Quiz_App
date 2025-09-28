import React, { useState, useEffect } from 'react';
import AdminAPI from '../../services/adminAPI';

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  
  // Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    question: '',
    options: ['', '', '', ''],
    answer: ''
  });

  useEffect(() => {
    loadQuestions();
    loadCategories();
  }, [currentPage, selectedCategory, searchTerm]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      const adminKey = localStorage.getItem('adminKey');
      const data = await AdminAPI.getQuestions(adminKey, currentPage, 10, selectedCategory, searchTerm);
      setQuestions(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError('Không thể tải danh sách câu hỏi');
      console.error('Lỗi khi tải câu hỏi:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const adminKey = localStorage.getItem('adminKey');
      const data = await AdminAPI.getCategories(adminKey);
      setCategories(data);
    } catch (err) {
      console.error('Lỗi khi tải danh mục:', err);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      category: '',
      question: '',
      options: ['', '', '', ''],
      answer: ''
    });
    setShowModal(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setFormData({
      category: question.category,
      question: question.question,
      options: [...question.options],
      answer: question.answer
    });
    setShowModal(true);
  };

  const handleSaveQuestion = async () => {
    try {
      const adminKey = localStorage.getItem('adminKey');
      
      // Validation
      if (!formData.category.trim() || !formData.question.trim()) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const validOptions = formData.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        alert('Cần ít nhất 2 lựa chọn');
        return;
      }

      if (!validOptions.includes(formData.answer)) {
        alert('Đáp án phải nằm trong danh sách lựa chọn');
        return;
      }

      const questionData = {
        category: formData.category.trim(),
        question: formData.question.trim(),
        options: validOptions.map(opt => opt.trim()),
        answer: formData.answer.trim()
      };

      if (editingQuestion) {
        await AdminAPI.updateQuestion(adminKey, editingQuestion._id, questionData);
      } else {
        await AdminAPI.createQuestion(adminKey, questionData);
      }

      setShowModal(false);
      loadQuestions();
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu câu hỏi');
      console.error('Lỗi khi lưu câu hỏi:', err);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      return;
    }

    try {
      const adminKey = localStorage.getItem('adminKey');
      await AdminAPI.deleteQuestion(adminKey, questionId);
      loadQuestions();
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa câu hỏi');
      console.error('Lỗi khi xóa câu hỏi:', err);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({
        ...formData,
        options: [...formData.options, '']
      });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải câu hỏi...</p>
      </div>
    );
  }

  return (
    <div className="question-management">
      <div className="management-header">
        <h2>❓ Quản lý câu hỏi</h2>
        <button onClick={handleAddQuestion} className="add-btn">
          ➕ Thêm câu hỏi
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Danh mục:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Tất cả</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Tìm kiếm:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm theo câu hỏi hoặc đáp án..."
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="questions-list">
        {questions.map(question => (
          <div key={question._id} className="question-card">
            <div className="question-header">
              <span className="question-category">{question.category}</span>
              <div className="question-actions">
                <button 
                  onClick={() => handleEditQuestion(question)}
                  className="edit-btn"
                >
                  ✏️ Sửa
                </button>
                <button 
                  onClick={() => handleDeleteQuestion(question._id)}
                  className="delete-btn"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
            
            <div className="question-content">
              <p className="question-text">{question.question}</p>
              <div className="question-options">
                {question.options.map((option, index) => (
                  <div 
                    key={index} 
                    className={`option ${option === question.answer ? 'correct' : ''}`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="question-meta">
              <span>Tạo: {new Date(question.createdAt).toLocaleDateString('vi-VN')}</span>
              <span>Cập nhật: {new Date(question.updatedAt).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Trước
          </button>
          
          <span>
            Trang {pagination.currentPage} / {pagination.totalPages}
          </span>
          
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
          >
            Sau →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Danh mục:</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Câu hỏi:</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Nhập câu hỏi..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Các lựa chọn:</label>
                {formData.options.map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Lựa chọn ${index + 1}`}
                    />
                    {formData.options.length > 2 && (
                      <button onClick={() => removeOption(index)} className="remove-option">
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {formData.options.length < 6 && (
                  <button onClick={addOption} className="add-option">
                    ➕ Thêm lựa chọn
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Đáp án đúng:</label>
                <select 
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                >
                  <option value="">Chọn đáp án</option>
                  {formData.options.filter(opt => opt.trim()).map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="cancel-btn">
                Hủy
              </button>
              <button onClick={handleSaveQuestion} className="save-btn">
                {editingQuestion ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;
