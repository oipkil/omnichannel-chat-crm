require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || '',
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  },
  facebook: {
    pageAccessToken: process.env.FB_PAGE_ACCESS_TOKEN || '',
    verifyToken: process.env.FB_VERIFY_TOKEN || 'my_omnichannel_secret_token',
  },
  zalo: {
    oaAccessToken: process.env.ZALO_OA_ACCESS_TOKEN || '',
    appSecret: process.env.ZALO_APP_SECRET || '',
  }
};
