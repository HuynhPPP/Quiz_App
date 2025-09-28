import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// GET /api/quiz/:category - Lấy câu hỏi theo chủ đề
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!category) {
      return res.status(400).json({
        error: 'Thiếu tham số category',
        message: 'Vui lòng cung cấp danh mục câu hỏi'
      });
    }

    const questions = await Question.getByCategory(category);
    
    if (questions.length === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy câu hỏi',
        message: `Không có câu hỏi nào cho danh mục "${category}"`
      });
    }

    res.json({
      success: true,
      data: questions,
      count: questions.length,
      category: category
    });

  } catch (error) {
    console.error('Lỗi khi lấy câu hỏi:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lấy danh sách câu hỏi'
    });
  }
});

// GET /api/quiz - Lấy tất cả danh mục có sẵn
router.get('/', async (req, res) => {
  try {
    const categories = await Question.getAllCategories();
    
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });

  } catch (error) {
    console.error('Lỗi khi lấy danh mục:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lấy danh sách danh mục'
    });
  }
});

// POST /api/quiz - Thêm câu hỏi mới (Admin only)
router.post('/', async (req, res) => {
  try {
    const { category, question, options, answer } = req.body;

    // Validation
    if (!category || !question || !options || !answer) {
      return res.status(400).json({
        error: 'Thiếu thông tin bắt buộc',
        message: 'Vui lòng cung cấp đầy đủ: category, question, options, answer'
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        error: 'Lựa chọn không hợp lệ',
        message: 'Options phải là mảng có ít nhất 2 phần tử'
      });
    }

    if (!options.includes(answer)) {
      return res.status(400).json({
        error: 'Đáp án không hợp lệ',
        message: 'Đáp án phải nằm trong danh sách options'
      });
    }

    const newQuestion = new Question({
      category: category.trim(),
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      answer: answer.trim()
    });

    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: 'Thêm câu hỏi thành công',
      data: newQuestion
    });

  } catch (error) {
    console.error('Lỗi khi thêm câu hỏi:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Dữ liệu không hợp lệ',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể thêm câu hỏi mới'
    });
  }
});

// GET /api/quiz/random/:count - Lấy câu hỏi ngẫu nhiên
router.get('/random/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    
    if (count < 1 || count > 50) {
      return res.status(400).json({
        error: 'Số lượng không hợp lệ',
        message: 'Số lượng câu hỏi phải từ 1 đến 50'
      });
    }

    const questions = await Question.aggregate([
      { $sample: { size: count } }
    ]);

    res.json({
      success: true,
      data: questions,
      count: questions.length
    });

  } catch (error) {
    console.error('Lỗi khi lấy câu hỏi ngẫu nhiên:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lấy câu hỏi ngẫu nhiên'
    });
  }
});

export default router;
