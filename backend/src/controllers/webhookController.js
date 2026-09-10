const store = require('../data/store');
const {
  normalizeTelegram,
  normalizeFacebook,
  normalizeZalo,
} = require('../services/messageNormalizer');
const config = require('../config');

// Helper xử lý khi có tin nhắn mới đã chuẩn hóa
async function processIncomingMessage(io, normalized) {
  if (!normalized || !normalized.content) return;

  console.log(`\n📬 [${normalized.platform.toUpperCase()}] ${normalized.senderName}: "${normalized.content}"`);

  // Lưu vào store / MongoDB
  const { message, conversation } = await store.addMessage({
    platform: normalized.platform,
    senderId: normalized.senderId,
    senderName: normalized.senderName,
    content: normalized.content,
    direction: 'inbound',
  });

  // Bắn dữ liệu real-time xuống tất cả client Ant Design đang mở
  if (io) {
    io.emit('new_message', { message, conversation });
  }

  return { message, conversation };
}

module.exports = (io) => ({
  processIncomingMessage: (normalized) => processIncomingMessage(io, normalized),

  // Telegram Webhook
  handleTelegram: async (req, res) => {
    try {
      const normalized = normalizeTelegram(req.body);
      if (normalized) {
        await processIncomingMessage(io, normalized);
      }
      res.status(200).send('OK');
    } catch (err) {
      console.error('[Telegram Webhook Error]', err);
      res.status(500).send('Internal Error');
    }
  },

  // Facebook Messenger Webhook
  verifyFacebook: (req, res) => {
    // Xác thực token do Meta gửi đến khi cài đặt Webhook
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === config.facebook.verifyToken) {
      console.log('✅ Facebook Webhook đã xác thực thành công!');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  },

  handleFacebook: async (req, res) => {
    try {
      const normalized = normalizeFacebook(req.body);
      if (normalized) {
        await processIncomingMessage(io, normalized);
      }
      res.status(200).send('EVENT_RECEIVED');
    } catch (err) {
      console.error('[Facebook Webhook Error]', err);
      res.status(500).send('Internal Error');
    }
  },

  // Zalo OA Webhook
  handleZalo: async (req, res) => {
    try {
      const normalized = normalizeZalo(req.body);
      if (normalized) {
        await processIncomingMessage(io, normalized);
      }
      res.status(200).json({ error: 0, message: 'Success' });
    } catch (err) {
      console.error('[Zalo Webhook Error]', err);
      res.status(500).send('Internal Error');
    }
  },

  // Giả lập tin nhắn (Mock endpoint) phục vụ test nhanh
  handleMock: async (req, res) => {
    const { platform = 'telegram', senderName = 'Khách Test', content = 'Tin nhắn thử nghiệm' } = req.body;
    const senderId = req.body.senderId || `user_${Date.now().toString().slice(-4)}`;

    const normalized = {
      platform,
      senderId,
      senderName,
      content,
    };

    const result = await processIncomingMessage(io, normalized);
    res.status(200).json({ success: true, ...result });
  }
});
