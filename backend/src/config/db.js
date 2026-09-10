const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('💡 [MongoDB] Chưa cấu hình MONGODB_URI trong .env.');
    console.log('   -> Hệ thống đang chạy ở chế độ In-Memory Store tạm thời.');
    console.log('   -> Điền MONGODB_URI để lưu trữ dữ liệu vĩnh viễn vào MongoDB Atlas.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`🍃 [MongoDB] Kết nối thành công tới Database: ${conn.connection.name} (${conn.connection.host})`);
    return true;
  } catch (error) {
    console.error('❌ [MongoDB] Lỗi kết nối:', error.message);
    console.log('   -> Hệ thống tự động chuyển về chế độ In-Memory Store dự phòng.');
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
