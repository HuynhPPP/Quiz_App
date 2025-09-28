// Admin API service để giao tiếp với backend admin endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class AdminAPI {
  // Helper method để thêm admin key vào headers
  static getHeaders(adminKey) {
    return {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey
    };
  }

  // ==================== STATISTICS ====================

  // Lấy thống kê tổng quan
  static async getStats(adminKey) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: this.getHeaders(adminKey)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Lỗi khi lấy thống kê:', error);
      throw error;
    }
  }

  // Lấy danh sách categories
  static async getCategories(adminKey) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories`, {
        headers: this.getHeaders(adminKey)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Categories API response:', data); // Debug log
      return data.data || data || [];
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
      throw error;
    }
  }

  // Tạo danh mục mới
  static async createCategory(adminKey, categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: 'POST',
        headers: this.getHeaders(adminKey),
        body: JSON.stringify(categoryData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi tạo danh mục:', error);
      throw error;
    }
  }

  // Cập nhật danh mục
  static async updateCategory(adminKey, categoryId, categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: this.getHeaders(adminKey),
        body: JSON.stringify(categoryData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      throw error;
    }
  }

  // Xóa danh mục
  static async deleteCategory(adminKey, categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: this.getHeaders(adminKey)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
      throw error;
    }
  }

  // ==================== QUESTION MANAGEMENT ====================

  // Lấy danh sách câu hỏi với phân trang
  static async getQuestions(adminKey, page = 1, limit = 10, category = '', search = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`${API_BASE_URL}/admin/questions?${params}`, {
        headers: this.getHeaders(adminKey)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Questions API response:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách câu hỏi:', error);
      throw error;
    }
  }

  // Lấy câu hỏi theo ID
  static async getQuestion(adminKey, questionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions/${questionId}`, {
        headers: this.getHeaders(adminKey)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Lỗi khi lấy câu hỏi:', error);
      throw error;
    }
  }

  // Thêm câu hỏi mới
  static async createQuestion(adminKey, questionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions`, {
        method: 'POST',
        headers: this.getHeaders(adminKey),
        body: JSON.stringify(questionData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi tạo câu hỏi:', error);
      throw error;
    }
  }

  // Cập nhật câu hỏi
  static async updateQuestion(adminKey, questionId, questionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions/${questionId}`, {
        method: 'PUT',
        headers: this.getHeaders(adminKey),
        body: JSON.stringify(questionData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi cập nhật câu hỏi:', error);
      throw error;
    }
  }

  // Xóa câu hỏi
  static async deleteQuestion(adminKey, questionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: this.getHeaders(adminKey)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi xóa câu hỏi:', error);
      throw error;
    }
  }

  // ==================== PLAYER MANAGEMENT ====================

  // Lấy danh sách người chơi với phân trang
  static async getPlayers(adminKey, page = 1, limit = 10, search = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (search) params.append('search', search);

      const response = await fetch(`${API_BASE_URL}/admin/players?${params}`, {
        headers: this.getHeaders(adminKey)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Players API response:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người chơi:', error);
      throw error;
    }
  }

  // Lấy thông tin chi tiết người chơi
  static async getPlayer(adminKey, playerName) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/players/${encodeURIComponent(playerName)}`, {
        headers: this.getHeaders(adminKey)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người chơi:', error);
      throw error;
    }
  }

  // Xóa tất cả điểm của người chơi
  static async deletePlayer(adminKey, playerName) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/players/${encodeURIComponent(playerName)}`, {
        method: 'DELETE',
        headers: this.getHeaders(adminKey)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi xóa người chơi:', error);
      throw error;
    }
  }
}

export default AdminAPI;
