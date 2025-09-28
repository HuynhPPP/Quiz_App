import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';

// Load environment variables
dotenv.config();

// Dữ liệu từ frontend (đã được chuyển đổi)
const quizData = [
  // Football Data
  {
    question: "Một trận đấu bóng đá chính thức có bao nhiêu phút?",
    options: ["80 phút", "90 phút", "100 phút", "120 phút"],
    answer: "90 phút",
    category: "Bóng đá"
  },
  {
    question: "Một đội bóng có bao nhiêu cầu thủ trên sân khi bắt đầu trận đấu?",
    options: ["9", "10", "11", "12"],
    answer: "11",
    category: "Bóng đá"
  },
  {
    question: "Cristiano Ronaldo thường được viết tắt với số áo nào?",
    options: ["CR9", "CR10", "CR7", "CR11"],
    answer: "CR7",
    category: "Bóng đá"
  },
  {
    question: "World Cup 2022 được tổ chức tại quốc gia nào?",
    options: ["Nga", "Qatar", "Brazil", "Pháp"],
    answer: "Qatar",
    category: "Bóng đá"
  },
  {
    question: "Đội tuyển nào được gọi là 'Những chiến binh sao vàng'?",
    options: ["Thái Lan", "Việt Nam", "Hàn Quốc", "Nhật Bản"],
    answer: "Việt Nam",
    category: "Bóng đá"
  },
  {
    question: "Sân vận động Mỹ Đình nằm ở thành phố nào?",
    options: ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng"],
    answer: "Hà Nội",
    category: "Bóng đá"
  },
  {
    question: "Đội nào có biệt danh 'Quỷ Đỏ'?",
    options: ["Liverpool", "Manchester United", "Arsenal", "Chelsea"],
    answer: "Manchester United",
    category: "Bóng đá"
  },
  {
    question: "Ai là cầu thủ nổi tiếng với biệt danh 'El Pulga' (Bọ chét)?",
    options: ["Lionel Messi", "Neymar", "Xavi", "Iniesta"],
    answer: "Lionel Messi",
    category: "Bóng đá"
  },

  // Capitals Data
  {
    question: "Thủ đô của Pháp là gì?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
    category: "Europe"
  },
  {
    question: "Thủ đô của Đức là gì?",
    options: ["Berlin", "London", "Madrid", "Paris"],
    answer: "Berlin",
    category: "Europe"
  },
  {
    question: "Thủ đô của Ý là gì?",
    options: ["Rome", "London", "Madrid", "Paris"],
    answer: "Rome",
    category: "Europe"
  },
  {
    question: "Thủ đô của Tây Ban Nha là gì?",
    options: ["Madrid", "Barcelona", "Seville", "Valencia"],
    answer: "Madrid",
    category: "Europe"
  },
  {
    question: "Thủ đô của Anh là gì?",
    options: ["London", "Manchester", "Liverpool", "Birmingham"],
    answer: "London",
    category: "Europe"
  },
  {
    question: "Thủ đô của Nhật Bản là gì?",
    options: ["Tokyo", "Osaka", "Kyoto", "Hiroshima"],
    answer: "Tokyo",
    category: "Asia"
  },
  {
    question: "Thủ đô của Trung Quốc là gì?",
    options: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen"],
    answer: "Beijing",
    category: "Asia"
  },
  {
    question: "Thủ đô của Hàn Quốc là gì?",
    options: ["Seoul", "Busan", "Incheon", "Daegu"],
    answer: "Seoul",
    category: "Asia"
  },

  // IT Vocabulary Data
  {
    question: "Từ 'Multiplication' có nghĩa là gì?",
    options: ["Phép nhân", "Phép trừ", "Phép cộng", "Phép chia"],
    answer: "Phép nhân",
    category: "Học tiếng Anh chuyên ngành"
  },
  {
    question: "Từ 'Numeric' có nghĩa là gì?",
    options: ["Số học, thuộc về số học", "Chữ cái", "Ký hiệu", "Hình học"],
    answer: "Số học, thuộc về số học",
    category: "Học tiếng Anh chuyên ngành"
  },
  {
    question: "Từ 'Operation' có nghĩa là gì?",
    options: ["Thao tác", "Nghỉ ngơi", "Chờ đợi", "Kết thúc"],
    answer: "Thao tác",
    category: "Học tiếng Anh chuyên ngành"
  },
  {
    question: "Từ 'Algorithm' có nghĩa là gì?",
    options: ["Thuật toán", "Công thức", "Phương trình", "Biểu đồ"],
    answer: "Thuật toán",
    category: "Học tiếng Anh chuyên ngành"
  },
  {
    question: "Từ 'Database' có nghĩa là gì?",
    options: ["Cơ sở dữ liệu", "Tệp tin", "Thư mục", "Ứng dụng"],
    answer: "Cơ sở dữ liệu",
    category: "Học tiếng Anh chuyên ngành"
  },
  {
    question: "Từ 'Framework' có nghĩa là gì?",
    options: ["Khung làm việc", "Công cụ", "Phần mềm", "Hệ thống"],
    answer: "Khung làm việc",
    category: "Học tiếng Anh chuyên ngành"
  },
  {
    question: "Từ 'API' có nghĩa là gì?",
    options: ["Giao diện lập trình ứng dụng", "Cơ sở dữ liệu", "Máy chủ", "Trình duyệt"],
    answer: "Giao diện lập trình ứng dụng",
    category: "Học tiếng Anh chuyên ngành"
  },
  {
    question: "Từ 'Debug' có nghĩa là gì?",
    options: ["Gỡ lỗi", "Tạo mới", "Xóa bỏ", "Cập nhật"],
    answer: "Gỡ lỗi",
    category: "Học tiếng Anh chuyên ngành"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Kết nối MongoDB thành công');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️ Đã xóa dữ liệu cũ');

    // Insert new questions
    const insertedQuestions = await Question.insertMany(quizData);
    console.log(`✅ Đã thêm ${insertedQuestions.length} câu hỏi vào database`);

    // Show categories
    const categories = await Question.distinct('category');
    console.log('📚 Các danh mục có sẵn:', categories);

    console.log('🎉 Hoàn thành migrate dữ liệu!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Lỗi khi migrate dữ liệu:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
