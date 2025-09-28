// API service để giao tiếp với backend
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

class QuizAPI {
  // Lấy tất cả danh mục
  static async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/quiz`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
      throw error;
    }
  }

  // Lấy câu hỏi theo danh mục
  static async getQuestionsByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/${encodeURIComponent(category)}`);
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

  // Lấy câu hỏi ngẫu nhiên
  static async getRandomQuestions(count = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/random/${count}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Lỗi khi lấy câu hỏi ngẫu nhiên:', error);
      throw error;
    }
  }

  // Lưu điểm của người chơi
  static async saveScore(name, points) {
    try {
      const response = await fetch(`${API_BASE_URL}/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, points }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi lưu điểm:', error);
      throw error;
    }
  }

  // Lấy bảng xếp hạng
  static async getLeaderboard(limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/score/leaderboard?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Lỗi khi lấy leaderboard:', error);
      throw error;
    }
  }

  // Lấy thống kê
  static async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/score/stats`);
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

  // Lấy thống kê người chơi cụ thể
  static async getPlayerStats(playerName) {
    try {
      const response = await fetch(`${API_BASE_URL}/score/player/${encodeURIComponent(playerName)}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Người chơi không tồn tại
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Lỗi khi lấy thống kê người chơi:', error);
      throw error;
    }
  }

  // Kiểm tra kết nối server
  static async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi kiểm tra server:', error);
      throw error;
    }
  }
}

export default QuizAPI;
