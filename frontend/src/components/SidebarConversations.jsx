import React, { useState } from 'react';
import { List, Avatar, Badge, Input, Segmented, Button, Modal, Select, Space, Typography, Tooltip, Tag, theme } from 'antd';
import {
  SearchOutlined,
  ThunderboltOutlined,
  SendOutlined,
  FacebookOutlined,
  MessageOutlined,
  CheckCircleTwoTone
} from '@ant-design/icons';
import { PlatformTag, getPlatformMeta } from '../utils/platformHelper';

const { Text } = Typography;

export default function SidebarConversations({
  conversations,
  selectedId,
  onSelect,
  filterPlatform,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onSendMock,
}) {
  const { token } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mockPlatform, setMockPlatform] = useState('telegram');
  const [mockSenderName, setMockSenderName] = useState('Khách hàng mới');
  const [mockContent, setMockContent] = useState('Chào bạn, mình cần hỗ trợ tư vấn tuyển dụng!');
  const [submitting, setSubmitting] = useState(false);

  // Filter conversations
  const filtered = conversations.filter((c) => {
    const matchPlatform = filterPlatform === 'all' || c.platform === filterPlatform;
    const matchQuery =
      !searchQuery ||
      c.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchPlatform && matchQuery;
  });

  const handleTriggerMock = async () => {
    setSubmitting(true);
    try {
      await onSendMock(mockPlatform, mockSenderName, mockContent);
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'numeric', day: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: token.colorBgContainer }}>
      {/* Sider Top Header */}
      <div style={{ padding: '16px 16px 10px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text strong style={{ fontSize: 16 }}>
            Hội thoại ({filtered.length})
          </Text>
          <Tooltip title="Bắn tin nhắn giả lập để kiểm tra tính năng Real-time">
            <Button
              type="dashed"
              size="small"
              icon={<ThunderboltOutlined style={{ color: '#fa8c16' }} />}
              onClick={() => setIsModalOpen(true)}
            >
              Test Real-time
            </Button>
          </Tooltip>
        </div>

        {/* Search */}
        <Input
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          placeholder="Tìm tên khách hoặc tin nhắn..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          style={{ marginBottom: 12, borderRadius: 6 }}
        />

        {/* Segmented Filter */}
        <Segmented
          block
          size="middle"
          value={filterPlatform}
          onChange={onFilterChange}
          options={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Telegram', value: 'telegram', icon: <SendOutlined /> },
            { label: 'Zalo', value: 'zalo', icon: <MessageOutlined /> },
            { label: 'FB', value: 'facebook', icon: <FacebookOutlined /> },
          ]}
        />
      </div>

      {/* Conversation List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <List
          itemLayout="horizontal"
          dataSource={filtered}
          locale={{ emptyText: 'Không có hội thoại nào' }}
          renderItem={(item) => {
            const isSelected = item.id === selectedId;
            const meta = getPlatformMeta(item.platform);

            return (
              <List.Item
                onClick={() => onSelect(item.id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  background: isSelected ? 'rgba(22, 119, 255, 0.15)' : 'transparent',
                  borderLeft: isSelected ? '4px solid #1677ff' : '4px solid transparent',
                  borderBottom: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge
                      dot
                      color={meta.color}
                      offset={[-2, 32]}
                      style={{ width: 10, height: 10 }}
                    >
                      <Avatar src={item.avatar} size={44} style={{ backgroundColor: meta.color }}>
                        {item.senderName?.[0] || 'U'}
                      </Avatar>
                    </Badge>
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong ellipsis style={{ maxWidth: 140, fontSize: 14 }}>
                        {item.senderName}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {formatTime(item.lastMessageTime)}
                      </Text>
                    </div>
                  }
                  description={
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <Text
                          type="secondary"
                          ellipsis
                          style={{
                            maxWidth: 160,
                            fontSize: 12,
                            color: item.unreadCount > 0 ? '#000' : '#8c8c8c',
                            fontWeight: item.unreadCount > 0 ? 600 : 400,
                          }}
                        >
                          {item.lastMessage || '(Chưa có tin nhắn)'}
                        </Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <PlatformTag platform={item.platform} />
                          {item.unreadCount > 0 && (
                            <Badge count={item.unreadCount} size="small" />
                          )}
                        </div>
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
                          {item.tags.slice(0, 3).map((t) => (
                            <Tag key={t} color="blue" style={{ fontSize: 10, lineHeight: '16px', padding: '0 5px', margin: 0, borderRadius: 4 }}>
                              {t}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </>
                  }
                />
              </List.Item>
            );
          }}
        />
      </div>

      {/* Modal Bắn tin nhắn giả lập */}
      <Modal
        title={
          <Space>
            <ThunderboltOutlined style={{ color: '#fa8c16' }} />
            <span>Giả lập tin nhắn Webhook đa kênh</span>
          </Space>
        }
        open={isModalOpen}
        onOk={handleTriggerMock}
        confirmLoading={submitting}
        onCancel={() => setIsModalOpen(false)}
        okText="Bắn tin nhắn ngay"
        cancelText="Hủy"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          <div>
            <Text strong>Nền tảng gửi đến:</Text>
            <Select
              style={{ width: '100%', marginTop: 6 }}
              value={mockPlatform}
              onChange={setMockPlatform}
              options={[
                { value: 'telegram', label: 'Telegram Bot' },
                { value: 'zalo', label: 'Zalo Official Account' },
                { value: 'facebook', label: 'Facebook Messenger' },
              ]}
            />
          </div>

          <div>
            <Text strong>Tên khách hàng:</Text>
            <Input
              style={{ marginTop: 6 }}
              value={mockSenderName}
              onChange={(e) => setMockSenderName(e.target.value)}
              placeholder="Ví dụ: Lê Minh Quân"
            />
          </div>

          <div>
            <Text strong>Nội dung tin nhắn:</Text>
            <Input.TextArea
              rows={3}
              style={{ marginTop: 6 }}
              value={mockContent}
              onChange={(e) => setMockContent(e.target.value)}
              placeholder="Nhập nội dung muốn test..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
