import React, { useState, useEffect, useRef } from 'react';
import { Layout, Typography, Space, notification, ConfigProvider, theme, Button, Tooltip, Switch } from 'antd';
import {
  MessageOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  GlobalOutlined,
  BarChartOutlined,
  SoundOutlined,
  AudioMutedOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { io } from 'socket.io-client';
import { chatApi } from './services/api';
import { soundService } from './utils/sound';
import SidebarConversations from './components/SidebarConversations';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageComposer from './components/MessageComposer';
import CustomerDetailPanel from './components/CustomerDetailPanel';
import AnalyticsDrawer from './components/AnalyticsDrawer';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const SOCKET_SERVER_URL = 'http://localhost:5000';

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);

  // New UI features state
  const [showDetailPanel, setShowDetailPanel] = useState(true);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const socketRef = useRef(null);
  const selectedIdRef = useRef(selectedId);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    soundService.toggle(soundEnabled);
  }, [soundEnabled]);

  // Khởi tạo Socket.io và tải danh sách hội thoại ban đầu
  useEffect(() => {
    loadConversations();

    const socket = io(SOCKET_SERVER_URL, {
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Đã kết nối Socket.io tới Backend!');
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Mất kết nối Socket.io');
      setSocketConnected(false);
    });

    // Lắng nghe sự kiện có tin nhắn mới từ bất kỳ kênh nào
    socket.on('new_message', ({ message, conversation }) => {
      console.log('⚡ Socket nhận tin nhắn mới:', message);

      // Phát âm thanh thông báo nếu là khách nhắn đến
      if (message.direction === 'inbound' && soundEnabledRef.current) {
        soundService.play();
      }

      // Cập nhật danh sách hội thoại
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversation.id);
        let updated;
        if (exists) {
          updated = prev.map((c) => (c.id === conversation.id ? conversation : c));
        } else {
          updated = [conversation, ...prev];
        }
        return updated.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      });

      // Nếu tin nhắn thuộc hội thoại đang mở -> Thêm ngay vào khung chat
      if (selectedIdRef.current === message.conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });

        if (message.direction === 'inbound') {
          chatApi.markAsRead(message.conversationId);
        }
      } else if (message.direction === 'inbound') {
        // Bắn thông báo góc màn hình nếu là từ hội thoại khác
        notification.info({
          message: `Tin nhắn mới từ ${message.senderName}`,
          description: message.content,
          placement: 'topRight',
          duration: 3,
        });
      }
    });

    socket.on('conversation_updated', (updatedConv) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === updatedConv.id ? updatedConv : c))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const loadConversations = async () => {
    try {
      const data = await chatApi.getConversations();
      setConversations(data);
      if (data.length > 0 && !selectedIdRef.current) {
        handleSelectConversation(data[0].id);
      }
    } catch (err) {
      console.error('Không thể tải danh sách hội thoại:', err);
    }
  };

  const handleSelectConversation = async (convId) => {
    setSelectedId(convId);
    setLoadingMessages(true);
    try {
      const msgs = await chatApi.getMessages(convId);
      setMessages(msgs);
      await chatApi.markAsRead(convId);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      console.error('Lỗi khi tải tin nhắn:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedId) return;
    try {
      await chatApi.sendMessage(selectedId, content);
    } catch (err) {
      notification.error({
        message: 'Lỗi gửi tin nhắn',
        description: err.response?.data?.message || err.message,
      });
    }
  };

  const handleMarkAsRead = async (convId) => {
    try {
      await chatApi.markAsRead(convId);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateConversation = async (convId, updateData) => {
    try {
      const updated = await chatApi.updateConversation(convId, updateData);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, ...updateData } : c))
      );
      return updated;
    } catch (err) {
      console.error('Lỗi cập nhật hội thoại:', err);
      throw err;
    }
  };

  const handleSendMock = async (platform, senderName, content) => {
    try {
      await chatApi.sendMockMessage(platform, senderName, content);
      notification.success({
        message: 'Đã bắn tin nhắn thử nghiệm!',
        description: `Từ ${senderName} qua kênh ${platform.toUpperCase()}`,
        duration: 2,
      });
    } catch (err) {
      notification.error({
        message: 'Lỗi gửi tin nhắn mock',
        description: err.message,
      });
    }
  };

  const currentConversation = conversations.find((c) => c.id === selectedId);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          colorBgLayout: darkMode ? '#1a1a1a' : '#f5f7fa',
          colorBgContainer: darkMode ? '#141414' : '#ffffff',
          colorBorderSecondary: darkMode ? '#303030' : '#f0f0f0',
        },
      }}
    >
      <Layout style={{ height: '100vh', width: '100vw', overflow: 'hidden', background: darkMode ? '#141414' : '#fff' }}>
        {/* Top Header */}
        <Header
          style={{
            background: darkMode ? '#141414' : '#001529',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 56,
            lineHeight: '56px',
            zIndex: 10,
            borderBottom: darkMode ? '1px solid #303030' : 'none',
          }}
        >
          <Space size={12} align="center">
            <MessageOutlined style={{ fontSize: 22, color: '#1677ff' }} />
            <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 600 }}>
              Omnichannel Chat Dashboard
            </Title>
            <Text style={{ color: '#8c8c8c', fontSize: 12 }}>
              | Quản lý tin nhắn Telegram • Zalo • Facebook
            </Text>
          </Space>

          {/* Action Tools & Status */}
          <Space size={14} align="center">
            {/* Analytics Button */}
            <Tooltip title="Xem báo cáo & Thống kê đa kênh">
              <Button
                type="text"
                icon={<BarChartOutlined style={{ color: '#fff', fontSize: 16 }} />}
                onClick={() => setAnalyticsOpen(true)}
                style={{ color: '#fff' }}
              >
                Thống kê
              </Button>
            </Tooltip>

            {/* Sound Toggle */}
            <Tooltip title={soundEnabled ? 'Đang bật âm thanh thông báo' : 'Đã tắt âm thanh thông báo'}>
              <Button
                type="text"
                icon={
                  soundEnabled ? (
                    <SoundOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                  ) : (
                    <AudioMutedOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />
                  )
                }
                onClick={() => setSoundEnabled(!soundEnabled)}
              />
            </Tooltip>

            {/* Dark Mode Switch */}
            <Tooltip title={darkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}>
              <Button
                type="text"
                icon={
                  darkMode ? (
                    <SunOutlined style={{ color: '#faad14', fontSize: 16 }} />
                  ) : (
                    <MoonOutlined style={{ color: '#fff', fontSize: 16 }} />
                  )
                }
                onClick={() => setDarkMode(!darkMode)}
              />
            </Tooltip>

            {/* Real-time Status Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: socketConnected ? 'rgba(82, 196, 26, 0.15)' : 'rgba(255, 77, 79, 0.15)',
                padding: '4px 12px',
                borderRadius: 20,
                border: `1px solid ${socketConnected ? '#52c41a' : '#ff4d4f'}`,
              }}
            >
              {socketConnected ? (
                <CheckCircleFilled style={{ color: '#52c41a', fontSize: 13 }} />
              ) : (
                <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: 13 }} />
              )}
              <Text style={{ color: socketConnected ? '#52c41a' : '#ff4d4f', fontSize: 12, fontWeight: 500 }}>
                {socketConnected ? 'Real-time Online' : 'Mất kết nối'}
              </Text>
            </div>
          </Space>
        </Header>

        {/* Main Content Area (3-Column Layout) */}
        <Layout style={{ flex: 1, overflow: 'hidden' }}>
          {/* Cột 1: Sider Danh sách hội thoại (Trái) */}
          <Sider
            theme={darkMode ? 'dark' : 'light'}
            width={340}
            style={{
              borderRight: darkMode ? '1px solid #303030' : '1px solid #f0f0f0',
              height: 'calc(100vh - 56px)',
            }}
          >
            <SidebarConversations
              conversations={conversations}
              selectedId={selectedId}
              onSelect={handleSelectConversation}
              filterPlatform={filterPlatform}
              onFilterChange={setFilterPlatform}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSendMock={handleSendMock}
            />
          </Sider>

          {/* Cột 2: Content Khung chat (Giữa) */}
          <Content
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 56px)',
              background: darkMode ? '#1f1f1f' : '#f8f9fa',
              flex: 1,
            }}
          >
            {currentConversation ? (
              <>
                <ChatHeader
                  conversation={currentConversation}
                  onMarkAsRead={handleMarkAsRead}
                  onRefresh={() => handleSelectConversation(selectedId)}
                  showDetail={showDetailPanel}
                  onToggleDetail={() => setShowDetailPanel(!showDetailPanel)}
                />
                <MessageList
                  messages={messages}
                  currentConversation={currentConversation}
                />
                <MessageComposer
                  onSendMessage={handleSendMessage}
                  currentConversation={currentConversation}
                  disabled={!socketConnected}
                />
              </>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#8c8c8c',
                }}
              >
                <GlobalOutlined style={{ fontSize: 56, color: '#d9d9d9', marginBottom: 16 }} />
                <Title level={4} type="secondary">
                  Chọn một cuộc hội thoại từ danh sách bên trái
                </Title>
                <Text type="secondary">
                  Tin nhắn từ Telegram, Zalo hoặc Facebook sẽ tự động xuất hiện tại đây theo thời gian thực.
                </Text>
              </div>
            )}
          </Content>

          {/* Cột 3: Customer Detail Panel (Phải - Có thể đóng/mở) */}
          {showDetailPanel && currentConversation && (
            <CustomerDetailPanel
              conversation={currentConversation}
              messagesCount={messages.length}
              onClose={() => setShowDetailPanel(false)}
              onUpdateConversation={handleUpdateConversation}
            />
          )}
        </Layout>

        {/* Analytics Drawer Modal */}
        <AnalyticsDrawer
          open={analyticsOpen}
          onClose={() => setAnalyticsOpen(false)}
          conversations={conversations}
        />
      </Layout>
    </ConfigProvider>
  );
}
