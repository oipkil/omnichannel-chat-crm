const store = require('../data/store');
const telegramService = require('../services/telegramService');

module.exports = (io) => ({
  // Lấy danh sách toàn bộ cuộc hội thoại
  getConversations: async (req, res) => {
    try {
      const list = await store.getConversations();
      res.json({ success: true, data: list });
    } catch (err) {
      console.error('[Get Conversations Error]', err);
      res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách hội thoại' });
    }
  },

  // Lấy lịch sử tin nhắn của một hội thoại cụ thể
  getMessages: async (req, res) => {
    try {
      const { conversationId } = req.params;
      const messages = await store.getMessages(conversationId);
      res.json({ success: true, data: messages });
    } catch (err) {
      console.error('[Get Messages Error]', err);
      res.status(500).json({ success: false, message: 'Lỗi khi tải tin nhắn' });
    }
  },

  // Gửi tin nhắn trả lời từ Dashboard xuống khách hàng
  sendMessage: async (req, res) => {
    try {
      const { conversationId, content } = req.body;
      if (!conversationId || !content) {
        return res.status(400).json({ success: false, message: 'Thiếu conversationId hoặc content' });
      }

      const conversation = await store.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy cuộc hội thoại' });
      }

      // 1. Nếu là Telegram -> Gọi Telegram Bot API để gửi tin nhắn thật đến điện thoại khách
      if (conversation.platform === 'telegram') {
        try {
          await telegramService.sendMessage(conversation.senderId, content);
          console.log(`📤 [Telegram Response Sent] Tới ${conversation.senderName} (${conversation.senderId}): "${content}"`);
        } catch (apiErr) {
          console.warn('Lưu ý: Không thể gửi qua Telegram API (có thể do sai token hoặc chat_id test):', apiErr.message);
        }
      }

      // 2. Lưu tin nhắn vào store với vai trò 'outbound' (nhân viên gửi)
      const { message, conversation: updatedConv } = await store.addMessage({
        conversationId: conversation.id,
        platform: conversation.platform,
        senderId: 'agent',
        senderName: 'Bạn (Support)',
        content,
        direction: 'outbound',
      });

      // 3. Phát Socket.io để cập nhật giao diện
      if (io) {
        io.emit('new_message', { message, conversation: updatedConv });
      }

      res.json({ success: true, data: message });
    } catch (err) {
      console.error('[Send Message Error]', err);
      res.status(500).json({ success: false, message: 'Lỗi server khi gửi tin nhắn' });
    }
  },

  // Đánh dấu đã đọc
  markAsRead: async (req, res) => {
    try {
      const { conversationId } = req.params;
      const updated = await store.markAsRead(conversationId);
      if (io && updated) {
        io.emit('conversation_updated', updated);
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error('[Mark As Read Error]', err);
      res.status(500).json({ success: false, message: 'Lỗi khi đánh dấu đã đọc' });
    }
  },

  // Cập nhật thông tin hội thoại (Tags, Notes)
  updateConversation: async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { tags, notes } = req.body;
      const updatePayload = {};
      if (tags !== undefined) updatePayload.tags = tags;
      if (notes !== undefined) updatePayload.notes = notes;

      const updated = await store.updateConversation(conversationId, updatePayload);
      if (io && updated) {
        io.emit('conversation_updated', updated);
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error('[Update Conversation Error]', err);
      res.status(500).json({ success: false, message: 'Lỗi khi cập nhật hội thoại' });
    }
  }
});
