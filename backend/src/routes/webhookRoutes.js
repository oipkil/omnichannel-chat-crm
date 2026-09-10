const express = require('express');

module.exports = (io) => {
  const router = express.Router();
  const webhookController = require('../controllers/webhookController')(io);

  // Telegram
  router.post('/telegram', webhookController.handleTelegram);

  // Facebook Messenger
  router.get('/facebook', webhookController.verifyFacebook);
  router.post('/facebook', webhookController.handleFacebook);

  // Zalo OA
  router.post('/zalo', webhookController.handleZalo);

  // Mock testing endpoint
  router.post('/mock', webhookController.handleMock);

  return router;
};
