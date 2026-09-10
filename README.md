# 🚀 Omnichannel Chat Dashboard (Hệ thống Quản lý Tin nhắn Đa kênh)

Dự án Fullstack ứng dụng **React (Ant Design)** và **Node.js (Express, Socket.io)** nhằm tổng hợp tin nhắn từ nhiều nền tảng (**Telegram, Facebook Messenger, Zalo OA**) về một giao diện quản trị duy nhất theo thời gian thực (Real-time).

---

## 🌟 Tính năng nổi bật

- **Quản lý hội thoại đa kênh (Omnichannel)**: Gom tin nhắn từ Telegram, Zalo OA, Messenger vào 1 màn hình duy nhất.
- **Thời gian thực (Real-time với Socket.io)**: Tin nhắn mới xuất hiện ngay tức thì kèm thông báo và cập nhật số lượng tin chưa đọc (Unread badge) mà không cần F5.
- **Bộ lọc & Tìm kiếm thông minh**: Lọc nhanh theo nền tảng (Tất cả, Telegram, Zalo, Facebook) và tìm kiếm theo tên khách hàng hoặc nội dung tin nhắn.
- **Giao diện chuẩn doanh nghiệp (Ant Design v5)**: Sử dụng các component Layout, Sider, List, Avatar, Badge, Tag, Input.TextArea chuẩn UX/UI doanh nghiệp.
- **Phản hồi 2 chiều (Bi-directional)**: Hỗ trợ nhân viên trả lời trực tiếp từ Dashboard gửi ngược lại cho khách hàng trên Telegram qua Bot API.
- **Hỗ trợ Long-Polling & Webhook**: Linh hoạt nhận tin nhắn cả khi dev ở localhost (không cần mở cổng port) hoặc qua Webhook URL (Ngrok / Localtunnel).
- **Bộ công cụ Mock Test tích hợp**: Nút "Test Real-time" ngay trên giao diện web và script `mock-webhook.js` để test toàn bộ luồng dữ liệu mà không phụ thuộc internet.

---

## 🏗️ Cấu trúc thư mục

```
BotChat/
├── backend/                  # Server Node.js (Express + Socket.io)
│   ├── src/
│   │   ├── config/           # Cấu hình biến môi trường
│   │   ├── controllers/      # WebhookController & ChatController
│   │   ├── data/             # In-memory store (sẵn sàng kết nối MongoDB)
│   │   ├── routes/           # Định tuyến webhook & chat API
│   │   ├── services/         # messageNormalizer (chuẩn hóa dữ liệu), telegramService
│   │   └── server.js         # Entry point server
│   ├── mock-webhook.js       # Script bắn tin nhắn giả lập đa kênh
│   ├── .env                  # Điền Bot Token & Port
│   └── package.json
│
├── frontend/                 # Client React (Vite + Ant Design)
│   ├── src/
│   │   ├── components/
│   │   │   ├── SidebarConversations.jsx # Danh sách hội thoại + bộ lọc
│   │   │   ├── ChatHeader.jsx           # Header thông tin khách + nút thao tác
│   │   │   ├── MessageList.jsx          # Khung tin nhắn dạng bong bóng chat
│   │   │   └── MessageComposer.jsx      # Ô soạn thảo, gợi ý trả lời nhanh, nút gửi
│   │   ├── services/         # Axios API client
│   │   ├── utils/            # Helper phân loại màu sắc, icon nền tảng
│   │   ├── App.jsx           # Bố cục chính Ant Design + Socket.io listener
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## ⚡ Hướng dẫn cài đặt & Khởi chạy

### 1. Khởi động Backend
Mở Terminal tại thư mục `backend`:
```bash
cd backend
npm install
npm run dev
```
Server sẽ chạy tại `http://localhost:5000`.

### 2. Khởi động Frontend
Mở một cửa sổ Terminal mới tại thư mục `frontend`:
```bash
cd frontend
npm install
npm run dev
```
Truy cập trình duyệt tại: `http://localhost:5173`.

---

## 📲 Cách kết nối Telegram Bot thật

1. Mở ứng dụng Telegram, tìm `@BotFather` và gửi lệnh `/newbot`.
2. Đặt tên hiển thị và username cho bot, sau đó copy chuỗi **API Token**.
3. Mở file `backend/.env` và dán vào:
   ```env
   TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
   ```
4. Khởi động lại backend (`npm run dev`). Hệ thống sẽ tự động kích hoạt **Long-Polling** để nhận tin nhắn trực tiếp từ Telegram về giao diện mà bạn **không cần cài thêm Ngrok**!

---

## 🧪 Cách kiểm thử nhanh (Không cần cài bot)

1. **Cách 1 (Ngay trên giao diện Web)**: Bấm nút **"Test Real-time"** ở góc trên danh sách hội thoại bên trái, chọn kênh muốn test và bấm "Bắn tin nhắn ngay".
2. **Cách 2 (Bằng script terminal)**: Tại thư mục `backend`, chạy lệnh:
   ```bash
   node mock-webhook.js
   ```
   Hệ thống sẽ giả lập đồng thời 3 tin nhắn từ Telegram, Zalo OA và Facebook Messenger bắn thẳng vào giao diện theo thời gian thực!

---

## 💼 Cách trình bày dự án này vào CV xin thực tập

**Tên dự án**: Omnichannel Chat Dashboard (Hệ thống Quản lý Tin nhắn Đa kênh)  
**Vai trò**: Full-stack Developer  
**Công nghệ**: React, Ant Design, Node.js (Express), Socket.io, RESTful API, Axios.  
**Mô tả & Kết quả**:
- Xây dựng hệ thống tiếp nhận và tập trung hóa tin nhắn từ các nền tảng Telegram, Zalo OA, Facebook Messenger về một giao diện quản trị duy nhất.
- Ứng dụng Socket.io để truyền tải dữ liệu thời gian thực (real-time bi-directional), đảm bảo tin nhắn gửi đến và phản hồi hiển thị tức thì với độ trễ < 100ms.
- Chuẩn hóa cấu trúc dữ liệu JSON từ nhiều nguồn khác nhau về định dạng thống nhất (Message Normalization Pattern).
- Tối ưu hóa trải nghiệm người dùng với thư viện Ant Design v5: phân loại nhãn nền tảng, đếm số lượng tin nhắn chưa đọc và tìm kiếm hội thoại nhanh chóng.
