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

## 🏛️ Luồng xử lý dữ liệu (Architecture & Data Flow)

```text
[ Telegram / Zalo / Facebook ] 
              │
      (Webhook / Polling)
              ▼
   [ Node.js Backend Server ]
              │
    ┌─────────┴─────────┐
    ▼                   ▼
[ Message Normalizer ]  [ MongoDB Atlas ]
(Gom về 1 JSON chuẩn)   (Lưu trữ vĩnh viễn)
    │
    ▼
[ Socket.io Server ]
    │ (Real-time Broadcast < 100ms)
    ▼
[ React + Ant Design Dashboard ]
(Cập nhật UI 3 cột, phát âm thanh, tăng badge chưa đọc)
```

---

## 📡 Danh sách API Endpoints

| Phương thức | Đường dẫn (Route) | Chức năng |
| :--- | :--- | :--- |
| `GET` | `/api/chat/conversations` | Lấy danh sách toàn bộ cuộc hội thoại từ MongoDB |
| `GET` | `/api/chat/conversations/:id/messages` | Lấy lịch sử tin nhắn của một hội thoại |
| `POST` | `/api/chat/messages` | Gửi tin nhắn trả lời từ Dashboard tới khách |
| `PUT` | `/api/chat/conversations/:id` | Cập nhật thẻ phân loại (Tags) và Ghi chú nội bộ |
| `PUT` | `/api/chat/conversations/:id/read` | Đánh dấu hội thoại là đã đọc |
| `POST` | `/api/webhook/telegram` | Tiếp nhận Webhook tin nhắn từ Telegram |
| `POST` | `/api/webhook/facebook` | Tiếp nhận Webhook tin nhắn từ Messenger |
| `POST` | `/api/webhook/zalo` | Tiếp nhận Webhook tin nhắn từ Zalo OA |
| `POST` | `/api/webhook/mock` | Endpoint giả lập tin nhắn phục vụ kiểm thử |

---

## 📄 Bản quyền (License)

Dự án được phát hành dưới giấy phép mã nguồn mở [MIT License](LICENSE).
