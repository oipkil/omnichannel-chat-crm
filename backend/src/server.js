const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const config = require('./config');
const { connectDB } = require('./config/db');
const telegramService = require('./services/telegramService');

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP & Socket.io Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// Real-time Socket.io
io.on('connection', (socket) => {
  console.log(`🔌 [Socket.io] Client mới kết nối (ID: ${socket.id})`);

  socket.on('disconnect', () => {
    console.log(`❌ [Socket.io] Client đã ngắt kết nối (ID: ${socket.id})`);
  });
});

// Import & Mount Routes
const webhookRoutes = require('./routes/webhookRoutes')(io);
const chatRoutes = require('./routes/chatRoutes')(io);
const webhookController = require('./controllers/webhookController')(io);

app.use('/api/webhook', webhookRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    telegramTokenConfigured: Boolean(config.telegram.botToken),
  });
});

// Start Server
connectDB().finally(() => {
  server.listen(config.port, () => {
  console.log('====================================================');
  console.log(`🚀 Omnichannel Chat Backend đang chạy tại http://localhost:${config.port}`);
  console.log(`📡 Socket.io sẵn sàng lắng nghe kết nối từ Frontend`);
  console.log(`🔗 Webhook Endpoints:`);
  console.log(`   - Telegram: POST http://localhost:${config.port}/api/webhook/telegram`);
  console.log(`   - Facebook: GET/POST http://localhost:${config.port}/api/webhook/facebook`);
  console.log(`   - Zalo:     POST http://localhost:${config.port}/api/webhook/zalo`);
  console.log(`   - Test Mock:POST http://localhost:${config.port}/api/webhook/mock`);
  console.log('====================================================');

  // Nếu có cấu hình Telegram Token, tự động bật chế độ Polling cho môi trường local
  if (config.telegram.botToken) {
    telegramService.startPolling((normalizedMsg) => {
      webhookController.processIncomingMessage(normalizedMsg);
    });
  } else {
    console.log('💡 Mẹo: Điền TELEGRAM_BOT_TOKEN vào file backend/.env để nhận tin nhắn trực tiếp từ Telegram!');
  }
  });
});

module.exports = { app, server, io };
