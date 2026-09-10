/**
 * Script giả lập gửi tin nhắn webhook từ các nền tảng vào Backend
 * Chạy lệnh: node mock-webhook.js
 */
const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000/api/webhook';

async function sendMockMessages() {
  console.log('🤖 Bắt đầu bắn tin nhắn giả lập vào Backend...\n');

  try {
    // 1. Giả lập tin nhắn từ Telegram
    console.log('1. Bắn tin nhắn từ Telegram...');
    await axios.post(`${BACKEND_URL}/telegram`, {
      update_id: 10001,
      message: {
        message_id: 1,
        from: {
          id: 998877,
          first_name: 'Nguyễn',
          last_name: 'Quốc Bảo',
          username: 'baonq_it'
        },
        chat: { id: 998877, type: 'private' },
        date: Math.floor(Date.now() / 1000),
        text: 'Xin chào! Em muốn nộp CV ứng tuyển vị trí React Node.js Intern bên mình ạ.'
      }
    });

    await new Promise(r => setTimeout(r, 1000));

    // 2. Giả lập tin nhắn từ Zalo
    console.log('2. Bắn tin nhắn từ Zalo OA...');
    await axios.post(`${BACKEND_URL}/zalo`, {
      event_name: 'user_send_text',
      user_id_by_app: 'zalo_user_5544',
      sender: {
        id: 'zalo_user_5544',
        name: 'Hoàng Yến (Zalo OA)'
      },
      message: {
        text: 'Dạ anh ơi, chương trình thực tập này làm việc onsite hay hybrid vậy ạ?'
      }
    });

    await new Promise(r => setTimeout(r, 1000));

    // 3. Giả lập tin nhắn từ Facebook Messenger
    console.log('3. Bắn tin nhắn từ Facebook Messenger...');
    await axios.post(`${BACKEND_URL}/facebook`, {
      object: 'page',
      entry: [
        {
          id: 'fb_page_id_123',
          time: Date.now(),
          messaging: [
            {
              sender: { id: 'fb_sender_8899' },
              recipient: { id: 'fb_page_id_123' },
              timestamp: Date.now(),
              message: {
                mid: 'm_xyz',
                text: 'Anh chị cho em hỏi deadline nộp hồ sơ đợt này là ngày nào ạ?'
              }
            }
          ]
        }
      ]
    });

    console.log('\n🎉 Hoàn thành bắn 3 tin nhắn mẫu! Hãy kiểm tra giao diện Frontend hoặc Terminal backend.');
  } catch (err) {
    console.error('❌ Lỗi khi gửi mock:', err.response?.data || err.message);
    console.log('👉 Hãy chắc chắn bạn đã khởi động Backend trước (npm run dev trong thư mục backend)');
  }
}

sendMockMessages();
