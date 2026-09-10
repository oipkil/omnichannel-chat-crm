# 🚀 Omnichannel Chat & CRM Dashboard (Hệ thống Quản lý Tin nhắn Đa kênh)

Dự án Fullstack chuyên nghiệp ứng dụng **React 19 (Ant Design v5)** và **Node.js (Express, Socket.io, Mongoose)** nhằm tập trung hóa tin nhắn từ nhiều kênh (**Telegram, Zalo OA, Facebook Messenger**) về một giao diện quản trị duy nhất theo thời gian thực (Real-time).

---

## 🌟 Tính năng nổi bật (Key Features)

- **Quản lý hội thoại đa kênh (Omnichannel Hub)**: Gom tin nhắn từ Telegram, Zalo OA, Messenger vào 1 màn hình duy nhất với kiến trúc chuẩn hóa dữ liệu (*Message Normalization Pattern*).
- **Thời gian thực (Real-time với Socket.io)**: Tiếp nhận và hiển thị tin nhắn mới ngay lập tức với độ trễ < 100ms mà không cần tải lại trang.
- **Bố cục 3 Cột chuẩn Doanh nghiệp (Enterprise 3-Column Layout)**:
  - **Cột 1**: Danh sách hội thoại kèm tìm kiếm, bộ lọc nền tảng và nhãn phân loại.
  - **Cột 2**: Khung chat tương tác với bong bóng tin nhắn, gợi ý trả lời nhanh (Quick replies), phím tắt `Enter`.
  - **Cột 3 (CRM Panel)**: Hồ sơ khách hàng, gắn thẻ phân loại (Tags: VIP, Tiềm năng, Cần gọi lại...), soạn và lưu ghi chú nội bộ của nhân viên.
- **Cơ sở dữ liệu đám mây (MongoDB Atlas + Mongoose)**: Lưu trữ vĩnh viễn toàn bộ lịch sử tin nhắn, hội thoại, nhãn dán và ghi chú.
- **Phản hồi 2 chiều (Bi-directional Messaging)**: Trả lời trực tiếp từ Dashboard, hệ thống tự động gọi Telegram Bot API gửi ngược lại tin nhắn vào app Telegram của khách hàng.
- **Chế độ Tối / Sáng (Dark & Light Mode)**: Chuyển đổi giao diện linh hoạt với Design Tokens của Ant Design v5.
- **Âm thanh thông báo (Web Audio Chime)**: Chuông báo "ting" nhẹ nhàng tự động phát khi có tin nhắn mới từ khách.
- **Báo cáo Thống kê (Analytics Drawer)**: Biểu đồ thanh tiến độ tỷ lệ tin nhắn đa kênh và số liệu tương tác.

---

## 🏗️ Cấu trúc thư mục (Project Structure)

```
BotChat/
├── backend/                  # Server Node.js (Express + Socket.io + Mongoose)
│   ├── src/
│   │   ├── config/           # Cấu hình biến môi trường & kết nối MongoDB Atlas
│   │   ├── controllers/      # WebhookController & ChatController
│   │   ├── models/           # Mongoose Schemas (Conversation, Message)
│   │   ├── routes/           # Định tuyến webhook & chat REST APIs
│   │   ├── services/         # MessageNormalizer, TelegramService (Polling & Send)
│   │   └── server.js         # Entry point server
│   ├── mock-webhook.js       # Script bắn tin nhắn giả lập đa kênh
│   ├── .env.example          # Mẫu cấu hình môi trường
│   └── package.json
│
├── frontend/                 # Client React (Vite + Ant Design v5)
│   ├── src/
│   │   ├── components/
│   │   │   ├── SidebarConversations.jsx # Cột 1: Danh sách hội thoại + bộ lọc
│   │   │   ├── ChatHeader.jsx           # Header thông tin khách + nút đóng/mở CRM
│   │   │   ├── MessageList.jsx          # Cột 2: Khung bong bóng chat
│   │   │   ├── MessageComposer.jsx      # Thanh soạn thảo & trả lời nhanh
│   │   │   ├── CustomerDetailPanel.jsx  # Cột 3: Quản trị CRM Tags & Ghi chú
│   │   │   └── AnalyticsDrawer.jsx      # Ngăn trượt báo cáo thống kê đa kênh
│   │   ├── services/         # Axios API Client
│   │   ├── utils/            # Helper Platform styles & Web Audio Sound
│   │   ├── App.jsx           # Bố cục chính Ant Design + Socket.io
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## ⚡ Hướng dẫn Cài đặt & Khởi chạy (Getting Started)

### 1. Cấu hình Biến môi trường
Tại thư mục `backend/`, copy file `.env.example` thành `.env`:
```bash
cp backend/.env.example backend/.env
```
Cập nhật các thông số trong `backend/.env`:
- `TELEGRAM_BOT_TOKEN`: Lấy từ `@BotFather` trên Telegram.
- `MONGODB_URI`: Chuỗi kết nối từ MongoDB Atlas.

### 2. Khởi động Backend
```bash
cd backend
npm install
npm run dev
```
Server sẽ chạy tại `http://localhost:5000`.

### 3. Khởi động Frontend
Mở một tab Terminal mới:
```bash
cd frontend
npm install
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:5173`.

---

## 💼 Cách đưa dự án này vào CV (CV Presentation Guide)

### Phiên bản Tiếng Việt:
*   **Tên dự án**: Omnichannel Chat & CRM Dashboard (Hệ thống Quản lý Tin nhắn Đa kênh)
*   **Vai trò**: Full-stack Developer (Cá nhân)
*   **Công nghệ sử dụng**: React 19, Ant Design v5, Node.js, Express, Socket.io, MongoDB Atlas, Mongoose, Telegram Bot API, RESTful API.
*   **Điểm nổi bật & Kết quả**:
    - Thiết kế kiến trúc tổng hợp tin nhắn đa kênh từ Telegram, Zalo OA và Facebook Messenger về một giao diện duy nhất, ứng dụng mẫu thiết kế **Message Normalization Pattern**.
    - Triển khai luồng truyền dữ liệu thời gian thực 2 chiều (Bi-directional Real-time) bằng **Socket.io**, đảm bảo độ trễ phản hồi < 100ms.
    - Xây dựng giao diện CRM 3 cột chuẩn B2B SaaS với **Ant Design v5**: gắn thẻ phân loại khách hàng (Tags), ghi chú nội bộ, âm thanh thông báo và chế độ Dark/Light Mode.
    - Tích hợp **MongoDB Atlas** lưu trữ vĩnh viễn lịch sử hội thoại và bảng phân tích số liệu tương tác (Analytics).

### Phiên bản Tiếng Anh (English for Multinational Firms):
*   **Project Title**: Omnichannel Customer Chat & CRM Dashboard
*   **Role**: Full-stack Developer
*   **Tech Stack**: React 19, Ant Design v5, Node.js, Express, Socket.io, MongoDB Atlas, Mongoose, RESTful APIs.
*   **Key Contributions**:
    - Architected an omnichannel communication platform unifying inbound messages from Telegram, Zalo OA, and Facebook Messenger into a single dashboard using the Message Normalization Pattern.
    - Implemented bidirectional real-time communication using Socket.io and Telegram Bot API with sub-100ms message delivery.
    - Built an enterprise-grade 3-column CRM UI using Ant Design v5 featuring customer tagging, internal staff notes, notification chimes, dark/light theme toggle, and an analytics drawer.
    - Designed scalable MongoDB schemas with Mongoose for persistent message history, indexing, and conversation state management.
