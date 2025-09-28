import express from 'express';
import Question from '../models/Question.js';
import Score from '../models/Score.js';
import Category from '../models/Category.js';

const router = express.Router();

// Middleware để kiểm tra quyền admin (đơn giản)
const adminAuth = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY || !adminKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Cần quyền admin để truy cập'
    });
  }
  next();
};

// ==================== QUESTION MANAGEMENT ====================

// GET /api/admin/questions - Lấy tất cả câu hỏi với phân trang
router.get('/questions', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Question.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: questions,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Lỗi khi lấy danh sách câu hỏi:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lấy danh sách câu hỏi'
    });
  }
});

// GET /api/admin/questions/:id - Lấy câu hỏi theo ID
router.get('/questions/:id', adminAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        error: 'Không tìm thấy',
        message: 'Câu hỏi không tồn tại'
      });
    }

    res.json({
      success: true,
      data: question
    });

  } catch (error) {
    console.error('Lỗi khi lấy câu hỏi:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lấy câu hỏi'
    });
  }
});

// POST /api/admin/questions - Thêm câu hỏi mới
router.post('/questions', adminAuth, async (req, res) => {
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

// PUT /api/admin/questions/:id - Cập nhật câu hỏi
router.put('/questions/:id', adminAuth, async (req, res) => {
  try {
    const { category, question, options, answer } = req.body;

    const existingQuestion = await Question.findById(req.params.id);
    if (!existingQuestion) {
      return res.status(404).json({
        error: 'Không tìm thấy',
        message: 'Câu hỏi không tồn tại'
      });
    }

    // Validation
    if (options && !Array.isArray(options)) {
      return res.status(400).json({
        error: 'Lựa chọn không hợp lệ',
        message: 'Options phải là mảng'
      });
    }

    if (answer && options && !options.includes(answer)) {
      return res.status(400).json({
        error: 'Đáp án không hợp lệ',
        message: 'Đáp án phải nằm trong danh sách options'
      });
    }

    const updateData = {};
    if (category) updateData.category = category.trim();
    if (question) updateData.question = question.trim();
    if (options) updateData.options = options.map(opt => opt.trim());
    if (answer) updateData.answer = answer.trim();

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Cập nhật câu hỏi thành công',
      data: updatedQuestion
    });

  } catch (error) {
    console.error('Lỗi khi cập nhật câu hỏi:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Dữ liệu không hợp lệ',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể cập nhật câu hỏi'
    });
  }
});

// DELETE /api/admin/questions/:id - Xóa câu hỏi
router.delete('/questions/:id', adminAuth, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        error: 'Không tìm thấy',
        message: 'Câu hỏi không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Xóa câu hỏi thành công',
      data: question
    });

  } catch (error) {
    console.error('Lỗi khi xóa câu hỏi:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể xóa câu hỏi'
    });
  }
});

// ==================== PLAYER MANAGEMENT ====================

// GET /api/admin/players - Lấy danh sách người chơi với phân trang
router.get('/players', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;

    let matchStage = {};
    
    if (search) {
      matchStage.name = { $regex: search, $options: 'i' };
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$name',
          totalGames: { $sum: 1 },
          highestScore: { $max: '$points' },
          averageScore: { $avg: '$points' },
          latestScore: { $first: '$points' },
          latestPlayed: { $max: '$createdAt' },
          firstPlayed: { $min: '$createdAt' }
        }
      },
      { $sort: { latestPlayed: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ];

    const players = await Score.aggregate(pipeline);
    const total = await Score.distinct('name').length;

    res.json({
      success: true,
      data: players,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Lỗi khi lấy danh sách người chơi:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lấy danh sách người chơi'
    });
  }
});

// GET /api/admin/players/:name - Lấy thông tin chi tiết người chơi
router.get('/players/:name', adminAuth, async (req, res) => {
  try {
    const playerName = decodeURIComponent(req.params.name);
    
    const playerScores = await Score.find({ name: playerName })
      .sort({ createdAt: -1 })
      .limit(50); // Chỉ lấy 50 điểm gần nhất

    if (playerScores.length === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy',
        message: 'Người chơi không tồn tại'
      });
    }

    const stats = {
      totalGames: playerScores.length,
      highestScore: Math.max(...playerScores.map(s => s.points)),
      averageScore: playerScores.reduce((sum, s) => sum + s.points, 0) / playerScores.length,
      latestScore: playerScores[0].points,
      firstPlayed: playerScores[playerScores.length - 1].createdAt,
      latestPlayed: playerScores[0].createdAt
    };

    res.json({
      success: true,
      data: {
        playerName,
        stats,
        recentScores: playerScores
      }
    });

  } catch (error) {
    console.error('Lỗi khi lấy thông tin người chơi:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lấy thông tin người chơi'
    });
  }
});

// DELETE /api/admin/players/:name - Xóa tất cả điểm của người chơi
router.delete('/players/:name', adminAuth, async (req, res) => {
  try {
    const playerName = decodeURIComponent(req.params.name);
    
    const result = await Score.deleteMany({ name: playerName });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy',
        message: 'Không có điểm nào của người chơi này'
      });
    }

    res.json({
      success: true,
      message: `Đã xóa ${result.deletedCount} điểm của người chơi "${playerName}"`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Lỗi khi xóa điểm người chơi:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể xóa điểm người chơi'
    });
  }
});

// ==================== STATISTICS ====================

// GET /api/admin/stats - Thống kê tổng quan
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalQuestions,
      totalPlayers,
      totalGames,
      averageScore,
      topPlayer,
      recentScores,
      categoryStats,
      dailyStats
    ] = await Promise.all([
      Question.countDocuments(),
      Score.distinct('name').then(names => names.length),
      Score.countDocuments(),
      Score.aggregate([{ $group: { _id: null, avgScore: { $avg: '$points' } } }]),
      Score.findOne().sort({ points: -1 }),
      Score.find().sort({ createdAt: -1 }).limit(10).select('name points createdAt'),
      Question.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Score.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            games: { $sum: 1 },
            avgScore: { $avg: '$points' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
        { $limit: 30 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalQuestions,
          totalPlayers,
          totalGames,
          averageScore: averageScore.length > 0 ? Math.round(averageScore[0].avgScore * 100) / 100 : 0,
          topPlayer: topPlayer ? {
            name: topPlayer.name,
            points: topPlayer.points,
            date: topPlayer.createdAt
          } : null
        },
        recentActivity: recentScores,
        categoryDistribution: categoryStats,
        dailyActivity: dailyStats
      }
    });

  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lấy thống kê'
    });
  }
});

// GET /api/admin/categories - Lấy danh sách categories
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const categories = await Question.distinct('category');
    
    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Lỗi khi lấy danh mục:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lấy danh mục'
    });
  }
});

// ==================== CATEGORY MANAGEMENT ====================

// GET /api/admin/categories - Lấy danh sách categories từ Category model
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    // Đếm số câu hỏi cho mỗi chủ đề
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const questionCount = await Question.countDocuments({ category: category.name });
        return {
          ...category.toObject(),
          questionCount
        };
      })
    );
    
    res.json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chủ đề:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lấy danh sách chủ đề'
    });
  }
});

export default router;
