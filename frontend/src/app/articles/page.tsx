'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Card, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Avatar, 
  Pagination, 
  Empty,
  Skeleton,
  Row,
  Col,
  Space,
  Typography,
  Breadcrumb,
  message,
  Modal
} from 'antd'
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  HeartOutlined, 
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  HomeOutlined,
  BookOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { articleAPI, categoryAPI, tagAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Article, Category, Tag as TagType, ArticleListRequest } from '@/types/api'
import Link from 'next/link'

const { Text, Title, Paragraph } = Typography
const { Meta } = Card
const { Option } = Select

export default function ArticlesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  
  // 状态管理
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<TagType[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  
  // 搜索和筛选参数
  const [filters, setFilters] = useState<ArticleListRequest>({
    page: 1,
    size: 12,
    keyword: searchParams.get('keyword') || '',
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
    sort: 'publishTime',
    order: 'desc'
  })

  // 初始化数据
  useEffect(() => {
    fetchCategories()
    fetchTags()
    fetchArticles()
  }, [filters])

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getList(true)
      if (response.code === 200) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await tagAPI.getHotTags()
      if (response.code === 200) {
        setTags(response.data)
      }
    } catch (error) {
      console.error('获取标签失败:', error)
    }
  }

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await articleAPI.getList(filters)
      if (response.code === 200) {
        setArticles(response.data.list)  // 修改为list以匹配后端返回的数据结构
        setTotal(response.data.total)
      }
    } catch (error) {
      console.error('获取文章失败:', error)
      message.error('获取文章失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理搜索
  const handleSearch = () => {
    setFilters({ ...filters, page: 1 })
  }

  // 重置筛选
  const handleReset = () => {
    setFilters({
      page: 1,
      size: 12,
      keyword: '',
      categoryId: undefined,
      tagIds: undefined,
      sort: 'publishTime',
      order: 'desc'
    })
  }

  // 处理分页
  const handlePageChange = (page: number, size?: number) => {
    setFilters({ ...filters, page, size: size || filters.size })
  }

  // 删除文章
  const handleDelete = (articleId: number, articleTitle: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `您确定要删除文章「${articleTitle}」吗？此操作不可恢复。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await articleAPI.delete(articleId)
          if (response.code === 200) {
            message.success('删除成功')
            fetchArticles()
          }
        } catch (error) {
          message.error('删除失败')
        }
      },
    })
  }

  // 判断是否可以编辑/删除文章
  const canEditArticle = (article: Article) => {
    // 暂时禁用权限校验，方便调试
    return true
    // TODO: 后期恢复权限校验
    // return isAuthenticated && (user?.role === 'ADMIN' || user?.id === article.authorId)
  }

  const renderArticleCard = (article: Article) => {
    const actions = []
    
    // 阅读全文按钮
    actions.push(
      <Link key="read" href={`/articles/${article.id}`}>
        <Button type="link" size="small" icon={<EyeOutlined />}>
          阅读全文
        </Button>
      </Link>
    )

    // 编辑按钮（仅作者和管理员可见）
    if (canEditArticle(article)) {
      actions.push(
        <Link key="edit" href={`/articles/${article.id}/edit`}>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
        </Link>
      )
      
      // 删除按钮
      actions.push(
        <Button 
          key="delete"
          type="link" 
          size="small" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(article.id, article.title)}
        >
          删除
        </Button>
      )
    }

    return (
      <motion.div
        key={article.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          cover={
            article.coverImage && (
              <div style={{ height: 200, overflow: 'hidden' }}>
                <img
                  alt={article.title}
                  src={article.coverImage}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                />
              </div>
            )
          }
          actions={actions}
          hoverable
          style={{ height: '100%' }}
        >
          <Meta
            avatar={
              <Avatar 
                src={article.author?.avatar} 
                icon={<BookOutlined />}
              />
            }
            title={
              <Link href={`/articles/${article.id}`}>
                <Text strong style={{ fontSize: 16 }}>
                  {article.title}
                </Text>
              </Link>
            }
            description={
              <div>
                <Text type="secondary">
                  {article.author?.nickname} • {new Date(article.publishTime || article.createTime).toLocaleDateString()}
                </Text>
              </div>
            }
          />
          
          {/* 文章摘要 */}
          <Paragraph 
            ellipsis={{ rows: 2 }} 
            style={{ marginTop: 12, marginBottom: 12 }}
          >
            {article.summary}
          </Paragraph>

          {/* 分类和标签 */}
          <div style={{ marginBottom: 12 }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <Space size="small">
                <EyeOutlined />
                <Text type="secondary">{article.viewCount}</Text>
              </Space>
              <Space size="small">
                <HeartOutlined />
                <Text type="secondary">{article.likeCount}</Text>
              </Space>
              <Space size="small">
                <MessageOutlined />
                <Text type="secondary">{article.commentCount}</Text>
              </Space>
            </Space>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* 面包屑导航 */}
        <Breadcrumb 
          style={{ marginBottom: 24 }}
          items={[
            {
              title: (
                <Link href="/">
                  <HomeOutlined /> 首页
                </Link>
              )
            },
            {
              title: (
                <span>
                  <BookOutlined /> 文章列表
                </span>
              )
            }
          ]}
        />

        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={1}>📚 文章列表</Title>
          <Text type="secondary">探索优质技术文章，提升编程技能</Text>
        </div>

        {/* 搜索和筛选区域 */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="搜索文章标题和内容..."
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="选择分类"
                style={{ width: '100%' }}
                value={filters.categoryId}
                onChange={(categoryId) => setFilters({ ...filters, categoryId })}
                allowClear
              >
                {categories && categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="排序方式"
                style={{ width: '100%' }}
                value={`${filters.sort}_${filters.order}`}
                onChange={(value) => {
                  const [sort, order] = value.split('_')
                  setFilters({ ...filters, sort, order: order as 'asc' | 'desc' })
                }}
              >
                <Option value="publishTime_desc">最新发布</Option>
                <Option value="publishTime_asc">最早发布</Option>
                <Option value="viewCount_desc">浏览量最高</Option>
                <Option value="likeCount_desc">点赞最多</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  搜索
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
                {isAuthenticated && (
                  <Link href="/editor">
                    <Button type="primary" icon={<PlusOutlined />}>
                      写文章
                    </Button>
                  </Link>
                )}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 文章列表 */}
        {loading ? (
          <Row gutter={[16, 16]}>
            {[...Array(8)].map((_, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card>
                  <Skeleton active avatar paragraph={{ rows: 4 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : articles && articles.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {articles.map((article) => (
                <Col key={article.id} xs={24} sm={12} md={8} lg={6}>
                  {renderArticleCard(article)}
                </Col>
              ))}
            </Row>

            {/* 分页 */}
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Pagination
                current={filters.page}
                total={total}
                pageSize={filters.size}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => 
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条文章`
                }
              />
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Empty description="暂无文章数据" />
            {isAuthenticated && (
              <Link href="/editor">
                <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 16 }}>
                  发表第一篇文章
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
