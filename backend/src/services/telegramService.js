const axios = require('axios');
const config = require('../config');
const { normalizeTelegram } = require('./messageNormalizer');

let isPolling = false;
let lastUpdateId = 0;

const telegramService = {
  /**
   * Kiểm tra thông tin Bot (Xác thực Bot Token)
   */
  async getMe() {
    if (!config.telegram.botToken) {
      throw new Error('Chưa cấu hình TELEGRAM_BOT_TOKEN trong file .env');
    }
    const url = `https://api.telegram.org/bot${config.telegram.botToken}/getMe`;
    const res = await axios.get(url);
    return res.data;
  },

  /**
   * Gửi tin nhắn trả lời người dùng Telegram
   */
  async sendMessage(chatId, text) {
    if (!config.telegram.botToken) {
      console.warn('[Telegram] Bỏ qua gửi tin nhắn vì chưa cấu hình TELEGRAM_BOT_TOKEN.');
      return { ok: false, error: 'Chưa có token' };
    }

    try {
      const url = `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`;
      const res = await axios.post(url, {
        chat_id: chatId,
        text: text,
      });
      return res.data;
    } catch (err) {
      console.error('[Telegram API Error]', err.response?.data || err.message);
      throw err;
    }
  },

  /**
   * Đăng ký Webhook URL với Telegram
   */
  async setWebhook(webhookUrl) {
    if (!config.telegram.botToken) {
      throw new Error('Chưa cấu hình TELEGRAM_BOT_TOKEN');
    }
    const url = `https://api.telegram.org/bot${config.telegram.botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
    const res = await axios.get(url);
    return res.data;
  },

  /**
   * Xóa Webhook (để chuyển sang dùng Polling nếu muốn)
   */
  async deleteWebhook() {
    if (!config.telegram.botToken) return;
    const url = `https://api.telegram.org/bot${config.telegram.botToken}/deleteWebhook`;
    await axios.get(url);
  },

  /**
   * Chế độ Polling cực tiện lợi cho DEV LOCAL (không cần ngrok vẫn nhận tin nhắn!)
   */
  async startPolling(onMessageCallback) {
    if (!config.telegram.botToken) {
      console.log('[Telegram Polling] Chưa có TELEGRAM_BOT_TOKEN, chế độ Polling sẽ tạm tắt.');
      return;
    }

    try {
      // Khi dùng polling thì xóa webhook trước để tránh xung đột
      await this.deleteWebhook();
      console.log('[Telegram Polling] Đang kích hoạt chế độ lắng nghe tin nhắn trực tiếp (Long-Polling)...');

      isPolling = true;

      // Vòng lặp tuần tự ngăn chặn lỗi 409 Conflict
      const pollLoop = async () => {
        while (isPolling) {
          try {
            const url = `https://api.telegram.org/bot${config.telegram.botToken}/getUpdates?offset=${lastUpdateId + 1}&timeout=10`;
            const res = await axios.get(url, { timeout: 15000 });
            const updates = res.data?.result || [];

            for (const update of updates) {
              lastUpdateId = update.update_id;
              const normalized = normalizeTelegram(update);
              if (normalized && onMessageCallback) {
                onMessageCallback(normalized);
              }
            }
          } catch (err) {
            if (err.response?.status === 409) {
              console.warn('[Telegram Polling] Đang có tiến trình khác gọi getUpdates, đợi 3s...');
              await new Promise((r) => setTimeout(r, 3000));
            } else if (err.code !== 'ECONNABORTED') {
              console.error('[Telegram Polling Error]', err.message);
              await new Promise((r) => setTimeout(r, 2000));
            }
          }
        }
      };

      pollLoop();
    } catch (err) {
      console.error('[Telegram Polling Init Error]', err.message);
    }
  },

  stopPolling() {
    isPolling = false;
  }
};

module.exports = telegramService;
