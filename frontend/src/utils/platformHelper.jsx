import React from 'react';
import { Tag } from 'antd';
import {
  SendOutlined,
  FacebookOutlined,
  MessageOutlined
} from '@ant-design/icons';

export const PLATFORMS = {
  all: { label: 'Tất cả', color: 'default' },
  telegram: { label: 'Telegram', color: '#229ED9', icon: <SendOutlined /> },
  facebook: { label: 'Messenger', color: '#0084FF', icon: <FacebookOutlined /> },
  zalo: { label: 'Zalo OA', color: '#0068FF', icon: <MessageOutlined /> },
};

export const getPlatformMeta = (platform) => {
  const p = (platform || '').toLowerCase();
  return PLATFORMS[p] || { label: platform, color: '#888', icon: <MessageOutlined /> };
};

export const PlatformTag = ({ platform }) => {
  const meta = getPlatformMeta(platform);
  return (
    <Tag color={meta.color} style={{ borderRadius: 12, fontSize: 11, fontWeight: 500 }}>
      {meta.icon} <span style={{ marginLeft: 4 }}>{meta.label}</span>
    </Tag>
  );
};
