import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const chatApi = {
  getConversations: async () => {
    const res = await api.get('/chat/conversations');
    return res.data.data;
  },

  getMessages: async (conversationId) => {
    const res = await api.get(`/chat/conversations/${conversationId}/messages`);
    return res.data.data;
  },

  sendMessage: async (conversationId, content) => {
    const res = await api.post('/chat/messages', { conversationId, content });
    return res.data.data;
  },

  markAsRead: async (conversationId) => {
    const res = await api.put(`/chat/conversations/${conversationId}/read`);
    return res.data.data;
  },

  sendMockMessage: async (platform, senderName, content) => {
    const res = await api.post('/webhook/mock', { platform, senderName, content });
    return res.data;
  },

  updateConversation: async (conversationId, updateData) => {
    const res = await api.put(`/chat/conversations/${conversationId}`, updateData);
    return res.data.data;
  }
};

export default api;
