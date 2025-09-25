'use client'

import { useState } from 'react'
import { Card, Row, Col, Button, Tag, List, Space, Statistic, Carousel, Avatar, Divider } from 'antd'
import {
  FileTextOutlined,
  CodeOutlined,
  TeamOutlined,
  TrophyOutlined,
  RocketOutlined,
  BookOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ArrowRightOutlined,
  FireOutlined,
  StarOutlined
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// 模拟数据
const featuredArticles = [
  {
    id: 1,
    title: '深入理解 React 18 并发特性',
    author: 'techwriter',
    category: '前端开发',
    image: 'https://picsum.photos/400/200?random=1'
  },
  {
    id: 2,
    title: 'Spring Boot 3.0 新特性详解',
    author: 'javadev',
    category: '后端开发',
    image: 'https://picsum.photos/400/200?random=2'
  },
  {
    id: 3,
    title: 'Kubernetes 最佳实践',
    author: 'devops',
    category: '云原生',
    image: 'https://picsum.photos/400/200?random=3'
  }
]

const recentArticles = [
  { id: 1, title: 'TypeScript 5.0 新特性速览', views: 1234, category: '前端开发' },
  { id: 2, title: '微服务架构设计原则', views: 2100, category: '架构设计' },
  { id: 3, title: 'Redis 高并发实战', views: 1850, category: '数据库' },
  { id: 4, title: 'Docker 容器化最佳实践', views: 1560, category: 'DevOps' },
  { id: 5, title: 'Vue 3 组合式 API 详解', views: 980, category: '前端开发' }
]

const hotQuestions = [
  { id: 1, title: 'HashMap 底层原理是什么？', difficulty: '中等', views: 5200 },
  { id: 2, title: 'Spring 的 IoC 和 AOP 原理', difficulty: '困难', views: 4800 },
  { id: 3, title: 'JVM 内存模型详解', difficulty: '困难', views: 4500 },
  { id: 4, title: 'MySQL 索引优化策略', difficulty: '中等', views: 3900 },
  { id: 5, title: '分布式事务解决方案', difficulty: '困难', views: 3600 }
]

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              欢迎来到 TechBlog
            </h1>
            <p className="text-xl mb-8">
              分享技术知识，记录成长历程，助力面试准备
            </p>
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                icon={<FileTextOutlined />}
                onClick={() => router.push('/articles')}
                className="bg-white text-blue-600 hover:bg-gray-100 border-0"
              >
                浏览文章
              </Button>
              <Button 
                size="large" 
                icon={<CodeOutlined />}
                onClick={() => router.push('/interview/banks')}
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                刷面试题
              </Button>
            </Space>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* 统计数据 */}
        <Row gutter={[24, 24]} className="mb-12">
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="技术文章"
                value={1280}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="面试题库"
                value={1275}
                prefix={<CodeOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="活跃用户"
                value={3650}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="学习时长"
                value={15260}
                suffix="小时"
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* 左侧内容 */}
          <Col xs={24} lg={16}>
            {/* 精选文章轮播 */}
            <Card 
              title={
                <Space>
                  <StarOutlined className="text-yellow-500" />
                  <span>精选文章</span>
                </Space>
              }
              className="mb-6"
            >
              <Carousel autoplay>
                {featuredArticles.map(article => (
                  <div key={article.id}>
                    <div 
                      className="relative h-64 bg-cover bg-center rounded-lg cursor-pointer"
                      style={{ backgroundImage: `url(${article.image})` }}
                      onClick={() => router.push(`/articles/${article.id}`)}
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 rounded-b-lg">
                        <Tag color="blue" className="mb-2">{article.category}</Tag>
                        <h3 className="text-white text-xl font-semibold mb-1">
                          {article.title}
                        </h3>
                        <p className="text-gray-300">作者：{article.author}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </Card>

            {/* 最新文章 */}
            <Card 
              title={
                <Space>
                  <ClockCircleOutlined className="text-blue-500" />
                  <span>最新文章</span>
                </Space>
              }
              extra={
                <Link href="/articles">
                  <Button type="link" icon={<ArrowRightOutlined />}>
                    查看更多
                  </Button>
                </Link>
              }
            >
              <List
                dataSource={recentArticles}
                renderItem={(article) => (
                  <List.Item
                    className="cursor-pointer hover:bg-gray-50 px-4 -mx-4 transition-colors"
                    onClick={() => router.push(`/articles/${article.id}`)}
                  >
                    <div className="flex-1">
                      <div className="font-medium hover:text-blue-600 transition-colors">
                        {article.title}
                      </div>
                      <Space className="text-sm text-gray-500 mt-1">
                        <Tag color="blue">{article.category}</Tag>
                        <span>{article.views} 阅读</span>
                      </Space>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* 右侧边栏 */}
          <Col xs={24} lg={8}>
            {/* 面试题入口 */}
            <Card 
              className="mb-6 bg-gradient-to-br from-purple-500 to-blue-600 text-white"
              bodyStyle={{ padding: 24 }}
            >
              <div className="text-center">
                <CodeOutlined className="text-4xl mb-3" />
                <h3 className="text-xl font-semibold mb-2">Java 面试题库</h3>
                <p className="mb-4 opacity-90">
                  1275+ 道精选面试题，助你斩获心仪 offer
                </p>
                <Space direction="vertical" className="w-full">
                  <Button 
                    block
                    size="large"
                    onClick={() => router.push('/interview')}
                    className="bg-white text-blue-600 hover:bg-gray-100 border-0"
                  >
                    开始刷题
                  </Button>
                  <Button 
                    block
                    onClick={() => router.push('/interview/study')}
                    className="bg-transparent border-white text-white"
                  >
                    学习中心
                  </Button>
                </Space>
              </div>
            </Card>

            {/* 热门面试题 */}
            <Card 
              title={
                <Space>
                  <FireOutlined className="text-red-500" />
                  <span>热门面试题</span>
                </Space>
              }
              extra={
                <Link href="/interview/banks">
                  <Button type="link" size="small">
                    更多
                  </Button>
                </Link>
              }
            >
              <div className="space-y-3">
                {hotQuestions.map((question, index) => (
                  <div 
                    key={question.id}
                    className="flex items-start space-x-2 cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                    onClick={() => router.push(`/interview/question/${question.id}`)}
                  >
                    <div className={`
                      w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0
                      ${index < 3 ? 'bg-red-500' : 'bg-gray-400'}
                    `}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm line-clamp-2 hover:text-blue-600 transition-colors">
                        {question.title}
                      </div>
                      <Space className="text-xs text-gray-500 mt-1">
                        <Tag 
                          color={
                            question.difficulty === '简单' ? 'green' :
                            question.difficulty === '中等' ? 'orange' : 'red'
                          }
                        >
                          {question.difficulty}
                        </Tag>
                        <span>{question.views} 浏览</span>
                      </Space>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
