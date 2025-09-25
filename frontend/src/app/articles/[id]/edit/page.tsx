'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  Breadcrumb,
  message,
  Spin,
  Row,
  Col,
  Switch
} from 'antd'
import { 
  SaveOutlined, 
  ArrowLeftOutlined,
  HomeOutlined,
  BookOutlined,
  EditOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { articleAPI, categoryAPI, tagAPI } from '@/lib/api'
import type { Article, Category, Tag, ArticleRequest } from '@/types/api'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// 动态导入Markdown编辑器，避免SSR问题
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const { TextArea } = Input
const { Option } = Select

export default function ArticleEditPage() {
  const params = useParams()
  const router = useRouter()
  const [form] = Form.useForm()
  const [article, setArticle] = useState<Article | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState('')

  const articleId = Number(params.id)

  useEffect(() => {
    if (articleId) {
      fetchData()
    }
  }, [articleId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [articleRes, categoriesRes, tagsRes] = await Promise.all([
        articleAPI.getDetail(articleId),
        categoryAPI.getList(),
        tagAPI.getList()
      ])

      if (articleRes.code === 200) {
        const articleData = articleRes.data
        setArticle(articleData)
        setContent(articleData.content || '')
        
        // 填充表单
        form.setFieldsValue({
          title: articleData.title,
          summary: articleData.excerpt || '',
          categoryId: articleData.categoryId,
          tagIds: articleData.tags?.map(tag => tag.id) || [],
          status: articleData.status === 'PUBLISHED' ? 1 : 0,
          isTop: articleData.isTop,
          isRecommend: articleData.isFeatured,
          coverImage: articleData.coverImage,
          keywords: '', // 需要从后端获取
          description: ''  // 需要从后端获取
        })
      } else {
        message.error('文章不存在或已被删除')
        router.push('/articles')
      }

      if (categoriesRes.code === 200) {
        setCategories(categoriesRes.data)
      }

      if (tagsRes.code === 200) {
        setTags(tagsRes.data)
      }
    } catch (error) {
      console.error('获取数据失败:', error)
      message.error('获取数据失败')
      router.push('/articles')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true)
      
      const articleData: ArticleRequest = {
        title: values.title,
        content: content,
        summary: values.summary,
        coverImage: values.coverImage,
        categoryId: values.categoryId,
        tagIds: values.tagIds || [],
        status: values.status ? 1 : 0,
        isTop: values.isTop || false,
        isRecommend: values.isRecommend || false,
        articleType: 1, // 默认原创
        keywords: values.keywords || '',
        description: values.description || values.summary
      }

      const response = await articleAPI.update(articleId, articleData)
      
      if (response.code === 200) {
        message.success('文章更新成功')
        router.push(`/articles/${articleId}`)
      } else {
        message.error(response.message || '更新失败')
      }
    } catch (error) {
      console.error('更新文章失败:', error)
      message.error('更新文章失败')
    } finally {
      setSaving(false)
    }
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
                <Link href="/articles">
                  <BookOutlined /> 文章列表
                </Link>
              )
            },
            {
              title: (
                <Link href={`/articles/${articleId}`}>
                  文章详情
                </Link>
              )
            },
            {
              title: (
                <span>
                  <EditOutlined /> 编辑文章
                </span>
              )
            }
          ]}
        />

        {/* 页面头部 */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>编辑文章</h1>
            <p style={{ margin: '8px 0 0', color: '#666' }}>编辑文章「{article.title}」</p>
          </div>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.back()}
          >
            返回
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ background: '#fff' }}
          >
            <Card>
              <Row gutter={24}>
                {/* 左侧主要内容 */}
                <Col xs={24} lg={16}>
                  <Form.Item
                    label="文章标题"
                    name="title"
                    rules={[{ required: true, message: '请输入文章标题' }]}
                  >
                    <Input placeholder="请输入文章标题" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="文章摘要"
                    name="summary"
                  >
                    <TextArea 
                      placeholder="请输入文章摘要" 
                      rows={3}
                      showCount
                      maxLength={200}
                    />
                  </Form.Item>

                  <Form.Item
                    label="文章内容"
                    required
                  >
                    <div style={{ minHeight: 400 }}>
                      <MDEditor
                        value={content}
                        onChange={(val) => setContent(val || '')}
                        height={400}
                        preview="edit"
                        data-color-mode="light"
                      />
                    </div>
                  </Form.Item>
                </Col>

                {/* 右侧设置面板 */}
                <Col xs={24} lg={8}>
                  <Card title="文章设置" size="small" style={{ marginBottom: 16 }}>
                    <Form.Item
                      label="分类"
                      name="categoryId"
                      rules={[{ required: true, message: '请选择分类' }]}
                    >
                      <Select placeholder="请选择分类" allowClear>
                        {categories.map((category) => (
                          <Option key={category.id} value={category.id}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="标签"
                      name="tagIds"
                    >
                      <Select 
                        mode="multiple" 
                        placeholder="请选择标签" 
                        allowClear
                        maxTagCount="responsive"
                      >
                        {tags.map((tag) => (
                          <Option key={tag.id} value={tag.id}>
                            {tag.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="封面图片"
                      name="coverImage"
                    >
                      <Input placeholder="请输入封面图片URL" />
                    </Form.Item>

                    <Form.Item
                      label="关键词"
                      name="keywords"
                    >
                      <Input placeholder="多个关键词用逗号分隔" />
                    </Form.Item>

                    <Form.Item
                      label="SEO描述"
                      name="description"
                    >
                      <TextArea 
                        placeholder="用于SEO的文章描述" 
                        rows={3}
                        showCount
                        maxLength={160}
                      />
                    </Form.Item>
                  </Card>

                  <Card title="发布设置" size="small">
                    <Form.Item
                      label="发布状态"
                      name="status"
                      valuePropName="checked"
                    >
                      <Switch 
                        checkedChildren="发布" 
                        unCheckedChildren="草稿" 
                      />
                    </Form.Item>

                    <Form.Item
                      name="isTop"
                      valuePropName="checked"
                    >
                      <Switch 
                        checkedChildren="置顶" 
                        unCheckedChildren="普通" 
                      />
                    </Form.Item>

                    <Form.Item
                      name="isRecommend"
                      valuePropName="checked"
                    >
                      <Switch 
                        checkedChildren="推荐" 
                        unCheckedChildren="普通" 
                      />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>

              {/* 操作按钮 */}
              <div style={{ 
                marginTop: 24, 
                paddingTop: 24, 
                borderTop: '1px solid #f0f0f0',
                textAlign: 'right' 
              }}>
                <Space>
                  <Button onClick={() => router.back()}>
                    取消
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={saving}
                    icon={<SaveOutlined />}
                  >
                    保存文章
                  </Button>
                </Space>
              </div>
            </Card>
          </Form>
        </motion.div>
      </div>
    </div>
  )
}
