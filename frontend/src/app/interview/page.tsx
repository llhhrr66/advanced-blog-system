'use client'

import { useState } from 'react'
import { Card, Row, Col, Statistic, Button, Space, Tag, Progress } from 'antd'
import { 
  BookOutlined, 
  ClockCircleOutlined, 
  TrophyOutlined,
  RocketOutlined,
  FireOutlined,
  FolderOpenOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// 模拟数据
const mockCategories = [
  { id: 1, categoryName: 'Java基础', questionCount: 145, icon: '☕' },
  { id: 2, categoryName: 'Java并发', questionCount: 98, icon: '🔄' },
  { id: 3, categoryName: 'JVM', questionCount: 76, icon: '🔧' },
  { id: 4, categoryName: 'Spring', questionCount: 123, icon: '🌿' },
  { id: 5, categoryName: '数据库', questionCount: 189, icon: '🗄️' },
  { id: 6, categoryName: 'Redis', questionCount: 67, icon: '🔴' },
  { id: 7, categoryName: '消息队列', questionCount: 45, icon: '📨' },
  { id: 8, categoryName: '分布式', questionCount: 234, icon: '🌐' }
]

const mockHotQuestions = [
  { id: 1, title: 'HashMap底层原理是什么？', difficulty: 2, viewCount: 5420, category: { categoryName: 'Java基础' } },
  { id: 2, title: 'Spring的IoC和AOP原理', difficulty: 3, viewCount: 4850, category: { categoryName: 'Spring' } },
  { id: 3, title: 'JVM内存模型详解', difficulty: 3, viewCount: 4320, category: { categoryName: 'JVM' } },
  { id: 4, title: 'MySQL索引优化策略', difficulty: 2, viewCount: 3890, category: { categoryName: '数据库' } },
  { id: 5, title: '分布式事务解决方案', difficulty: 3, viewCount: 3560, category: { categoryName: '分布式' } }
]

const mockStats = {
  newStudyCount: 8,
  masteryCount: 45,
  studyDuration: 3240 // 秒
}

export default function InterviewHomePage() {
  const router = useRouter()
  const [reviewCount] = useState(12)

  const getDifficultyColor = (difficulty: number) => {
    switch(difficulty) {
      case 1: return 'green'
      case 2: return 'orange'
      case 3: return 'red'
      default: return 'default'
    }
  }

  const getDifficultyText = (difficulty: number) => {
    switch(difficulty) {
      case 1: return '简单'
      case 2: return '中等'
      case 3: return '困难'
      default: return '未知'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="text-center">
            <Statistic
              title="今日学习"
              value={mockStats.newStudyCount}
              prefix={<BookOutlined />}
              suffix="题"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="text-center">
            <Statistic
              title="待复习"
              value={reviewCount}
              prefix={<SyncOutlined />}
              suffix="题"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="text-center">
            <Statistic
              title="已掌握"
              value={mockStats.masteryCount}
              prefix={<TrophyOutlined />}
              suffix="题"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="text-center">
            <Statistic
              title="学习时长"
              value={Math.floor(mockStats.studyDuration / 60)}
              prefix={<ClockCircleOutlined />}
              suffix="分钟"
            />
          </Card>
        </Col>
      </Row>

      {/* 快速开始 */}
      <Card 
        title={
          <Space>
            <RocketOutlined />
            <span>快速开始</span>
          </Space>
        }
        className="mb-8"
      >
        <Space wrap size="large">
          <Button 
            type="primary" 
            size="large" 
            icon={<BookOutlined />}
            onClick={() => router.push('/interview/banks')}
          >
            题库列表
          </Button>
          {reviewCount > 0 && (
            <Button 
              type="default" 
              size="large" 
              danger
              icon={<SyncOutlined />}
              onClick={() => router.push('/interview/study/review')}
            >
              复习 {reviewCount} 道题
            </Button>
          )}
          <Button 
            type="default" 
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={() => router.push('/interview/study')}
          >
            学习中心
          </Button>
        </Space>
      </Card>

      {/* 分类导航 */}
      <Card 
        title={
          <Space>
            <FolderOpenOutlined />
            <span>题目分类</span>
          </Space>
        }
        extra={
          <Link href="/interview/banks">
            <Button type="link" icon={<ArrowRightOutlined />}>
              查看全部
            </Button>
          </Link>
        }
        className="mb-8"
      >
        <Row gutter={[16, 16]}>
          {mockCategories.slice(0, 8).map((category) => (
            <Col xs={24} sm={12} md={6} key={category.id}>
              <Card
                hoverable
                className="text-center cursor-pointer"
                onClick={() => router.push(`/interview/banks?category=${category.id}`)}
              >
                <div className="text-2xl mb-2">
                  {category.icon}
                </div>
                <div className="font-medium text-base mb-1">
                  {category.categoryName}
                </div>
                <div className="text-gray-500 text-sm">
                  {category.questionCount} 道题
                </div>
                <Progress 
                  percent={Math.min(90, Math.max(20, category.questionCount / 2))} 
                  size="small" 
                  showInfo={false}
                  className="mt-2"
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 热门题目 */}
      <Card
        title={
          <Space>
            <FireOutlined />
            <span>热门题目</span>
          </Space>
        }
        extra={
          <Link href="/interview/banks?sortBy=viewCount">
            <Button type="link" icon={<ArrowRightOutlined />}>
              更多热门
            </Button>
          </Link>
        }
      >
        <div className="space-y-3">
          {mockHotQuestions.map((question, index: number) => (
            <div 
              key={question.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={() => router.push(`/interview/question/${question.id}`)}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                  ${index < 3 ? 'bg-red-500' : 'bg-gray-400'}
                `}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">
                    {question.title}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <Space>
                      <span>{question.category.categoryName}</span>
                      <span>·</span>
                      <span>{question.viewCount} 次浏览</span>
                    </Space>
                  </div>
                </div>
                <Tag color={getDifficultyColor(question.difficulty)}>
                  {getDifficultyText(question.difficulty)}
                </Tag>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
