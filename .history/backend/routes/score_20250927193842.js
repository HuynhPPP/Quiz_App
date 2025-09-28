import express from 'express';
import Score from '../models/Score.js';

const router = express.Router();

// POST /api/score - Lưu điểm của người chơi
router.post('/', async (req, res) => {
  try {
    const { name, points } = req.body;

    // Validation
    if (!name || points === undefined || points === null) {
      return res.status(400).json({
        error: 'Thiếu thông tin bắt buộc',
        message: 'Vui lòng cung cấp đầy đủ: name và points'
      });
    }

    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Tên không hợp lệ',
        message: 'Tên phải là chuỗi không rỗng'
      });
    }

    if (typeof points !== 'number' || points < 0 || points > 1000) {
      return res.status(400).json({
        error: 'Điểm số không hợp lệ',
        message: 'Điểm số phải là số từ 0 đến 1000'
      });
    }

    const newScore = new Score({
      name: name.trim(),
      points: Math.round(points)
    });

    await newScore.save();

    res.status(201).json({
      success: true,
      message: 'Lưu điểm thành công',
      data: {
        id: newScore._id,
        name: newScore.name,
        points: newScore.points,
        createdAt: newScore.createdAt
      }
    });

  } catch (error) {
    console.error('Lỗi khi lưu điểm:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Dữ liệu không hợp lệ',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lưu điểm'
    });
  }
});

// GET /api/score/leaderboard - Lấy bảng xếp hạng top 10
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        error: 'Giới hạn không hợp lệ',
        message: 'Limit phải từ 1 đến 100'
      });
    }

    const leaderboard = await Score.getLeaderboard(limit);
    
    // Thêm rank cho mỗi người chơi
    const leaderboardWithRank = leaderboard.map((score, index) => ({
      ...score,
      rank: index + 1
    }));

    res.json({
      success: true,
      data: leaderboardWithRank,
      count: leaderboardWithRank.length,
      message: `Top ${leaderboardWithRank.length} người chơi có điểm cao nhất`
    });

  } catch (error) {
    console.error('Lỗi khi lấy leaderboard:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lấy bảng xếp hạng'
    });
  }
});

// GET /api/score/player/:name - Lấy điểm của người chơi cụ thể
router.get('/player/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Tên không hợp lệ',
        message: 'Vui lòng cung cấp tên người chơi'
      });
    }

    const playerScores = await Score.getPlayerScores(name.trim());
    
    if (playerScores.length === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy người chơi',
        message: `Không có điểm nào cho người chơi "${name}"`
      });
    }

    // Tính điểm cao nhất và trung bình
    const highestScore = Math.max(...playerScores.map(s => s.points));
    const averageScore = playerScores.reduce((sum, s) => sum + s.points, 0) / playerScores.length;

    res.json({
      success: true,
      data: {
        playerName: name.trim(),
        scores: playerScores,
        statistics: {
          totalGames: playerScores.length,
          highestScore: highestScore,
          averageScore: Math.round(averageScore * 100) / 100,
          latestScore: playerScores[0].points
        }
      },
      count: playerScores.length
    });

  } catch (error) {
    console.error('Lỗi khi lấy điểm người chơi:', error);
    res.status(500).json({
      error: 'Lỗi server',
      message: 'Không thể lấy điểm của người chơi'
    });
  }
});

// GET /api/score/stats - Lấy thống kê tổng quan
router.get('/stats', async (req, res) => {
  try {
    const totalPlayers = await Score.countDocuments();
    const totalGames = await Score.countDocuments();
    const averageScore = await Score.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$points' } } }
    ]);
    
    const topPlayer = await Score.findOne().sort({ points: -1 });
    const recentScores = await Score.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name points createdAt');

    res.json({
      success: true,
      data: {
        totalPlayers,
        totalGames,
        averageScore: averageScore.length > 0 ? Math.round(averageScore[0].avgScore * 100) / 100 : 0,
        topPlayer: topPlayer ? {
          name: topPlayer.name,
          points: topPlayer.points
        } : null,
        recentScores
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

export default router;
