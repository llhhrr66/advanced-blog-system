'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Card, 
  Typography, 
  Tag, 
  Space, 
  Button, 
  Avatar, 
  Divider, 
  Breadcrumb,
  message,
  Spin,
  Modal
} from 'antd'
import { 
  EyeOutlined, 
  HeartOutlined, 
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  BookOutlined,
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { articleAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Article } from '@/types/api'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const { Title, Text, Paragraph } = Typography

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  const articleId = Number(params.id)

  useEffect(() => {
    if (articleId) {
      fetchArticle()
    }
  }, [articleId])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      const response = await articleAPI.getDetail(articleId)
      if (response.code === 200) {
        setArticle(response.data)
      } else {
        message.error('文章不存在或已被删除')
        router.push('/articles')
      }
    } catch (error) {
      console.error('获取文章详情失败:', error)
      message.error('获取文章详情失败')
      router.push('/articles')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    if (!article) return
    
    Modal.confirm({
      title: '确认删除',
      content: `您确定要删除文章「${article.title}」吗？此操作不可恢复。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await articleAPI.delete(article.id)
          if (response.code === 200) {
            message.success('删除成功')
            router.push('/articles')
          }
        } catch (error) {
          message.error('删除失败')
        }
      },
    })
  }

  const canEditArticle = () => {
    // 暂时禁用权限校验，方便调试
    return true
    // TODO: 后期恢复权限校验
    // if (!article || !isAuthenticated) return false
    // return user?.role === 'ADMIN' || user?.id === article.authorId
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  if (!article) {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
        {/* 面包屑导航 */}
        <Breadcrumb style={{ marginBottom: 24 }}>
          <Breadcrumb.Item>
            <Link href="/">
              <HomeOutlined /> 首页
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/articles">
              <BookOutlined /> 文章列表
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>文章详情</Breadcrumb.Item>
        </Breadcrumb>

        {/* 返回按钮 */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          style={{ marginBottom: 16 }}
        >
          返回
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            {/* 文章头部 */}
            <div style={{ marginBottom: 24 }}>
              <Title level={1} style={{ marginBottom: 16 }}>
                {article.title}
              </Title>
              
              {/* 作者信息和发布时间 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 16 
              }}>
                <Space size="middle">
                  <Avatar 
                    src={article.author?.avatar} 
                    icon={<UserOutlined />}
                    size="large"
                  />
                  <div>
                    <Text strong>{article.author?.nickname || '未知作者'}</Text>
                    <br />
                    <Text type="secondary">
                      <CalendarOutlined style={{ marginRight: 4 }} />
                      {new Date(article.publishTime || article.createdAt).toLocaleString()}
                    </Text>
                  </div>
                </Space>

                {/* 操作按钮 */}
                {canEditArticle() && (
                  <Space>
                    <Link href={`/articles/${article.id}/edit`}>
                      <Button icon={<EditOutlined />}>编辑</Button>
                    </Link>
                    <Button 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={handleDelete}
                    >
                      删除
                    </Button>
                  </Space>
                )}
              </div>

              {/* 分类和标签 */}
              <div style={{ marginBottom: 16 }}>
                {article.category && (
                  <Tag color="blue" style={{ marginRight: 8 }}>
                    {article.category.name}
                  </Tag>
                )}
                {article.tags?.map((tag) => (
                  <Tag key={tag.id} color={tag.color || 'default'}>
                    {tag.name}
                  </Tag>
                ))}
              </div>

              {/* 统计数据 */}
              <Space size="large" style={{ color: '#666' }}>
                <Space size="small">
                  <EyeOutlined />
                  <Text type="secondary">{article.viewCount || 0} 阅读</Text>
                </Space>
                <Space size="small">
                  <HeartOutlined />
                  <Text type="secondary">{article.likeCount || 0} 点赞</Text>
                </Space>
                <Space size="small">
                  <MessageOutlined />
                  <Text type="secondary">{article.commentCount || 0} 评论</Text>
                </Space>
              </Space>
            </div>

            <Divider />

            {/* 文章摘要 */}
            {article.excerpt && (
              <div style={{ marginBottom: 24 }}>
                <Paragraph style={{ 
                  fontSize: 16, 
                  color: '#666',
                  fontStyle: 'italic',
                  padding: 16,
                  backgroundColor: '#f9f9f9',
                  borderLeft: '4px solid #1890ff',
                  borderRadius: 4
                }}>
                  {article.excerpt}
                </Paragraph>
              </div>
            )}

            {/* 文章内容 */}
            <div style={{ 
              minHeight: 400,
              fontSize: 16,
              lineHeight: 1.8 
            }}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <Title level={2}>{children}</Title>,
                  h2: ({ children }) => <Title level={3}>{children}</Title>,
                  h3: ({ children }) => <Title level={4}>{children}</Title>,
                  p: ({ children }) => <Paragraph style={{ marginBottom: 16 }}>{children}</Paragraph>,
                  blockquote: ({ children }) => (
                    <div style={{
                      padding: '12px 16px',
                      margin: '16px 0',
                      backgroundColor: '#f6f8fa',
                      borderLeft: '4px solid #d0d7de',
                      color: '#656d76'
                    }}>
                      {children}
                    </div>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className
                    return isInline ? (
                      <code style={{
                        backgroundColor: '#f6f8fa',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontSize: '0.9em'
                      }}>
                        {children}
                      </code>
                    ) : (
                      <pre style={{
                        backgroundColor: '#f6f8fa',
                        padding: '12px',
                        borderRadius: '6px',
                        overflow: 'auto',
                        fontSize: '0.9em'
                      }}>
                        <code>{children}</code>
                      </pre>
                    )
                  }
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
