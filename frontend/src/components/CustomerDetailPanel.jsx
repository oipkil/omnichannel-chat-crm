import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Typography,
  Divider,
  Tag,
  Input,
  Button,
  Space,
  Card,
  message as antdMessage,
  Tooltip,
  theme
} from 'antd';
import {
  CloseOutlined,
  UserOutlined,
  TagOutlined,
  EditOutlined,
  SaveOutlined,
  PlusOutlined,
  CheckCircleTwoTone,
  ClockCircleOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { PlatformTag, getPlatformMeta } from '../utils/platformHelper';

const { Title, Text, Paragraph } = Typography;

const PRESET_TAGS = [
  { label: 'VIP', color: 'gold' },
  { label: 'Ứng viên IT', color: 'blue' },
  { label: 'Cần gọi lại', color: 'red' },
  { label: 'Tiềm năng', color: 'green' },
  { label: 'Đã giải quyết', color: 'purple' },
];

export default function CustomerDetailPanel({
  conversation,
  messagesCount,
  onClose,
  onUpdateConversation,
}) {
  const { token } = theme.useToken();
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    if (conversation) {
      setTags(conversation.tags || []);
      setNotes(conversation.notes || '');
    }
  }, [conversation]);

  if (!conversation) return null;

  const meta = getPlatformMeta(conversation.platform);

  // Thêm tag từ preset hoặc nhập tay
  const handleAddTag = async (tagToAdd) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed || tags.includes(trimmed)) return;

    const newTags = [...tags, trimmed];
    setTags(newTags);
    setInputVisible(false);
    setInputValue('');

    try {
      await onUpdateConversation(conversation.id, { tags: newTags });
      antdMessage.success(`Đã gắn thẻ "${trimmed}"`);
    } catch {
      antdMessage.error('Lỗi lưu thẻ');
    }
  };

  // Xóa tag
  const handleRemoveTag = async (removedTag) => {
    const newTags = tags.filter((t) => t !== removedTag);
    setTags(newTags);
    try {
      await onUpdateConversation(conversation.id, { tags: newTags });
    } catch {
      antdMessage.error('Lỗi cập nhật thẻ');
    }
  };

  // Lưu ghi chú nội bộ
  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await onUpdateConversation(conversation.id, { notes });
      antdMessage.success('Đã lưu ghi chú nội bộ!');
    } catch {
      antdMessage.error('Lỗi khi lưu ghi chú');
    } finally {
      setSavingNotes(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Chưa rõ';
    return new Date(isoString).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div
      style={{
        width: 320,
        height: '100%',
        background: token.colorBgContainer,
        borderLeft: `1px solid ${token.colorBorderSecondary}`,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text strong style={{ fontSize: 15 }}>
          Thông tin khách hàng
        </Text>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={onClose}
        />
      </div>

      <div style={{ padding: '18px 18px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Avatar
            src={conversation.avatar}
            size={72}
            style={{
              backgroundColor: meta.color,
              marginBottom: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {conversation.senderName?.[0] || 'U'}
          </Avatar>
          <Title level={5} style={{ margin: '0 0 4px 0' }}>
            {conversation.senderName}
          </Title>
          <Space size={6} align="center">
            <PlatformTag platform={conversation.platform} />
            <Tag color="success" icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}>
              Trực tuyến
            </Tag>
          </Space>
        </div>

        {/* Stats Mini Card */}
        <Card
          size="small"
          style={{
            background: token.colorBgLayout,
            borderColor: token.colorBorderSecondary,
            borderRadius: 8,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <UserOutlined /> ID Người dùng:
            </Text>
            <Text copyable style={{ fontSize: 12, fontWeight: 500 }}>
              {conversation.senderId}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <MessageOutlined /> Tổng tin nhắn:
            </Text>
            <Text style={{ fontSize: 12, fontWeight: 600 }}>{messagesCount} tin</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <ClockCircleOutlined /> Lần cuối:
            </Text>
            <Text style={{ fontSize: 11 }}>{formatDate(conversation.lastMessageTime)}</Text>
          </div>
        </Card>

        <Divider style={{ margin: '4px 0' }} />

        {/* Tags Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text strong style={{ fontSize: 13 }}>
              <TagOutlined style={{ marginRight: 6 }} />
              Thẻ phân loại (CRM Tags)
            </Text>
          </div>

          {/* Active Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleRemoveTag(tag)}
                  color="blue"
                  style={{ borderRadius: 12, fontSize: 12 }}
                >
                  {tag}
                </Tag>
              ))
            ) : (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Chưa có thẻ phân loại
              </Text>
            )}

            {/* Add tag input */}
            {inputVisible ? (
              <Input
                size="small"
                style={{ width: 90, borderRadius: 12 }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => handleAddTag(inputValue)}
                onPressEnter={() => handleAddTag(inputValue)}
                autoFocus
              />
            ) : (
              <Tag
                onClick={() => setInputVisible(true)}
                style={{
                  background: token.colorBgContainer,
                  borderStyle: 'dashed',
                  borderColor: token.colorBorderSecondary,
                  cursor: 'pointer',
                  borderRadius: 12,
                }}
              >
                <PlusOutlined /> Thêm
              </Tag>
            )}
          </div>

          {/* Preset quick tag chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {PRESET_TAGS.map((preset) => {
              const alreadyAdded = tags.includes(preset.label);
              if (alreadyAdded) return null;
              return (
                <Tag
                  key={preset.label}
                  color={preset.color}
                  style={{ cursor: 'pointer', opacity: 0.85, fontSize: 11 }}
                  onClick={() => handleAddTag(preset.label)}
                >
                  + {preset.label}
                </Tag>
              );
            })}
          </div>
        </div>

        <Divider style={{ margin: '4px 0' }} />

        {/* Internal Notes Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text strong style={{ fontSize: 13 }}>
              <EditOutlined style={{ marginRight: 6 }} />
              Ghi chú nội bộ
            </Text>
            <Button
              type="primary"
              size="small"
              icon={<SaveOutlined />}
              loading={savingNotes}
              onClick={handleSaveNotes}
            >
              Lưu
            </Button>
          </div>
          <Paragraph type="secondary" style={{ fontSize: 11, marginBottom: 8 }}>
            Chỉ nhân viên nội bộ nhìn thấy, khách hàng không thấy được ghi chú này.
          </Paragraph>
          <Input.TextArea
            rows={4}
            placeholder="Ví dụ: Ứng viên FPT năm 3, đã phỏng vấn vòng 1, hẹn 15/9 gửi kết quả..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ borderRadius: 8, fontSize: 13 }}
          />
        </div>
      </div>
    </div>
  );
}
