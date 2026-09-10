import React, { useState } from 'react';
import { Input, Button, Space, Tag, Typography, theme } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { getPlatformMeta } from '../utils/platformHelper';

const { Text } = Typography;

const QUICK_REPLIES = [
  'Chào bạn, bên mình có thể hỗ trợ gì cho bạn ạ?',
  'Dạ bên mình đã nhận được thông tin và sẽ phản hồi sớm nhất nhé!',
  'Cảm ơn bạn đã quan tâm đến chương trình thực tập của công ty!',
  'Bạn vui lòng gửi kèm link GitHub và CV để bên mình kiểm tra nhé.',
];

export default function MessageComposer({ onSendMessage, currentConversation, disabled }) {
  const { token } = theme.useToken();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const meta = getPlatformMeta(currentConversation?.platform);

  const handleSend = async () => {
    if (!text.trim() || sending || disabled) return;
    setSending(true);
    try {
      await onSendMessage(text.trim());
      setText('');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        padding: '12px 20px 16px',
        background: token.colorBgContainer,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      {/* Quick Replies */}
      <div style={{ marginBottom: 10, display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        <Text type="secondary" style={{ fontSize: 12, lineHeight: '22px', flexShrink: 0 }}>
          Gợi ý:
        </Text>
        {QUICK_REPLIES.map((reply, idx) => (
          <Tag
            key={idx}
            style={{ cursor: 'pointer', borderRadius: 12, fontSize: 12 }}
            onClick={() => setText((prev) => (prev ? `${prev} ${reply}` : reply))}
          >
            {reply}
          </Tag>
        ))}
      </div>

      {/* Input Box and Send Button */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? 'Vui lòng chọn một cuộc hội thoại để bắt đầu nhắn tin...'
              : `Nhập tin nhắn phản hồi tới ${currentConversation?.senderName || 'khách'} qua ${meta.label} (Nhấn Enter để gửi)...`
          }
          autoSize={{ minRows: 2, maxRows: 5 }}
          disabled={disabled || sending}
          style={{ borderRadius: 8 }}
        />

        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={sending}
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          style={{ height: 54, padding: '0 24px', borderRadius: 8, fontWeight: 500 }}
        >
          Gửi
        </Button>
      </div>

      {/* Footer Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Mẹo: Nhấn <b>Enter</b> để gửi tin, <b>Shift + Enter</b> để xuống dòng
        </Text>
        {currentConversation && (
          <Text type="secondary" style={{ fontSize: 11 }}>
            Đang trả lời qua: <span style={{ color: meta.color, fontWeight: 600 }}>{meta.label}</span>
          </Text>
        )}
      </div>
    </div>
  );
}
