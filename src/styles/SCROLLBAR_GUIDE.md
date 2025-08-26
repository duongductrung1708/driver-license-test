# Custom Scrollbar Guide

## Tổng quan

Dự án này có 2 file CSS để tùy chỉnh thanh scrollbar:

1. `scrollbar.css` - Scrollbar mặc định với thiết kế gradient đẹp
2. `scrollbar-variants.css` - 8 biến thể scrollbar khác nhau

## Cách sử dụng

### 1. Scrollbar mặc định

File `scrollbar.css` đã được import tự động và sẽ áp dụng cho toàn bộ ứng dụng.

### 2. Sử dụng các biến thể

Để sử dụng các biến thể khác, thêm class tương ứng vào element:

```jsx
// Ví dụ sử dụng trong React component
<div className="scrollbar-minimal">
  {/* Nội dung có scroll */}
</div>

<div className="scrollbar-neon">
  {/* Nội dung có scroll với hiệu ứng neon */}
</div>
```

## Danh sách các biến thể

### 1. Minimal Modern (`.scrollbar-minimal`)

- Thanh scrollbar mỏng, tối giản
- Phù hợp cho giao diện clean và modern

### 2. Rounded Elegant (`.scrollbar-rounded`)

- Thanh scrollbar tròn với gradient màu sắc
- Thiết kế thanh lịch, phù hợp cho ứng dụng cao cấp

### 3. Neon Glow (`.scrollbar-neon`)

- Hiệu ứng phát sáng neon
- Phù hợp cho giao diện gaming hoặc futuristic

### 4. Material Design (`.scrollbar-material`)

- Tuân theo nguyên tắc Material Design
- Phù hợp cho ứng dụng Android/Google style

### 5. Glass Morphism (`.scrollbar-glass`)

- Hiệu ứng kính mờ với backdrop blur
- Phù hợp cho giao diện hiện đại với background phức tạp

### 6. Dark Theme Optimized (`.scrollbar-dark`)

- Tối ưu cho dark theme
- Gradient màu tối với độ tương phản tốt

### 7. Animated Gradient (`.scrollbar-animated`)

- Gradient chuyển động liên tục
- Tạo hiệu ứng sinh động cho giao diện

### 8. Thin Line (`.scrollbar-thin`)

- Thanh scrollbar rất mỏng
- Phù hợp khi muốn tiết kiệm không gian

## Áp dụng cho toàn bộ ứng dụng

Để thay đổi scrollbar cho toàn bộ ứng dụng, thêm class vào thẻ `<body>` hoặc `<html>`:

```jsx
// Trong App.jsx hoặc component chính
useEffect(() => {
  document.body.className = "scrollbar-neon"; // hoặc class khác
}, []);
```

## Responsive Design

Tất cả scrollbar đều được tối ưu cho mobile:

- Tự động giảm kích thước trên màn hình nhỏ
- Duy trì tính thẩm mỹ trên mọi thiết bị

## Browser Support

- **Chrome/Safari/Edge**: Hỗ trợ đầy đủ với `-webkit-scrollbar`
- **Firefox**: Hỗ trợ cơ bản với `scrollbar-width` và `scrollbar-color`
- **IE**: Không hỗ trợ (sẽ hiển thị scrollbar mặc định)

## Tùy chỉnh thêm

Bạn có thể tùy chỉnh màu sắc và kích thước bằng cách chỉnh sửa các biến CSS:

```css
/* Ví dụ tùy chỉnh màu sắc */
.scrollbar-custom::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

## Lưu ý

- Scrollbar sẽ tự động thích ứng với dark/light theme
- Có animation mượt mà khi hover
- Tương thích với smooth scrolling
- Không ảnh hưởng đến performance
