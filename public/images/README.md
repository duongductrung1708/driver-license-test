# Hướng dẫn thêm hình ảnh cho câu hỏi

## Cách thêm hình ảnh:

1. **Đặt hình ảnh vào thư mục này** (`public/images/`)
2. **Định dạng hỗ trợ**: PNG, JPG, JPEG, GIF, SVG
3. **Kích thước khuyến nghị**:
   - Chiều rộng: 300-800px
   - Chiều cao: 200-400px
   - Dung lượng: < 500KB

## Cách sử dụng trong câu hỏi:

Trong file `src/data/questions.json`, thêm trường `image` vào câu hỏi:

```json
{
  "id": 15,
  "question": "Biển báo nào dưới đây báo hiệu đường một chiều?",
  "image": "/images/bien-bao-duong-mot-chieu.png",
  "answers": ["Biển số 101", "Biển số 102", "Biển số 103", "Biển số 104"],
  "correctAnswer": 1,
  "isDiemLiet": false,
  "explanation": "Biển số 102 báo hiệu đường một chiều."
}
```

## Lưu ý:

- Đường dẫn bắt đầu bằng `/images/` (không cần `public`)
- Tên file nên có ý nghĩa và dễ hiểu
- Hình ảnh sẽ tự động ẩn nếu không tải được
- Hỗ trợ responsive trên các thiết bị khác nhau

## Ví dụ tên file:

- `bien-bao-duong-hai-chieu.png`
- `vach-ke-duong-phan-chia.jpg`
- `den-giao-thong-xanh.png`
- `bien-cam-xe-mo-to.svg`
