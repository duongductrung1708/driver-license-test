# Tính năng Dark Mode và Điều chỉnh Cỡ chữ

## Tổng quan

Ứng dụng Driver License Test đã được cập nhật với các tính năng mới:

- **Dark Mode/Light Mode**: Chuyển đổi giữa chế độ tối và sáng
- **Điều chỉnh cỡ chữ**: Tùy chỉnh kích thước chữ từ 12px đến 24px
- **Lưu trữ cài đặt**: Tự động lưu và khôi phục cài đặt của người dùng

## Cách sử dụng

### 1. Nút Cài đặt

- Nhấp vào nút ⚙️ (Settings) ở góc trên bên phải màn hình
- Một dialog sẽ mở ra với các tùy chọn cài đặt

### 2. Chuyển đổi Theme

- Trong dialog Settings, tìm phần "Giao diện"
- Sử dụng switch để chuyển đổi giữa Light Mode và Dark Mode
- Thay đổi sẽ được áp dụng ngay lập tức

### 3. Điều chỉnh Cỡ chữ

- Trong dialog Settings, tìm phần "Cỡ chữ"
- Sử dụng các nút + và - để tăng/giảm cỡ chữ
- Hoặc kéo thanh trượt để chọn cỡ chữ mong muốn
- Nhấn "Đặt lại cỡ chữ" để trở về kích thước mặc định (16px)

### 4. Xem trước

- Phần "Xem trước" trong dialog Settings hiển thị cách văn bản sẽ trông với cài đặt hiện tại
- Bao gồm các cấp độ tiêu đề và văn bản thường

## Thông tin hiển thị

### ThemeInfo (Góc dưới bên trái)

- Hiển thị chế độ theme hiện tại (🌙 Dark hoặc ☀️ Light)
- Hiển thị cỡ chữ hiện tại (ví dụ: 16px)

### Thông báo

- Khi thay đổi theme hoặc cỡ chữ, một thông báo sẽ xuất hiện ở góc dưới bên phải
- Thông báo sẽ tự động biến mất sau 3 giây

## Lưu trữ

- Tất cả cài đặt được lưu trong localStorage của trình duyệt
- Cài đặt sẽ được khôi phục khi bạn quay lại ứng dụng
- Không cần đăng nhập để lưu cài đặt

## Tính năng bổ sung

### Accessibility

- Hỗ trợ high contrast mode
- Hỗ trợ reduced motion
- Focus styles cho keyboard navigation

### Responsive Design

- Tất cả components đều responsive
- Hoạt động tốt trên mobile và desktop

### Performance

- Smooth transitions giữa các theme
- Tối ưu hóa re-renders
- Lazy loading cho các components

## Cấu trúc Code

### Files chính

- `src/context/ThemeContext.jsx`: Context để quản lý theme state
- `src/components/Settings.jsx`: Dialog cài đặt chính
- `src/components/ThemeNotification.jsx`: Thông báo thay đổi
- `src/components/ThemeInfo.jsx`: Hiển thị thông tin theme
- `src/hooks/useAppTheme.js`: Hook tùy chỉnh để sử dụng theme
- `src/styles/theme.css`: CSS tùy chỉnh cho theme

### Sử dụng trong Components

```javascript
import { useTheme } from "../context/ThemeContext";

const MyComponent = () => {
  const { darkMode, fontSize, toggleDarkMode } = useTheme();

  return (
    <div>
      <button onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
};
```

## Troubleshooting

### Cài đặt không được lưu

- Kiểm tra xem trình duyệt có hỗ trợ localStorage không
- Thử xóa cache và reload trang

### Theme không thay đổi

- Kiểm tra console để xem có lỗi JavaScript không
- Đảm bảo tất cả dependencies đã được cài đặt

### Font size không hoạt động

- Kiểm tra xem có CSS conflicts không
- Đảm bảo Material-UI theme được áp dụng đúng cách
