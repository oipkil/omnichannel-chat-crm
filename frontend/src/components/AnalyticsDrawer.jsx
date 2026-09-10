import React from 'react';
import { Drawer, Row, Col, Card, Statistic, Progress, Typography, Space, Divider, Tag } from 'antd';
import {
  BarChartOutlined,
  MessageOutlined,
  UsergroupAddOutlined,
  ClockCircleOutlined,
  SendOutlined,
  FacebookOutlined
} from '@ant-design/icons';
import { PLATFORMS } from '../utils/platformHelper';

const { Title, Text } = Typography;

export default function AnalyticsDrawer({ open, onClose, conversations }) {
  const totalConvs = conversations.length;
  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const telegramCount = conversations.filter((c) => c.platform === 'telegram').length;
  const zaloCount = conversations.filter((c) => c.platform === 'zalo').length;
  const fbCount = conversations.filter((c) => c.platform === 'facebook').length;

  const telePercent = totalConvs > 0 ? Math.round((telegramCount / totalConvs) * 100) : 0;
  const zaloPercent = totalConvs > 0 ? Math.round((zaloCount / totalConvs) * 100) : 0;
  const fbPercent = totalConvs > 0 ? Math.round((fbCount / totalConvs) * 100) : 0;

  return (
    <Drawer
      title={
        <Space>
          <BarChartOutlined style={{ color: '#1677ff' }} />
          <span>Báo cáo Thống kê Đa kênh (Omnichannel Analytics)</span>
        </Space>
      }
      placement="right"
      width={420}
      onClose={onClose}
      open={open}
    >
      {/* Top Stat Cards */}
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f', borderRadius: 8 }}>
            <Statistic
              title={<span style={{ fontSize: 12 }}>Tổng hội thoại</span>}
              value={totalConvs}
              prefix={<UsergroupAddOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#389e0d', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card size="small" style={{ background: '#fff7e6', borderColor: '#ffd591', borderRadius: 8 }}>
            <Statistic
              title={<span style={{ fontSize: 12 }}>Chưa phản hồi</span>}
              value={totalUnread}
              prefix={<MessageOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#d46b08', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card size="small" style={{ background: '#e6f4ff', borderColor: '#91caff', borderRadius: 8 }}>
            <Statistic
              title={<span style={{ fontSize: 12 }}>Thời gian phản hồi TB</span>}
              value="< 1 phút"
              prefix={<ClockCircleOutlined style={{ color: '#1677ff' }} />}
              valueStyle={{ color: '#0958d9', fontSize: 18, fontWeight: 600 }}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card size="small" style={{ background: '#f9f0ff', borderColor: '#d3adf7', borderRadius: 8 }}>
            <Statistic
              title={<span style={{ fontSize: 12 }}>Tỷ lệ phản hồi</span>}
              value={totalConvs > 0 ? `${Math.round(((totalConvs - totalUnread) / totalConvs) * 100)}%` : '100%'}
              valueStyle={{ color: '#722ed1', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: '20px 0' }} />

      {/* Platform Breakdown */}
      <Title level={5} style={{ marginBottom: 14 }}>
        Phân bổ tương tác theo Nền tảng
      </Title>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Telegram */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Space>
              <SendOutlined style={{ color: PLATFORMS.telegram.color }} />
              <Text strong>Telegram Bot</Text>
            </Space>
            <Text type="secondary">{telegramCount} hội thoại ({telePercent}%)</Text>
          </div>
          <Progress percent={telePercent} strokeColor={PLATFORMS.telegram.color} />
        </div>

        {/* Zalo OA */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Space>
              <MessageOutlined style={{ color: PLATFORMS.zalo.color }} />
              <Text strong>Zalo Official Account</Text>
            </Space>
            <Text type="secondary">{zaloCount} hội thoại ({zaloPercent}%)</Text>
          </div>
          <Progress percent={zaloPercent} strokeColor={PLATFORMS.zalo.color} />
        </div>

        {/* Facebook Messenger */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Space>
              <FacebookOutlined style={{ color: PLATFORMS.facebook.color }} />
              <Text strong>Facebook Messenger</Text>
            </Space>
            <Text type="secondary">{fbCount} hội thoại ({fbPercent}%)</Text>
          </div>
          <Progress percent={fbPercent} strokeColor={PLATFORMS.facebook.color} />
        </div>
      </div>

      <Divider style={{ margin: '24px 0 16px' }} />

      {/* Real-time Health */}
      <Title level={5} style={{ marginBottom: 10 }}>
        Trạng thái kết nối Webhook
      </Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Telegram Polling/Webhook:</Text>
          <Tag color="success">Đang hoạt động (Polling)</Tag>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>MongoDB Atlas Cloud:</Text>
          <Tag color="success">Đã kết nối</Tag>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Socket.io Server:</Text>
          <Tag color="success">Port 5000</Tag>
        </div>
      </div>
    </Drawer>
  );
}
