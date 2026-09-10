/**
 * Message Normalizer
 * Chuẩn hóa các định dạng JSON khác nhau từ Telegram, Facebook, Zalo về 1 cấu trúc thống nhất.
 */

function normalizeTelegram(body) {
  const msg = body.message || body.edited_message;
  if (!msg) return null;

  // Lấy Chat ID để gửi phản hồi ngược lại chính xác
  const senderId = msg.chat?.id ? String(msg.chat.id) : (msg.from?.id ? String(msg.from.id) : 'unknown');
  const firstName = msg.from?.first_name || '';
  const lastName = msg.from?.last_name || '';
  const username = msg.from?.username ? ` (@${msg.from.username})` : '';
  const senderName = `${firstName} ${lastName}`.trim() || username || `User_${senderId}`;

  // Lấy nội dung tin nhắn (hỗ trợ text hoặc caption nếu là ảnh/file)
  const content = msg.text || msg.caption || (msg.photo ? '[Hình ảnh]' : '[File/Đính kèm]');

  return {
    platform: 'telegram',
    senderId,
    senderName,
    content,
    raw: msg,
  };
}

function normalizeFacebook(body) {
  // Cấu trúc Webhook chuẩn từ Meta Graph API
  const entry = body.entry?.[0];
  const messaging = entry?.messaging?.[0];
  if (!messaging || !messaging.message) return null;

  const senderId = messaging.sender?.id ? String(messaging.sender.id) : 'unknown';
  const content = messaging.message.text || '[Tệp đính kèm Facebook]';

  return {
    platform: 'facebook',
    senderId,
    senderName: `FB Khách hàng (${senderId.slice(-4)})`,
    content,
    raw: messaging,
  };
}

function normalizeZalo(body) {
  // Cấu trúc Webhook từ Zalo Official Account
  const senderId = body.sender?.id || body.user_id_by_app || 'unknown';
  const content = body.message?.text || body.text || '[Tin nhắn Zalo]';
  const senderName = body.sender?.name || `Zalo Khách hàng (${String(senderId).slice(-4)})`;

  return {
    platform: 'zalo',
    senderId: String(senderId),
    senderName,
    content,
    raw: body,
  };
}

module.exports = {
  normalizeTelegram,
  normalizeFacebook,
  normalizeZalo,
};
