'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Card, 
  Input, 
  Select, 
  Button, 
  Form, 
  Switch, 
  message, 
  Row, 
  Col,
  Breadcrumb,
  Typography,
  Space,
  Tag,
  Radio
} from 'antd'
import { 
  SaveOutlined, 
  SendOutlined, 
  EyeOutlined,
  PlusOutlined,
  HomeOutlined,
  EditOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { articleAPI, categoryAPI, tagAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Category, Tag as TagType, ArticleRequest } from '@/types/api'
import Link from 'next/link'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

export default function EditorPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [form] = Form.useForm()
  
  // 状态管理
  const [categories, setCategories] = useState<Category[]>([])
  const [allTags, setAllTags] = useState<TagType[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newTagName, setNewTagName] = useState('')

  // 检查认证状态
  useEffect(() => {
    if (!isAuthenticated) {
      message.error('请先登录')
      router.push('/login?redirect=/editor')
      return
    }
  }, [isAuthenticated, router])

  // 初始化数据
  useEffect(() => {
    fetchCategories()
    fetchTags()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getList()
      if (response.code === 200) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await tagAPI.getList()
      if (response.code === 200) {
        setAllTags(response.data)
      }
    } catch (error) {
      console.error('获取标签失败:', error)
    }
  }

  // 添加新标签
  const handleAddTag = async () => {
    if (!newTagName.trim()) return
    
    try {
      const response = await tagAPI.create({ 
        name: newTagName.trim(),
        color: '#1890ff'
      })
      if (response.code === 200) {
        const newTag = response.data
        setAllTags([...allTags, newTag])
        setSelectedTags([...selectedTags, newTag.id])
        setNewTagName('')
        message.success('标签创建成功')
      }
    } catch (error) {
      message.error('标签创建失败')
    }
  }

  // 移除标签
  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId))
  }

  // 保存草稿
  const handleSaveDraft = async (values: any) => {
    setSaving(true)
    try {
      const articleData: ArticleRequest = {
        ...values,
        tagIds: selectedTags,
        status: 0 // 草稿状态
      }
      
      const response = await articleAPI.create(articleData)
      if (response.code === 200) {
        message.success('草稿保存成功')
      }
    } catch (error) {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  // 发布文章
  const handlePublish = async (values: any) => {
    setLoading(true)
    try {
      const articleData: ArticleRequest = {
        ...values,
        tagIds: selectedTags,
        status: 1 // 发布状态
      }
      
      const response = await articleAPI.create(articleData)
      if (response.code === 200) {
        message.success('文章发布成功')
        router.push(`/articles/${response.data.id}`)
      }
    } catch (error) {
      message.error('发布失败')
    } finally {
      setLoading(false)
    }
  }

  // 表单提交
  const onFinish = (values: any) => {
    // 根据点击的按钮决定是保存草稿还是发布
    if (saving) {
      handleSaveDraft(values)
    } else {
      handlePublish(values)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* 面包屑导航 */}
        <Breadcrumb style={{ marginBottom: 24 }}>
          <Breadcrumb.Item>
            <Link href="/">
              <HomeOutlined /> 首页
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/articles">
              文章列表
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <EditOutlined /> 写文章
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={1}>✏️ 文章编辑</Title>
          <Text type="secondary">分享你的技术见解和经验</Text>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              articleType: 1,
              isTop: false,
              isRecommend: false
            }}
          >
            <Row gutter={24}>
              <Col xs={24} lg={16}>
                {/* 标题 */}
                <Form.Item
                  label="文章标题"
                  name="title"
                  rules={[
                    { required: true, message: '请输入文章标题' },
                    { min: 5, message: '标题至少5个字符' },
                    { max: 100, message: '标题不能超过100个字符' }
                  ]}
                >
                  <Input 
                    placeholder="输入一个吸引人的标题..." 
                    size="large"
                  />
                </Form.Item>

                {/* 内容 */}
                <Form.Item
                  label="文章内容"
                  name="content"
                  rules={[
                    { required: true, message: '请输入文章内容' },
                    { min: 50, message: '内容至少50个字符' }
                  ]}
                >
                  <TextArea
                    placeholder="使用Markdown语法编写文章内容...&#10;&#10;# 这是一级标题&#10;## 这是二级标题&#10;&#10;这是段落内容..."
                    rows={20}
                    style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                  />
                </Form.Item>

                {/* 摘要 */}
                <Form.Item
                  label="文章摘要"
                  name="summary"
                  extra="留空将自动从内容中提取"
                >
                  <TextArea
                    placeholder="简要描述文章内容..."
                    rows={3}
                    maxLength={200}
                    showCount
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                {/* 基本设置 */}
                <Card title="基本设置" size="small" style={{ marginBottom: 16 }}>
                  {/* 分类 */}
                  <Form.Item
                    label="文章分类"
                    name="categoryId"
                    rules={[{ required: true, message: '请选择文章分类' }]}
                  >
                    <Select placeholder="选择分类">
                      {categories.map((category) => (
                        <Option key={category.id} value={category.id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* 标签 */}
                  <Form.Item label="文章标签">
                    <div style={{ marginBottom: 8 }}>
                      <Input.Group compact>
                        <Input
                          style={{ width: 'calc(100% - 80px)' }}
                          placeholder="添加新标签"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          onPressEnter={handleAddTag}
                        />
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />}
                          onClick={handleAddTag}
                          disabled={!newTagName.trim()}
                        >
                          添加
                        </Button>
                      </Input.Group>
                    </div>
                    
                    <Select
                      mode="multiple"
                      placeholder="选择已有标签"
                      value={selectedTags}
                      onChange={setSelectedTags}
                      style={{ width: '100%' }}
                    >
                      {allTags.map((tag) => (
                        <Option key={tag.id} value={tag.id}>
                          {tag.name}
                        </Option>
                      ))}
                    </Select>

                    {/* 已选标签显示 */}
                    <div style={{ marginTop: 8 }}>
                      {selectedTags.map((tagId) => {
                        const tag = allTags.find(t => t.id === tagId)
                        if (!tag) return null
                        return (
                          <Tag
                            key={tagId}
                            closable
                            color={tag.color || 'default'}
                            onClose={() => handleRemoveTag(tagId)}
                            style={{ marginBottom: 4 }}
                          >
                            {tag.name}
                          </Tag>
                        )
                      })}
                    </div>
                  </Form.Item>

                  {/* 文章类型 */}
                  <Form.Item
                    label="文章类型"
                    name="articleType"
                  >
                    <Radio.Group>
                      <Radio value={1}>原创</Radio>
                      <Radio value={2}>转载</Radio>
                      <Radio value={3}>翻译</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {/* 原文链接（转载/翻译时显示） */}
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => 
                      prevValues.articleType !== currentValues.articleType
                    }
                  >
                    {({ getFieldValue }) => 
                      getFieldValue('articleType') !== 1 && (
                        <Form.Item
                          label="原文链接"
                          name="originalUrl"
                          rules={[
                            { required: true, message: '请输入原文链接' },
                            { type: 'url', message: '请输入有效的URL' }
                          ]}
                        >
                          <Input placeholder="https://example.com/article" />
                        </Form.Item>
                      )
                    }
                  </Form.Item>
                </Card>

                {/* 高级设置 */}
                <Card title="高级设置" size="small" style={{ marginBottom: 16 }}>
                  {/* 封面图 */}
                  <Form.Item label="封面图URL" name="coverImage">
                    <Input placeholder="https://example.com/cover.jpg" />
                  </Form.Item>

                  {/* SEO设置 */}
                  <Form.Item label="SEO关键词" name="keywords">
                    <Input placeholder="用逗号分隔多个关键词" />
                  </Form.Item>

                  <Form.Item label="SEO描述" name="description">
                    <TextArea 
                      placeholder="用于搜索引擎展示的描述"
                      rows={2}
                      maxLength={160}
                      showCount
                    />
                  </Form.Item>

                  {/* 文章选项 */}
                  <Form.Item label="文章选项">
                    <Form.Item name="isTop" valuePropName="checked" style={{ marginBottom: 8 }}>
                      <Switch size="small" /> 置顶文章
                    </Form.Item>
                    <Form.Item name="isRecommend" valuePropName="checked" style={{ marginBottom: 0 }}>
                      <Switch size="small" /> 推荐文章
                    </Form.Item>
                  </Form.Item>
                </Card>

                {/* 操作按钮 */}
                <Card size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                      type="primary" 
                      size="large" 
                      block
                      icon={<SendOutlined />}
                      loading={loading}
                      htmlType="submit"
                      onClick={() => setSaving(false)}
                    >
                      发布文章
                    </Button>
                    
                    <Button 
                      size="large" 
                      block
                      icon={<SaveOutlined />}
                      loading={saving}
                      htmlType="submit"
                      onClick={() => setSaving(true)}
                    >
                      保存草稿
                    </Button>

                    <Button 
                      size="large" 
                      block
                      icon={<EyeOutlined />}
                      onClick={() => {
                        // 预览功能 - 可以后续扩展
                        message.info('预览功能开发中...')
                      }}
                    >
                      预览文章
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  )
}
