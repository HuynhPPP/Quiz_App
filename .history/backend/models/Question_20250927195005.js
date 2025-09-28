import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Danh mục câu hỏi là bắt buộc'],
    trim: true
  },
  question: {
    type: String,
    required: [true, 'Nội dung câu hỏi là bắt buộc'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Các lựa chọn là bắt buộc'],
    validate: {
      validator: function(options) {
        return options && options.length >= 2;
      },
      message: 'Câu hỏi phải có ít nhất 2 lựa chọn'
    }
  },
  answer: {
    type: String,
    required: [true, 'Đáp án là bắt buộc'],
    trim: true
  }
}, {
  timestamps: true
});

// Index để tối ưu hóa truy vấn theo category
questionSchema.index({ category: 1 });

// Virtual để kiểm tra đáp án có hợp lệ không
questionSchema.virtual('isValidAnswer').get(function() {
  return this.options.includes(this.answer);
});

// Pre-save middleware để validate đáp án
questionSchema.pre('save', function(next) {
  if (!this.options.includes(this.answer)) {
    const error = new Error('Đáp án phải nằm trong danh sách các lựa chọn');
    return next(error);
  }
  next();
});

// Static method để lấy câu hỏi theo category
questionSchema.statics.getByCategory = function(category) {
  return this.find({ category: category });
};

// Static method để lấy tất cả categories
questionSchema.statics.getAllCategories = function() {
  return this.distinct('category');
};

const Question = mongoose.model('Question', questionSchema);

export default Question;
