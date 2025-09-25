'use client'

import { useState } from 'react'
import { Layout, Menu, Button, Space, Avatar, Dropdown, Badge, Input, Modal } from 'antd'
import {
  HomeOutlined,
  BookOutlined,
  EditOutlined,
  UserOutlined,
  BellOutlined,
  SearchOutlined,
  SettingOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  MenuOutlined,
  StarOutlined,
  HistoryOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import useInterviewStore from '@/stores/interviewStore'
import { useAuth } from '@/hooks/useAuth'

const { Header } = Layout
const { Search } = Input

export default function InterviewHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useInterviewStore()
  const [searchModalVisible, setSearchModalVisible] = useState(false)

  const menuItems = [
    {
      key: '/interview',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/interview/banks',
      icon: <BookOutlined />,
      label: '题库',
    },
    {
      key: '/interview/study',
      icon: <EditOutlined />,
      label: '学习中心',
    },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => router.push('/user/profile')
    },
    {
      key: 'collections',
      icon: <StarOutlined />,
      label: '我的收藏',
      onClick: () => router.push('/interview/collections')
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: '浏览历史',
      onClick: () => router.push('/interview/history')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => router.push('/user/settings')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: () => {
        logout()
        router.push('/login')
      }
    }
  ]

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/interview/banks?keyword=${encodeURIComponent(value)}`)
      setSearchModalVisible(false)
    }
  }

  return (
    <>
      <Header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
        {/* 左侧Logo和菜单 */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              面试题库
            </div>
          </div>
          
          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            items={menuItems.map(item => ({
              ...item,
              onClick: () => router.push(item.key)
            }))}
            className="border-0 bg-transparent flex-1"
          />
        </div>

        {/* 右侧功能区 */}
        <Space size="middle">
          {/* 搜索按钮 */}
          <Button
            type="text"
            icon={<SearchOutlined />}
            onClick={() => setSearchModalVisible(true)}
            className="text-gray-600 dark:text-gray-300"
          />

          {/* 暗黑模式切换 */}
          <Button
            type="text"
            icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleDarkMode}
            className="text-gray-600 dark:text-gray-300"
          />

          {/* 通知 */}
          {user && (
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="text-gray-600 dark:text-gray-300"
              />
            </Badge>
          )}

          {/* 用户菜单 */}
          {user ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
            >
              <Avatar
                src={user.avatar}
                icon={!user.avatar && <UserOutlined />}
                className="cursor-pointer"
              >
                {!user.avatar && user.username?.[0]?.toUpperCase()}
              </Avatar>
            </Dropdown>
          ) : (
            <Space>
              <Button type="text" onClick={() => router.push('/login')}>
                登录
              </Button>
              <Button type="primary" onClick={() => router.push('/register')}>
                注册
              </Button>
            </Space>
          )}
        </Space>
      </Header>

      {/* 搜索弹窗 */}
      <Modal
        title="搜索题目"
        open={searchModalVisible}
        onCancel={() => setSearchModalVisible(false)}
        footer={null}
        width={600}
      >
        <Search
          placeholder="输入题目标题或关键词"
          enterButton="搜索"
          size="large"
          autoFocus
          onSearch={handleSearch}
        />
        
        <div className="mt-4">
          <div className="text-gray-500 text-sm mb-2">热门搜索</div>
          <Space wrap>
            {['HashMap', 'JVM', 'Spring', 'Redis', '多线程', '设计模式'].map(keyword => (
              <Button
                key={keyword}
                type="text"
                size="small"
                onClick={() => handleSearch(keyword)}
              >
                {keyword}
              </Button>
            ))}
          </Space>
        </div>
      </Modal>
    </>
  )
}
