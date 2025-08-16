# Ứng dụng Ôn Thi Bằng Lái Xe A1

Ứng dụng web ReactJS để ôn tập và thi thử bằng lái xe máy A1 với bộ 250 câu hỏi (bao gồm câu điểm liệt).

## 🚀 Tính năng chính

### 📚 Chế độ ôn tập

- Hiển thị từng câu hỏi với giải thích chi tiết
- Điều hướng câu trước/sau
- Bộ lọc: Tất cả câu, chỉ câu điểm liệt, câu đã sai trước đó
- Lưu câu sai vào localStorage để ôn tập sau

### 🎯 Chế độ thi thử

- 25 câu hỏi ngẫu nhiên từ bộ 250 câu
- Đồng hồ đếm ngược 19 phút
- Điều kiện đạt: ≥ 21 câu đúng và không sai câu điểm liệt
- Cảnh báo khi sai câu điểm liệt

### 📊 Trang kết quả

- Hiển thị điểm số và thống kê chi tiết
- Danh sách câu sai với đáp án đúng
- Nút thi lại và ôn tập câu sai

## 🛠️ Công nghệ sử dụng

- **React 19.1.1** - Framework chính
- **React Router DOM** - Điều hướng trang
- **Material-UI (MUI)** - UI Components
- **LocalStorage** - Lưu trữ dữ liệu người dùng

## 📁 Cấu trúc dự án

```
src/
├── components/
│   ├── QuizQuestion.jsx      # Component hiển thị câu hỏi
│   ├── Timer.jsx            # Đồng hồ đếm ngược
│   └── ProgressBar.jsx      # Thanh tiến trình
├── pages/
│   ├── Home.jsx             # Trang chủ
│   ├── Practice.jsx         # Trang ôn tập
│   ├── Exam.jsx             # Trang thi thử
│   └── Result.jsx           # Trang kết quả
├── data/
│   └── questions.json       # Dữ liệu câu hỏi
├── App.jsx                  # Component chính với routing
└── index.js                 # Entry point
```

## 🚀 Cách chạy dự án

### Yêu cầu hệ thống

- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn

### Cài đặt và chạy

1. **Clone dự án** (nếu chưa có)

```bash
git clone <repository-url>
cd driver-license-test
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Chạy ứng dụng**

```bash
npm start
```

4. **Mở trình duyệt**
   Truy cập [http://localhost:3000](http://localhost:3000)

### Build cho production

```bash
npm run build
```

## 📝 Cấu trúc dữ liệu câu hỏi

File `src/data/questions.json` chứa mảng các câu hỏi với cấu trúc:

```json
{
  "id": 1,
  "question": "Nội dung câu hỏi...",
  "answers": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
  "correctAnswer": 0,
  "isDiemLiet": true,
  "explanation": "Giải thích đáp án..."
}
```

### Trường dữ liệu:

- `id`: ID duy nhất của câu hỏi
- `question`: Nội dung câu hỏi
- `answers`: Mảng 4 đáp án (A, B, C, D)
- `correctAnswer`: Index của đáp án đúng (0-3)
- `isDiemLiet`: Boolean - có phải câu điểm liệt không
- `explanation`: Giải thích đáp án (hiển thị khi ôn tập)

## 🎨 Giao diện

- **Responsive**: Hiển thị tốt trên desktop và mobile
- **Material Design**: Sử dụng Material-UI với theme tùy chỉnh
- **Màu sắc**: Xanh dương chủ đạo, xanh lá cho thành công, đỏ cho lỗi
- **Typography**: Font system với trọng số phù hợp

## 📱 Tính năng responsive

- **Desktop**: Layout đầy đủ với sidebar và grid
- **Tablet**: Layout thích ứng với màn hình vừa
- **Mobile**: Layout tối ưu cho màn hình nhỏ

## 💾 Lưu trữ dữ liệu

Ứng dụng sử dụng `localStorage` để lưu:

- Danh sách câu hỏi đã sai (`wrongAnswers`)
- Tiến trình làm bài (nếu cần)

## 🔧 Tùy chỉnh

### Thêm câu hỏi mới

1. Mở file `src/data/questions.json`
2. Thêm câu hỏi mới theo cấu trúc đã định
3. Đảm bảo `id` là duy nhất

### Thay đổi theme

Chỉnh sửa object `theme` trong `src/App.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: "#your-color",
    },
    // ...
  },
});
```

### Thay đổi thời gian thi

Chỉnh sửa hằng số `EXAM_DURATION` trong `src/pages/Exam.jsx`:

```javascript
const EXAM_DURATION = 20 * 60; // 20 phút
```

## 🐛 Xử lý lỗi thường gặp

### Lỗi "Module not found"

```bash
npm install
```

### Lỗi port đã được sử dụng

```bash
npm start -- --port 3001
```

### Lỗi Material-UI

```bash
npm install @mui/material @emotion/react @emotion/styled
```

## 📈 Mở rộng tương lai

- [ ] Thêm bộ 600 câu hỏi
- [ ] Chế độ thi theo chủ đề
- [ ] Thống kê chi tiết hơn
- [ ] Chế độ offline
- [ ] PWA (Progressive Web App)
- [ ] Dark mode
- [ ] Đa ngôn ngữ

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 👥 Đóng góp

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue trên GitHub.

---

**Lưu ý**: Đây là ứng dụng học tập, không thay thế cho việc học chính thức. Hãy tham khảo tài liệu chính thức của Bộ GTVT để đảm bảo tính chính xác.
