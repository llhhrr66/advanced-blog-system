'use client'

import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Input,
  Select,
  Card,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  TreeSelect,
  Tag,
  Switch,
  Tooltip,
  Drawer,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { Question, Category as InterviewCategory } from '@/types/interview'
import { interviewQuestionApi, interviewCategoryApi } from '@/services/interview-admin'
import Link from 'next/link'

const { Search } = Input
const { Option } = Select
const { TextArea } = Input

interface QuestionFormData {
  categoryId: number
  title: string
  content: string
  difficulty: number
  status: number
  source?: string
  sourceUrl?: string
}

export default function InterviewQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<InterviewCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null)
  const [form] = Form.useForm()
  
  // 筛选参数
  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: undefined as number | undefined,
    difficulty: undefined as number | undefined,
    status: undefined as number | undefined,
  })

  // 分页参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  // 加载面试题列表
  const loadQuestions = async () => {
    setLoading(true)
    try {
      const response = await interviewQuestionApi.getQuestions({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
      })
      
      if (response.success && response.data) {
        setQuestions(response.data.records)
        setPagination(prev => ({
          ...prev,
          total: response.data!.total,
        }))
      }
    } catch (error) {
      message.error('加载面试题列表失败')
      console.error('Error loading questions:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载分类列表
  const loadCategories = async () => {
    try {
      const response = await interviewCategoryApi.getCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  useEffect(() => {
    loadQuestions()
  }, [pagination.current, pagination.pageSize, filters])

  useEffect(() => {
    loadCategories()
  }, [])

  // 难度标签渲染
  const renderDifficulty = (difficulty: number) => {
    const difficultyMap = {
      1: { text: '简单', color: 'green' },
      2: { text: '中等', color: 'orange' },
      3: { text: '困难', color: 'red' },
    }
    const config = difficultyMap[difficulty as keyof typeof difficultyMap]
    return <Tag color={config?.color}>{config?.text}</Tag>
  }

  // 状态标签渲染
  const renderStatus = (status: number) => {
    const statusMap = {
      0: { text: '草稿', color: 'gray' },
      1: { text: '发布', color: 'green' },
      2: { text: '归档', color: 'blue' },
    }
    const config = statusMap[status as keyof typeof statusMap]
    return <Tag color={config?.color}>{config?.text}</Tag>
  }

  // 表格列定义
  const columns: ColumnsType<Question> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text: string, record: Question) => (
        <Tooltip title={text}>
          <a onClick={() => handleViewQuestion(record)}>{text}</a>
        </Tooltip>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: InterviewCategory) => category?.categoryName || '-',
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      render: renderDifficulty,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: renderStatus,
    },
    {
      title: '浏览数',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record: Question) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewQuestion(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditQuestion(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这道面试题吗？"
            onConfirm={() => handleDeleteQuestion(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 处理搜索
  const handleSearch = (keyword: string) => {
    setFilters(prev => ({ ...prev, keyword }))
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  // 处理筛选
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  // 处理新增
  const handleAddQuestion = () => {
    setEditingQuestion(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  // 处理编辑
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    form.setFieldsValue({
      categoryId: question.categoryId,
      title: question.title,
      content: question.content,
      difficulty: question.difficulty,
      status: question.status,
      source: question.source,
      sourceUrl: question.sourceUrl,
    })
    setIsModalVisible(true)
  }

  // 处理查看
  const handleViewQuestion = (question: Question) => {
    setViewingQuestion(question)
    setIsDrawerVisible(true)
  }

  // 处理表单提交
  const handleSubmit = async (values: QuestionFormData) => {
    try {
      if (editingQuestion) {
        await interviewQuestionApi.updateQuestion(editingQuestion.id, values)
        message.success('更新成功')
      } else {
        await interviewQuestionApi.createQuestion(values)
        message.success('创建成功')
      }
      
      setIsModalVisible(false)
      loadQuestions()
    } catch (error) {
      message.error(editingQuestion ? '更新失败' : '创建失败')
      console.error('Error submitting question:', error)
    }
  }

  // 处理删除
  const handleDeleteQuestion = async (id: number) => {
    try {
      await interviewQuestionApi.deleteQuestion(id)
      message.success('删除成功')
      loadQuestions()
    } catch (error) {
      message.error('删除失败')
      console.error('Error deleting question:', error)
    }
  }

  // 处理批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的面试题')
      return
    }
    
    try {
      await interviewQuestionApi.deleteQuestions(selectedRowKeys)
      message.success('批量删除成功')
      setSelectedRowKeys([])
      loadQuestions()
    } catch (error) {
      message.error('批量删除失败')
      console.error('Error batch deleting questions:', error)
    }
  }

  // 处理状态切换
  const handleStatusChange = async (id: number, checked: boolean) => {
    const status = checked ? 1 : 0
    try {
      await interviewQuestionApi.updateQuestionStatus(id, status)
      message.success('状态更新成功')
      loadQuestions()
    } catch (error) {
      message.error('状态更新失败')
      console.error('Error updating status:', error)
    }
  }

  // 转换分类数据为TreeSelect格式
  const getCategoryTreeData = (categories: InterviewCategory[]): any[] => {
    return categories.map(category => ({
      title: category.categoryName,
      value: category.id,
      key: category.id,
      children: category.children ? getCategoryTreeData(category.children) : undefined,
    }))
  }

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space size="middle">
            <Search
              placeholder="搜索面试题标题"
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
            <Select
              placeholder="选择分类"
              allowClear
              style={{ width: 200 }}
              onChange={(value) => handleFilterChange('categoryId', value)}
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.categoryName}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="选择难度"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => handleFilterChange('difficulty', value)}
            >
              <Option value={1}>简单</Option>
              <Option value={2}>中等</Option>
              <Option value={3}>困难</Option>
            </Select>
            <Select
              placeholder="选择状态"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value={0}>草稿</Option>
              <Option value={1}>发布</Option>
              <Option value={2}>归档</Option>
            </Select>
          </Space>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddQuestion}>
              新增面试题
            </Button>
            <Popconfirm
              title="确定要删除选中的面试题吗？"
              onConfirm={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
            >
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                disabled={selectedRowKeys.length === 0}
              >
                批量删除
              </Button>
            </Popconfirm>
            <Link href="/admin/interview-questions/import">
              <Button icon={<UploadOutlined />}>批量导入</Button>
            </Link>
          </Space>
        </div>

        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={columns}
          dataSource={questions}
          loading={loading}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize }))
            },
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingQuestion ? '编辑面试题' : '新增面试题'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="categoryId"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <TreeSelect
              placeholder="请选择分类"
              treeData={getCategoryTreeData(categories)}
              allowClear
            />
          </Form.Item>
          
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入面试题标题" />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea
              rows={8}
              placeholder="请输入面试题内容（支持Markdown）"
            />
          </Form.Item>
          
          <Form.Item
            name="difficulty"
            label="难度"
            rules={[{ required: true, message: '请选择难度' }]}
          >
            <Select placeholder="请选择难度">
              <Option value={1}>简单</Option>
              <Option value={2}>中等</Option>
              <Option value={3}>困难</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={0}>草稿</Option>
              <Option value={1}>发布</Option>
              <Option value={2}>归档</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="source"
            label="来源"
          >
            <Input placeholder="请输入来源" />
          </Form.Item>
          
          <Form.Item
            name="sourceUrl"
            label="来源链接"
          >
            <Input placeholder="请输入来源链接" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看详情抽屉 */}
      <Drawer
        title="面试题详情"
        placement="right"
        width={800}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {viewingQuestion && (
          <div>
            <h3>{viewingQuestion.title}</h3>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <strong>分类：</strong>
                {viewingQuestion.category?.categoryName || '-'}
              </div>
              <div>
                <strong>难度：</strong>
                {renderDifficulty(viewingQuestion.difficulty)}
              </div>
              <div>
                <strong>状态：</strong>
                {renderStatus(viewingQuestion.status)}
              </div>
              {viewingQuestion.source && (
                <div>
                  <strong>来源：</strong>
                  {viewingQuestion.sourceUrl ? (
                    <a href={viewingQuestion.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {viewingQuestion.source}
                    </a>
                  ) : (
                    viewingQuestion.source
                  )}
                </div>
              )}
              <div>
                <strong>内容：</strong>
                <div style={{ 
                  marginTop: 8, 
                  padding: 16, 
                  backgroundColor: '#f5f5f5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {viewingQuestion.content}
                </div>
              </div>
              <div>
                <strong>统计：</strong>
                浏览 {viewingQuestion.viewCount} · 点赞 {viewingQuestion.likeCount} · 收藏 {viewingQuestion.collectCount}
              </div>
              <div>
                <strong>时间：</strong>
                创建于 {new Date(viewingQuestion.createTime).toLocaleString()}
                {viewingQuestion.updateTime && (
                  <span> · 更新于 {new Date(viewingQuestion.updateTime).toLocaleString()}</span>
                )}
              </div>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  )
}
