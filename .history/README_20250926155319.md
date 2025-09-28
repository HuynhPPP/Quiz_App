# 🌍 Quiz App - Thủ Đô Thế Giới

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

> Ứng dụng Quiz tương tác về thủ đô các quốc gia trên thế giới, được xây dựng với React và Vite. Học hỏi địa lý một cách thú vị và hiệu quả!

## 📋 Mục lục

- [✨ Tính năng](#-tính-năng)
- [🚀 Demo](#-demo)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [📦 Cài đặt](#-cài-đặt)
- [🎯 Cách sử dụng](#-cách-sử-dụng)
- [🏗️ Cấu trúc dự án](#️-cấu-trúc-dự-án)
- [📊 Thống kê](#-thống-kê)
- [🤝 Đóng góp](#-đóng-góp)
- [📄 License](#-license)

## ✨ Tính năng

### 🎮 Chế độ chơi đa dạng
- **Chế độ cổ điển**: Không giới hạn thời gian, tập trung học tập
- **Chế độ theo khu vực**: Chọn quiz theo từng châu lục cụ thể
- **Quiz ngẫu nhiên**: 15 câu hỏi được chọn ngẫu nhiên
- **Quiz tổng hợp**: 20 câu hỏi từ tất cả các quốc gia

### 🌍 Nội dung phong phú
- **40+ câu hỏi** về thủ đô các quốc gia
- **5 khu vực địa lý**: Châu Âu, Đông Á, Đông Nam Á, Nam Á, Trung Á
- **Ngôn ngữ tiếng Việt**: Giao diện và câu hỏi hoàn toàn bằng tiếng Việt

### 🎯 Trải nghiệm người dùng
- **Giao diện thân thiện**: Thiết kế hiện đại, dễ sử dụng
- **Phản hồi tức thì**: Hiển thị kết quả ngay sau mỗi câu trả lời
- **Chế độ xem lại**: Xem lại chi tiết từng câu hỏi đã làm
- **Điều hướng linh hoạt**: Quay lại chọn chủ đề bất cứ lúc nào

### 📱 Responsive Design
- **Tương thích đa thiết bị**: Desktop, tablet, mobile
- **Tối ưu hiệu suất**: Tải nhanh, mượt mà
- **Accessibility**: Hỗ trợ người dùng khuyết tật

## 🚀 Demo

### 🎯 Màn hình chọn chủ đề
Chọn từ 5 khu vực địa lý hoặc quiz ngẫu nhiên để bắt đầu

### 📝 Màn hình làm bài
Giao diện quiz với câu hỏi tiếng Việt và các lựa chọn rõ ràng

### 📊 Màn hình kết quả
Hiển thị điểm số và các tùy chọn xem lại/làm lại

### 🔍 Chế độ xem lại
Xem chi tiết từng câu hỏi với đáp án đúng và câu trả lời của bạn

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18+**: Thư viện UI hiện đại với Hooks
- **Vite**: Build tool nhanh và hiệu quả
- **CSS3**: Styling với Flexbox, Grid, Animations
- **ES6+**: JavaScript hiện đại với Arrow Functions, Destructuring

### Development Tools
- **ESLint**: Code quality và consistency
- **Git**: Version control
- **npm**: Package management

### Architecture
- **Component-based**: Kiến trúc component tái sử dụng
- **State Management**: React Hooks (useState, useEffect)
- **Custom Hooks**: Logic tái sử dụng
- **Modular Design**: Tách biệt logic và UI

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 16.0+ 
- npm 8.0+ hoặc yarn 1.22+

### Các bước cài đặt

1. **Clone repository**
```bash
git clone https://github.com/yourusername/quiz-app.git
cd quiz-app
```

2. **Cài đặt dependencies**
```bash
npm install
# hoặc
yarn install
```

3. **Chạy ứng dụng**
```bash
npm run dev
# hoặc
yarn dev
```

4. **Mở trình duyệt**
Truy cập `http://localhost:5173` để xem ứng dụng

### Build cho production
```bash
npm run build
# hoặc
yarn build
```

## 🎯 Cách sử dụng

1. **Chọn chủ đề**: Từ màn hình chính, chọn khu vực địa lý hoặc quiz ngẫu nhiên
2. **Làm bài**: Đọc câu hỏi và chọn đáp án đúng
3. **Xem kết quả**: Sau khi hoàn thành, xem điểm số và thống kê
4. **Xem lại**: Nhấn "Xem lại" để xem chi tiết từng câu hỏi
5. **Làm lại**: Nhấn "Làm lại" để chọn chủ đề mới

## 🏗️ Cấu trúc dự án

```
quiz-app/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Quiz.jsx              # Component chính
│   │   ├── QuizSelector.jsx      # Chọn chủ đề
│   │   ├── Review.jsx            # Xem lại câu hỏi
│   │   └── Resutl.jsx            # Hiển thị kết quả
│   ├── data/
│   │   └── quizData.js           # Dữ liệu câu hỏi
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx                   # Component gốc
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### 📁 Mô tả các thư mục

- **`/components`**: Chứa các React components
- **`/data`**: Dữ liệu câu hỏi và logic xử lý
- **`/assets`**: Hình ảnh và tài nguyên tĩnh
- **`/public`**: File public cho Vite

## 📊 Thống kê

- **📦 40+ câu hỏi** về thủ đô các quốc gia
- **🌍 5 khu vực địa lý** được bao phủ
- **⚡ < 1s** thời gian tải trang
- **📱 100% responsive** trên mọi thiết bị
- **🎯 0 dependencies** không cần thiết

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Hãy làm theo các bước sau:

1. **Fork** repository này
2. **Tạo branch** cho feature mới (`git checkout -b feature/AmazingFeature`)
3. **Commit** thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. **Push** lên branch (`git push origin feature/AmazingFeature`)
5. **Mở Pull Request**

### 🐛 Báo lỗi
Nếu bạn tìm thấy lỗi, vui lòng tạo issue với:
- Mô tả chi tiết lỗi
- Các bước tái tạo lỗi
- Screenshot (nếu có)
- Thông tin môi trường

### 💡 Đề xuất tính năng
Chúng tôi luôn tìm kiếm ý tưởng mới! Hãy tạo issue với:
- Mô tả tính năng
- Lý do tại sao hữu ích
- Mockup hoặc wireframe (nếu có)

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

---

<div align="center">

### 🌟 Nếu dự án này hữu ích, hãy cho một ⭐!

**Được phát triển với ❤️ bởi [Tên của bạn]**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourusername)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://yourportfolio.com)

</div>
