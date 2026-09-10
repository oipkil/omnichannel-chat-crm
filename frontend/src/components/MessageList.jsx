import React, { useEffect, useRef } from 'react';
import { Avatar, Typography, Space, Empty, theme } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getPlatformMeta } from '../utils/platformHelper';

const { Text } = Typography;

export default function MessageList({ messages, currentConversation }) {
  const { token } = theme.useToken();
  const bottomRef = useRef(null);

  useEffect(() => {
    // Tự động cuộn xuống tin nhắn mới nhất
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: token.colorBgLayout }}>
        <Empty description="Chưa có tin nhắn nào trong hội thoại này" />
      </div>
    );
  }

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const meta = getPlatformMeta(currentConversation?.platform);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        background: token.colorBgLayout,
      }}
    >
      {messages.map((msg) => {
        const isOutbound = msg.direction === 'outbound'; // Do bên mình gửi

        return (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: isOutbound ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              gap: 10,
            }}
          >
            {/* Avatar */}
            {!isOutbound ? (
              <Avatar
                src={currentConversation?.avatar}
                size={34}
                style={{ backgroundColor: meta.color, flexShrink: 0 }}
              >
                {currentConversation?.senderName?.[0] || 'U'}
              </Avatar>
            ) : (
              <Avatar
                size={34}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1677ff', flexShrink: 0 }}
              />
            )}

            {/* Message Bubble Container */}
            <div
              style={{
                maxWidth: '65%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOutbound ? 'flex-end' : 'flex-start',
              }}
            >
              {/* Sender Name */}
              <Text
                type="secondary"
                style={{ fontSize: 11, marginBottom: 3, padding: '0 4px' }}
              >
                {isOutbound ? 'Bạn (Support)' : msg.senderName}
              </Text>

              {/* Bubble Box */}
              <div
                style={{
                  padding: '10px 15px',
                  borderRadius: isOutbound ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  background: isOutbound ? '#1677ff' : token.colorBgContainer,
                  color: isOutbound ? '#ffffff' : token.colorText,
                  border: isOutbound ? 'none' : `1px solid ${token.colorBorderSecondary}`,
                  boxShadow: isOutbound
                    ? '0 2px 8px rgba(22, 119, 255, 0.25)'
                    : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  wordBreak: 'break-word',
                  fontSize: 14,
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
              </div>

              {/* Timestamp */}
              <Text
                type="secondary"
                style={{ fontSize: 10, marginTop: 4, padding: '0 4px' }}
              >
                {formatTime(msg.timestamp)}
              </Text>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
