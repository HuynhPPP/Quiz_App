import express from 'express';
import Category from '../models/Category.js';
import Question from '../models/Question.js';

const router = express.Router();

// Middleware để kiểm tra admin key
const verifyAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  const validAdminKey = process.env.ADMIN_KEY;
  
  if (!adminKey || adminKey !== validAdminKey) {
    return res.status(401).json({ 
      success: false, 
      message: 'Admin key không hợp lệ' 
    });
  }
  
  next();
};

// Lấy danh sách tất cả chủ đề
router.get('/', verifyAdmin, async (req, res) => {
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
      success: false,
      message: 'Lỗi server khi lấy danh sách chủ đề'
    });
  }
});

// Tạo chủ đề mới
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, description, emoji } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên chủ đề là bắt buộc'
      });
    }
    
    // Kiểm tra chủ đề đã tồn tại
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Chủ đề đã tồn tại'
      });
    }
    
    const category = new Category({
      name: name.trim(),
      description: description?.trim() || '',
      emoji: emoji || '🌏'
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Tạo chủ đề thành công',
      data: category
    });
  } catch (error) {
    console.error('Lỗi khi tạo chủ đề:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo chủ đề'
    });
  }
});

// Cập nhật chủ đề
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, emoji } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên chủ đề là bắt buộc'
      });
    }
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chủ đề'
      });
    }
    
    // Kiểm tra tên mới có trùng với chủ đề khác không
    if (name.trim() !== category.name) {
      const existingCategory = await Category.findOne({ name: name.trim() });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Tên chủ đề đã tồn tại'
        });
      }
    }
    
    // Cập nhật tên chủ đề trong các câu hỏi liên quan
    if (name.trim() !== category.name) {
      await Question.updateMany(
        { category: category.name },
        { category: name.trim() }
      );
    }
    
    category.name = name.trim();
    category.description = description?.trim() || '';
    category.emoji = emoji || '🌏';
    
    await category.save();
    
    res.json({
      success: true,
      message: 'Cập nhật chủ đề thành công',
      data: category
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật chủ đề:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật chủ đề'
    });
  }
});

// Xóa chủ đề
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chủ đề'
      });
    }
    
    // Xóa tất cả câu hỏi trong chủ đề này
    await Question.deleteMany({ category: category.name });
    
    // Xóa chủ đề
    await Category.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Xóa chủ đề và tất cả câu hỏi liên quan thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa chủ đề:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa chủ đề'
    });
  }
});

export default router;
