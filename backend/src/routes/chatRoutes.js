const express = require('express');

module.exports = (io) => {
  const router = express.Router();
  const chatController = require('../controllers/chatController')(io);

  router.get('/conversations', chatController.getConversations);
  router.get('/conversations/:conversationId/messages', chatController.getMessages);
  router.post('/messages', chatController.sendMessage);
  router.put('/conversations/:conversationId/read', chatController.markAsRead);
  router.put('/conversations/:conversationId', chatController.updateConversation);

  return router;
};
