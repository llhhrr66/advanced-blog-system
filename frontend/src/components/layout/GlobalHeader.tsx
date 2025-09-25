'use client'

import { useState } from 'react'
import { Layout, Menu, Button, Space, Avatar, Dropdown, Badge, Input, Modal, Tooltip } from 'antd'
import {
  HomeOutlined,
  BookOutlined,
  CodeOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  BellOutlined,
  SearchOutlined,
  SettingOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  EditOutlined,
  StarOutlined,
  HistoryOutlined,
  FileTextOutlined,
  TeamOutlined,
  GithubOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import useInterviewStore from '@/stores/interviewStore'
import { useAuth } from '@/hooks/useAuth'

const { Header } = Layout
const { Search } = Input

export default function GlobalHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useInterviewStore()
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [searchType, setSearchType] = useState<'all' | 'article' | 'interview'>('all')

  // 主导航菜单
  const mainMenuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/articles',
      icon: <FileTextOutlined />,
      label: '技术文章',
    },
    {
      key: '/interview',
      icon: <CodeOutlined />,
      label: 'Java面试',
      children: [
        {
          key: '/interview',
          label: '面试首页',
          icon: <BookOutlined />
        },
        {
          key: '/interview/banks',
          label: '题库列表',
          icon: <QuestionCircleOutlined />
        },
        {
          key: '/interview/study',
          label: '学习中心',
          icon: <EditOutlined />
        }
      ]
    },
    {
      key: '/about',
      icon: <TeamOutlined />,
      label: '关于',
    }
  ]

  // 用户菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => router.push('/user/profile')
    },
    {
      key: 'articles',
      icon: <FileTextOutlined />,
      label: '我的文章',
      onClick: () => router.push('/user/articles')
    },
    {
      key: 'collections',
      icon: <StarOutlined />,
      label: '我的收藏',
      onClick: () => router.push('/user/collections')
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: '浏览历史',
      onClick: () => router.push('/user/history')
    },
    {
      type: 'divider'
    },
    {
      key: 'admin',
      icon: <SettingOutlined />,
      label: '后台管理',
      onClick: () => router.push('/admin'),
      // 仅管理员可见
      style: user?.role !== 'admin' ? { display: 'none' } : {}
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

  // 处理搜索
  const handleSearch = (value: string) => {
    if (value.trim()) {
      switch(searchType) {
        case 'article':
          router.push(`/articles?keyword=${encodeURIComponent(value)}`)
          break
        case 'interview':
          router.push(`/interview/banks?keyword=${encodeURIComponent(value)}`)
          break
        default:
          router.push(`/search?q=${encodeURIComponent(value)}`)
      }
      setSearchModalVisible(false)
    }
  }

  // 获取当前选中的菜单key
  const getSelectedKey = () => {
    if (pathname.startsWith('/interview')) {
      return pathname
    }
    if (pathname.startsWith('/articles')) {
      return '/articles'
    }
    return pathname
  }

  return (
    <>
      <Header 
        className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700"
        style={{ padding: '0 24px', height: 64 }}
      >
        <div className="flex items-center justify-between h-full">
          {/* 左侧Logo和主导航 */}
          <div className="flex items-center h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center mr-8">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TechBlog
              </div>
            </Link>
            
            {/* 主导航菜单 */}
            <Menu
              mode="horizontal"
              selectedKeys={[getSelectedKey()]}
              onClick={({ key }) => {
                // 处理菜单点击事件
                router.push(key as string)
              }}
              items={mainMenuItems.map(item => ({
                ...item,
                children: item.children?.map(child => ({
                  ...child,
                  onClick: undefined // 移除onClick，使用上面的统一处理
                }))
              }))}
              className="border-0 bg-transparent flex-1"
              style={{ minWidth: 400 }}
            />
          </div>

          {/* 右侧功能区 */}
          <Space size="middle">
            {/* 搜索按钮 */}
            <Tooltip title="搜索">
              <Button
                type="text"
                icon={<SearchOutlined />}
                onClick={() => setSearchModalVisible(true)}
                className="text-gray-600 dark:text-gray-300"
              />
            </Tooltip>

            {/* GitHub链接 */}
            <Tooltip title="GitHub">
              <Button
                type="text"
                icon={<GithubOutlined />}
                className="text-gray-600 dark:text-gray-300"
                onClick={() => window.open('https://github.com/yourusername/blog-system', '_blank')}
              />
            </Tooltip>

            {/* 暗黑模式切换 */}
            <Tooltip title={isDarkMode ? '切换到亮色模式' : '切换到暗黑模式'}>
              <Button
                type="text"
                icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-gray-300"
              />
            </Tooltip>

            {/* 通知 */}
            {user && (
              <Badge count={5} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className="text-gray-600 dark:text-gray-300"
                  onClick={() => router.push('/notifications')}
                />
              </Badge>
            )}

            {/* 用户菜单或登录按钮 */}
            {user ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
              >
                <Avatar
                  src={user.avatar}
                  icon={!user.avatar && <UserOutlined />}
                  className="cursor-pointer"
                  style={{ backgroundColor: '#1890ff' }}
                >
                  {!user.avatar && user.username?.[0]?.toUpperCase()}
                </Avatar>
              </Dropdown>
            ) : (
              <Space>
                <Button 
                  type="text" 
                  onClick={() => router.push('/login')}
                >
                  登录
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => router.push('/register')}
                >
                  注册
                </Button>
              </Space>
            )}
          </Space>
        </div>
      </Header>

      {/* 全局搜索弹窗 */}
      <Modal
        title="搜索"
        open={searchModalVisible}
        onCancel={() => setSearchModalVisible(false)}
        footer={null}
        width={600}
      >
        {/* 搜索类型选择 */}
        <div className="mb-4">
          <Space>
            <span className="text-gray-600">搜索范围：</span>
            <Button 
              type={searchType === 'all' ? 'primary' : 'default'}
              size="small"
              onClick={() => setSearchType('all')}
            >
              全部
            </Button>
            <Button 
              type={searchType === 'article' ? 'primary' : 'default'}
              size="small"
              onClick={() => setSearchType('article')}
            >
              技术文章
            </Button>
            <Button 
              type={searchType === 'interview' ? 'primary' : 'default'}
              size="small"
              onClick={() => setSearchType('interview')}
            >
              面试题
            </Button>
          </Space>
        </div>

        {/* 搜索框 */}
        <Search
          placeholder={
            searchType === 'article' ? '搜索文章标题或内容...' :
            searchType === 'interview' ? '搜索面试题...' :
            '搜索文章、面试题...'
          }
          enterButton="搜索"
          size="large"
          autoFocus
          onSearch={handleSearch}
        />
        
        {/* 热门搜索 */}
        <div className="mt-4">
          <div className="text-gray-500 text-sm mb-2">热门搜索</div>
          <Space wrap>
            {searchType === 'interview' ? 
              ['HashMap', 'JVM', 'Spring', 'Redis', '多线程', '设计模式'].map(keyword => (
                <Button
                  key={keyword}
                  type="text"
                  size="small"
                  onClick={() => handleSearch(keyword)}
                >
                  {keyword}
                </Button>
              )) :
              ['React', 'Vue', 'TypeScript', 'Docker', 'Kubernetes', '微服务'].map(keyword => (
                <Button
                  key={keyword}
                  type="text"
                  size="small"
                  onClick={() => handleSearch(keyword)}
                >
                  {keyword}
                </Button>
              ))
            }
          </Space>
        </div>
      </Modal>
    </>
  )
}
