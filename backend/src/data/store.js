const ConversationModel = require('../models/Conversation');
const MessageModel = require('../models/Message');
const { getIsConnected } = require('../config/db');

// In-memory fallback data store
const memoryConversations = new Map();
const memoryMessages = [];

// Seed sample data for in-memory fallback
function seedInitialData() {
  const seedList = [
    {
      id: 'telegram_demo_user',
      platform: 'telegram',
      senderId: 'demo_tele_01',
      senderName: 'Nguyễn Văn An (Telegram)',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An',
      lastMessage: 'Chào bạn, bên mình còn nhận thực tập sinh không?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      unreadCount: 1,
    },
    {
      id: 'facebook_demo_user',
      platform: 'facebook',
      senderId: 'demo_fb_02',
      senderName: 'Trần Thị Mai (Facebook)',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mai',
      lastMessage: 'Dạ em cảm ơn anh nhiều ạ!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      unreadCount: 0,
    },
    {
      id: 'zalo_demo_user',
      platform: 'zalo',
      senderId: 'demo_zalo_03',
      senderName: 'Lê Hoàng Nam (Zalo)',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nam',
      lastMessage: 'Cho mình xin bảng giá dịch vụ với ạ',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      unreadCount: 2,
    },
  ];

  seedList.forEach((c) => memoryConversations.set(c.id, c));

  memoryMessages.push(
    {
      id: 'msg_01',
      conversationId: 'telegram_demo_user',
      platform: 'telegram',
      senderId: 'demo_tele_01',
      senderName: 'Nguyễn Văn An (Telegram)',
      direction: 'inbound',
      content: 'Chào bạn, bên mình còn nhận thực tập sinh không?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 'msg_02',
      conversationId: 'facebook_demo_user',
      platform: 'facebook',
      senderId: 'demo_fb_02',
      senderName: 'Trần Thị Mai (Facebook)',
      direction: 'inbound',
      content: 'Em muốn hỏi về dự án Omnichannel Chat ạ',
      timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    },
    {
      id: 'msg_03',
      conversationId: 'facebook_demo_user',
      platform: 'facebook',
      senderId: 'agent',
      senderName: 'Bạn (Support)',
      direction: 'outbound',
      content: 'Chào em, dự án này kết hợp React Antd và Node.js rất hay nhé!',
      timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    },
    {
      id: 'msg_04',
      conversationId: 'facebook_demo_user',
      platform: 'facebook',
      senderId: 'demo_fb_02',
      senderName: 'Trần Thị Mai (Facebook)',
      direction: 'inbound',
      content: 'Dạ em cảm ơn anh nhiều ạ!',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'msg_05',
      conversationId: 'zalo_demo_user',
      platform: 'zalo',
      senderId: 'demo_zalo_03',
      senderName: 'Lê Hoàng Nam (Zalo)',
      direction: 'inbound',
      content: 'Cho mình xin bảng giá dịch vụ với ạ',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    }
  );
}

seedInitialData();

const store = {
  /**
   * Lấy danh sách toàn bộ hội thoại
   */
  async getConversations() {
    if (getIsConnected()) {
      try {
        let convs = await ConversationModel.find().sort({ lastMessageTime: -1 }).lean();
        if (convs.length === 0) {
          // Tự động khởi tạo dữ liệu mẫu đa kênh nếu Database mới tinh
          await ConversationModel.insertMany(Array.from(memoryConversations.values()));
          await MessageModel.insertMany(memoryMessages);
          convs = await ConversationModel.find().sort({ lastMessageTime: -1 }).lean();
          console.log('🌱 [MongoDB] Đã khởi tạo dữ liệu mẫu đa kênh ban đầu vào Database.');
        }
        return convs;
      } catch (err) {
        console.error('[MongoDB Error] getConversations:', err.message);
      }
    }
    return Array.from(memoryConversations.values()).sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );
  },

  /**
   * Lấy chi tiết 1 hội thoại
   */
  async getConversation(id) {
    if (!id) return null;
    if (getIsConnected()) {
      try {
        const conv = await ConversationModel.findOne({ id }).lean();
        if (conv) return conv;
      } catch (err) {
        console.error('[MongoDB Error] getConversation:', err.message);
      }
    }
    return (
      memoryConversations.get(id) ||
      Array.from(memoryConversations.values()).find((c) => c.id === id) ||
      null
    );
  },

  /**
   * Lấy danh sách tin nhắn của 1 hội thoại
   */
  async getMessages(conversationId) {
    if (getIsConnected()) {
      try {
        const msgs = await MessageModel.find({ conversationId }).sort({ timestamp: 1 }).lean();
        return msgs;
      } catch (err) {
        console.error('[MongoDB Error] getMessages:', err.message);
      }
    }
    return memoryMessages.filter((m) => m.conversationId === conversationId);
  },

  /**
   * Thêm tin nhắn mới và cập nhật hội thoại tương ứng
   */
  async addMessage({ conversationId, platform, senderId, senderName, content, direction = 'inbound' }) {
    const finalConvId = conversationId || `${platform}_${senderId}`;
    const timestamp = new Date();
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const newMsgData = {
      id: msgId,
      conversationId: finalConvId,
      platform,
      senderId,
      senderName,
      direction,
      content,
      timestamp,
    };

    if (getIsConnected()) {
      try {
        // 1. Lưu tin nhắn vào MongoDB
        const savedMsg = await MessageModel.create(newMsgData);

        // 2. Tìm hoặc tạo mới Conversation trong MongoDB
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(senderName)}`;
        let convDoc = await ConversationModel.findOne({ id: finalConvId });

        if (!convDoc) {
          convDoc = await ConversationModel.create({
            id: finalConvId,
            platform,
            senderId,
            senderName,
            avatar,
            lastMessage: content,
            lastMessageTime: timestamp,
            unreadCount: direction === 'inbound' ? 1 : 0,
            tags: [],
            notes: '',
          });
        } else {
          convDoc.lastMessage = content;
          convDoc.lastMessageTime = timestamp;
          convDoc.senderName = senderName;
          if (direction === 'inbound') {
            convDoc.unreadCount = (convDoc.unreadCount || 0) + 1;
          }
          await convDoc.save();
        }

        return { message: savedMsg.toObject(), conversation: convDoc.toObject() };
      } catch (err) {
        console.error('[MongoDB Error] addMessage:', err.message);
      }
    }

    // Fallback in-memory
    memoryMessages.push(newMsgData);

    let conv = memoryConversations.get(finalConvId);
    if (!conv) {
      conv = {
        id: finalConvId,
        platform,
        senderId,
        senderName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(senderName)}`,
        lastMessage: content,
        lastMessageTime: timestamp.toISOString(),
        unreadCount: direction === 'inbound' ? 1 : 0,
        tags: [],
        notes: '',
      };
    } else {
      conv.lastMessage = content;
      conv.lastMessageTime = timestamp.toISOString();
      if (direction === 'inbound') {
        conv.unreadCount += 1;
      }
    }
    memoryConversations.set(finalConvId, conv);

    return { message: newMsgData, conversation: conv };
  },

  /**
   * Đánh dấu đã đọc
   */
  async markAsRead(conversationId) {
    if (getIsConnected()) {
      try {
        const updated = await ConversationModel.findOneAndUpdate(
          { id: conversationId },
          { $set: { unreadCount: 0 } },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch (err) {
        console.error('[MongoDB Error] markAsRead:', err.message);
      }
    }

    const conv = memoryConversations.get(conversationId);
    if (conv) {
      conv.unreadCount = 0;
      memoryConversations.set(conversationId, conv);
      return conv;
    }
    return null;
  },

  /**
   * Cập nhật thông tin hội thoại (Tags, Notes, v.v.)
   */
  async updateConversation(conversationId, updateData) {
    if (getIsConnected()) {
      try {
        const updated = await ConversationModel.findOneAndUpdate(
          { id: conversationId },
          { $set: updateData },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch (err) {
        console.error('[MongoDB Error] updateConversation:', err.message);
      }
    }

    const conv = memoryConversations.get(conversationId);
    if (conv) {
      Object.assign(conv, updateData);
      memoryConversations.set(conversationId, conv);
      return conv;
    }
    return null;
  },
};

module.exports = store;
