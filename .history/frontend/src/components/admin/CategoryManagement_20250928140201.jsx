import React, { useState, useEffect } from 'react';
import AdminAPI from '../../services/adminAPI';
import '../../styles/admin.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    emoji: '🌏'
  });
  const [formError, setFormError] = useState('');

  const adminKey = localStorage.getItem('adminKey');

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await AdminAPI.getCategories(adminKey);
      setCategories(response.data);
    } catch (err) {
      setError('Không thể tải danh mục. Vui lòng thử lại.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) {
      fetchCategories();
    }
  }, [adminKey]);

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setFormState({
      name: '',
      description: '',
      emoji: '🌏'
    });
    setFormError('');
    setShowAddEditModal(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setFormState({
      name: category.name,
      description: category.description || '',
      emoji: category.emoji || '🌏'
    });
    setFormError('');
    setShowAddEditModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Tất cả câu hỏi trong danh mục sẽ bị xóa.')) return;
    setLoading(true);
    setError('');
    try {
      await AdminAPI.deleteCategory(adminKey, id);
      fetchCategories();
    } catch (err) {
      setError('Không thể xóa danh mục. Vui lòng thử lại.');
      console.error('Error deleting category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formState.name.trim()) {
      setFormError('Vui lòng nhập tên danh mục.');
      return;
    }

    setLoading(true);
    try {
      if (currentCategory) {
        await AdminAPI.updateCategory(adminKey, currentCategory._id, formState);
      } else {
        await AdminAPI.createCategory(adminKey, formState);
      }
      setShowAddEditModal(false);
      fetchCategories();
    } catch (err) {
      setFormError(err.message || 'Lỗi khi lưu danh mục. Vui lòng thử lại.');
      console.error('Error saving category:', err);
    } finally {
      setLoading(false);
    }
  };

  const emojiOptions = ['🌏', '🇪🇺', '🇯🇵', '🇹🇭', '🇮🇳', '🇰🇿', '📚', '⚽', '🎯', '🌟', '🔥', '💡'];

  if (loading && !categories.length) {
    return <div className="admin-loading">Đang tải danh mục...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="category-management">
      <div className="management-header">
        <h2>📂 Quản lý danh mục</h2>
        <button onClick={handleAddCategory} className="add-btn">
          ➕ Thêm danh mục
        </button>
      </div>

      <div className="category-list">
        {categories && categories.length > 0 ? (
          <div className="category-grid">
            {categories.map(category => (
              <div key={category._id} className="category-card">
                <div className="category-header">
                  <span className="category-emoji">{category.emoji}</span>
                  <h3 className="category-name">{category.name}</h3>
                </div>
                {category.description && (
                  <p className="category-description">{category.description}</p>
                )}
                <div className="category-stats">
                  <span className="question-count">{category.questionCount || 0} câu hỏi</span>
                  <span className="created-date">
                    Tạo: {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="category-actions">
                  <button 
                    onClick={() => handleEditCategory(category)} 
                    className="edit-btn"
                  >
                    ✏️ Sửa
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category._id)} 
                    className="delete-btn"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>📂 Chưa có danh mục nào</p>
            <p className="no-data-subtitle">Hãy tạo danh mục đầu tiên!</p>
          </div>
        )}
      </div>

      {showAddEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{currentCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Emoji:</label>
                <div className="emoji-selector">
                  {emojiOptions.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      className={`emoji-option ${formState.emoji === emoji ? 'selected' : ''}`}
                      onClick={() => setFormState(prev => ({ ...prev, emoji }))}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Tên danh mục:</label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleFormChange}
                  placeholder="Nhập tên danh mục..."
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Mô tả (tùy chọn):</label>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleFormChange}
                  placeholder="Nhập mô tả danh mục..."
                  rows="3"
                ></textarea>
              </div>
              
              {formError && <p className="form-error">{formError}</p>}
              
              <div className="modal-actions">
                <button type="submit" className="save-btn">Lưu</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddEditModal(false)} 
                  className="cancel-btn"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
