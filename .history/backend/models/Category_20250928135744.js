import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  emoji: {
    type: String,
    default: '🌏',
    maxlength: 10
  },
  questionCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better performance
categorySchema.index({ name: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
