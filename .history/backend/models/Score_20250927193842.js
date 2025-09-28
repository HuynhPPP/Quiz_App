import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên người chơi là bắt buộc'],
    trim: true,
    maxlength: [50, 'Tên không được quá 50 ký tự']
  },
  points: {
    type: Number,
    required: [true, 'Điểm số là bắt buộc'],
    min: [0, 'Điểm số không được âm'],
    max: [1000, 'Điểm số không được vượt quá 1000']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index để tối ưu hóa truy vấn leaderboard
scoreSchema.index({ points: -1, createdAt: -1 });

// Static method để lấy leaderboard (top 10)
scoreSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find()
    .sort({ points: -1, createdAt: -1 })
    .limit(limit)
    .select('name points createdAt')
    .lean();
};

// Static method để lấy điểm của người chơi cụ thể
scoreSchema.statics.getPlayerScores = function(playerName) {
  return this.find({ name: playerName })
    .sort({ createdAt: -1 })
    .select('points createdAt')
    .lean();
};

// Instance method để format điểm số
scoreSchema.methods.formatScore = function() {
  return {
    id: this._id,
    name: this.name,
    points: this.points,
    createdAt: this.createdAt,
    rank: null // Sẽ được tính toán khi lấy leaderboard
  };
};

const Score = mongoose.model('Score', scoreSchema);

export default Score;
