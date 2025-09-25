'use client'

import { Card, Row, Col, Button, Space, Statistic } from 'antd'
import {
  FileTextOutlined,
  CodeOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <Card className="mb-6">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={12}>
            <h1 className="text-4xl font-bold mb-2">欢迎来到 技术博客</h1>
            <p className="text-gray-600 mb-4">分享技术知识，包含完整的Java面试题库</p>
            <Space>
              <Button type="primary" size="large" onClick={() => router.push('/articles')}>
                浏览文章
              </Button>
              <Button size="large" onClick={() => router.push('/interview')}>
                Java面试
              </Button>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="文章总数" value={156} prefix={<FileTextOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="面试题库" value={1275} prefix={<CodeOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="总访问量" value={89234} prefix={<EyeOutlined />} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
