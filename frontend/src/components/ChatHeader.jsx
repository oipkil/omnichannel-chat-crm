import React from 'react';
import { Avatar, Space, Typography, Button, Tooltip, Tag, theme } from 'antd';
import { CheckOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { PlatformTag, getPlatformMeta } from '../utils/platformHelper';

const { Title, Text } = Typography;

export default function ChatHeader({
  conversation,
  onMarkAsRead,
  onRefresh,
  showDetail,
  onToggleDetail,
}) {
  const { token } = theme.useToken();

  if (!conversation) return null;

  const meta = getPlatformMeta(conversation.platform);
  const tags = conversation.tags || [];

  return (
    <div
      style={{
        padding: '12px 20px',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Space size={14}>
        <Avatar src={conversation.avatar} size={44} style={{ backgroundColor: meta.color }}>
          {conversation.senderName?.[0] || 'U'}
        </Avatar>
        <div>
          <Space align="center" wrap>
            <Title level={5} style={{ margin: 0 }}>
              {conversation.senderName}
            </Title>
            <PlatformTag platform={conversation.platform} />
            {tags.map((tag) => (
              <Tag key={tag} color="blue" style={{ borderRadius: 10, fontSize: 11 }}>
                {tag}
              </Tag>
            ))}
          </Space>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {conversation.senderId} • Trực tuyến
            </Text>
          </div>
        </div>
      </Space>

      <Space>
        {conversation.unreadCount > 0 && (
          <Button
            size="small"
            icon={<CheckOutlined />}
            onClick={() => onMarkAsRead(conversation.id)}
          >
            Đánh dấu đã đọc
          </Button>
        )}
        <Tooltip title="Tải lại lịch sử tin nhắn">
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={onRefresh}
          />
        </Tooltip>
        <Tooltip title={showDetail ? 'Ẩn thông tin khách hàng' : 'Xem thông tin & Ghi chú khách hàng'}>
          <Button
            size="small"
            type={showDetail ? 'primary' : 'default'}
            icon={<InfoCircleOutlined />}
            onClick={onToggleDetail}
          >
            Chi tiết
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
}
