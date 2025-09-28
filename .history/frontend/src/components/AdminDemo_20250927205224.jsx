import React, { useState } from 'react';
import '../../styles/admin-demo.css';

const AdminDemo = () => {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h1>📊 Admin Dashboard - Demo</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ 
            color: '#38a169', 
            fontWeight: '600', 
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
            background: 'rgba(56, 161, 105, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(56, 161, 105, 0.2)'
          }}>
            ✅ Đã đăng nhập
          </span>
          <button style={{
            background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(229, 62, 62, 0.3)'
          }}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="demo-tabs">
        <button
          className={`demo-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📈 Thống kê
        </button>
        <button
          className={`demo-tab ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          ❓ Quản lý câu hỏi
        </button>
        <button
          className={`demo-tab ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          👥 Quản lý người chơi
        </button>
      </div>

      <div className="demo-content">
        {activeTab === 'stats' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: '#1a202c', margin: 0, fontSize: '1.875rem', fontWeight: '700', letterSpacing: '-0.025em' }}>
                📊 Thống kê tổng quan
              </h2>
              <button className="demo-btn add">
                🔄 Làm mới
              </button>
            </div>

            <div className="demo-stats">
              <div className="demo-stat-card">
                <div className="demo-stat-icon">📚</div>
                <div className="demo-stat-content">
                  <h3>156</h3>
                  <p>Tổng số câu hỏi</p>
                </div>
              </div>
              <div className="demo-stat-card">
                <div className="demo-stat-icon">👥</div>
                <div className="demo-stat-content">
                  <h3>89</h3>
                  <p>Tổng số người chơi</p>
                </div>
              </div>
              <div className="demo-stat-card">
                <div className="demo-stat-icon">🏆</div>
                <div className="demo-stat-content">
                  <h3>1,247</h3>
                  <p>Tổng số lượt chơi</p>
                </div>
              </div>
              <div className="demo-stat-card">
                <div className="demo-stat-icon">📈</div>
                <div className="demo-stat-content">
                  <h3>78.5</h3>
                  <p>Điểm trung bình</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div>
            <div className="demo-management-header">
              <h2>❓ Quản lý câu hỏi</h2>
              <button className="demo-btn add">
                ➕ Thêm câu hỏi
              </button>
            </div>

            <div className="demo-filters">
              <div className="demo-filter-group">
                <label>Danh mục:</label>
                <select>
                  <option>Tất cả</option>
                  <option>Europe</option>
                  <option>Asia</option>
                  <option>Học tiếng Anh chuyên ngành</option>
                  <option>Bóng đá</option>
                </select>
              </div>
              <div className="demo-filter-group">
                <label>Tìm kiếm:</label>
                <input type="text" placeholder="Tìm theo câu hỏi hoặc đáp án..." />
              </div>
            </div>

            <div className="demo-question-card">
              <div className="demo-question-header">
                <div className="demo-question-category">Europe</div>
                <div className="demo-actions">
                  <button className="demo-btn edit">✏️ Sửa</button>
                  <button className="demo-btn delete">🗑️ Xóa</button>
                </div>
              </div>
              <div className="demo-question-text">
                Thủ đô của Pháp là gì?
              </div>
              <div className="demo-question-options">
                <div className="demo-option correct">Paris</div>
                <div className="demo-option">London</div>
                <div className="demo-option">Berlin</div>
                <div className="demo-option">Madrid</div>
              </div>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.75rem', color: '#718096', fontWeight: '500' }}>
                <span>Tạo: 27/9/2025</span>
                <span>Cập nhật: 27/9/2025</span>
              </div>
            </div>

            <div className="demo-question-card">
              <div className="demo-question-header">
                <div className="demo-question-category">Europe</div>
                <div className="demo-actions">
                  <button className="demo-btn edit">✏️ Sửa</button>
                  <button className="demo-btn delete">🗑️ Xóa</button>
                </div>
              </div>
              <div className="demo-question-text">
                Thủ đô của Đức là gì?
              </div>
              <div className="demo-question-options">
                <div className="demo-option">Paris</div>
                <div className="demo-option">London</div>
                <div className="demo-option correct">Berlin</div>
                <div className="demo-option">Madrid</div>
              </div>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.75rem', color: '#718096', fontWeight: '500' }}>
                <span>Tạo: 27/9/2025</span>
                <span>Cập nhật: 27/9/2025</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'players' && (
          <div>
            <div className="demo-management-header">
              <h2>👥 Quản lý người chơi</h2>
              <button className="demo-btn add">
                🔄 Làm mới
              </button>
            </div>

            <div className="demo-filters">
              <div className="demo-filter-group">
                <label>Tìm kiếm:</label>
                <input type="text" placeholder="Tìm theo tên người chơi..." />
              </div>
            </div>

            <div className="demo-question-card">
              <div className="demo-question-header">
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a202c' }}>
                  Nguyễn Văn A
                </div>
                <div className="demo-actions">
                  <button className="demo-btn edit">👁️ Xem chi tiết</button>
                  <button className="demo-btn delete">🗑️ Xóa</button>
                </div>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '1.25rem', 
                marginBottom: '1.5rem' 
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: '500', letterSpacing: '0.025em' }}>
                    Tổng số lần chơi
                  </div>
                  <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '1rem' }}>15</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: '500', letterSpacing: '0.025em' }}>
                    Điểm cao nhất
                  </div>
                  <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '1rem' }}>95</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: '500', letterSpacing: '0.025em' }}>
                    Điểm trung bình
                  </div>
                  <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '1rem' }}>82.3</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: '500', letterSpacing: '0.025em' }}>
                    Lần chơi gần nhất
                  </div>
                  <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '1rem' }}>27/9/2025</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDemo;
