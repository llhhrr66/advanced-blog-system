'use client'

import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Input,
  Card,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  TreeSelect,
  Tag,
  Tooltip,
  Tree,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { TreeDataNode } from 'antd'
import { Category as InterviewCategory } from '@/types/interview'
import { interviewCategoryApi } from '@/services/interview-admin'

const { Search } = Input
const { TextArea } = Input

interface CategoryFormData {
  parentId?: number
  categoryName: string
  description?: string
  icon?: string
  sortOrder?: number
}

export default function InterviewCategoriesPage() {
  const [categories, setCategories] = useState<InterviewCategory[]>([])
  const [flatCategories, setFlatCategories] = useState<InterviewCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isTreeModalVisible, setIsTreeModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<InterviewCategory | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [form] = Form.useForm()
  
  // 筛选参数
  const [filters, setFilters] = useState({
    keyword: '',
  })

  // 加载分类列表
  const loadCategories = async () => {
    setLoading(true)
    try {
      // 加载树形分类数据
      const treeResponse = await interviewCategoryApi.getCategories()
      if (treeResponse.success && treeResponse.data) {
        setCategories(treeResponse.data)
        // 默认展开所有节点
        const allKeys = getAllKeys(treeResponse.data)
        setExpandedKeys(allKeys)
      }
      
      // 加载平铺分类数据用于表格显示
      const listResponse = await interviewCategoryApi.getCategoriesList({
        pageNum: 1,
        pageSize: 1000, // 获取所有分类
        ...filters,
      })
      if (listResponse.success && listResponse.data) {
        setFlatCategories(listResponse.data.list)
      }
    } catch (error) {
      message.error('加载分类列表失败')
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取所有节点的key用于展开
  const getAllKeys = (categories: InterviewCategory[]): React.Key[] => {
    const keys: React.Key[] = []
    const traverse = (nodes: InterviewCategory[]) => {
      nodes.forEach(node => {
        keys.push(node.id)
        if (node.children && node.children.length > 0) {
          traverse(node.children)
        }
      })
    }
    traverse(categories)
    return keys
  }

  useEffect(() => {
    loadCategories()
  }, [filters])

  // 状态标签渲染
  const renderStatus = (status: number) => {
    const statusMap = {
      0: { text: '禁用', color: 'red' },
      1: { text: '启用', color: 'green' },
    }
    const config = statusMap[status as keyof typeof statusMap]
    return <Tag color={config?.color}>{config?.text}</Tag>
  }

  // 表格列定义
  const columns: ColumnsType<InterviewCategory> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text: string, record: InterviewCategory) => (
        <Space>
          {record.parentId === 0 ? <FolderOutlined /> : <FolderOpenOutlined />}
          {text}
        </Space>
      ),
    },
    {
      title: '父级分类',
      dataIndex: 'parentId',
      key: 'parentId',
      width: 150,
      render: (parentId: number) => {
        if (parentId === 0) return '顶级分类'
        const parent = flatCategories.find(cat => cat.id === parentId)
        return parent?.categoryName || '-'
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '题目数量',
      dataIndex: 'questionCount',
      key: 'questionCount',
      width: 100,
      render: (count: number) => <Tag>{count}</Tag>,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: renderStatus,
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
      width: 150,
      render: (_, record: InterviewCategory) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditCategory(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个分类吗？"
            description="删除分类将同时删除其所有子分类和相关题目"
            onConfirm={() => handleDeleteCategory(record.id)}
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
  }

  // 处理新增
  const handleAddCategory = (parentId?: number) => {
    setEditingCategory(null)
    form.resetFields()
    if (parentId) {
      form.setFieldValue('parentId', parentId)
    }
    setIsModalVisible(true)
  }

  // 处理编辑
  const handleEditCategory = (category: InterviewCategory) => {
    setEditingCategory(category)
    form.setFieldsValue({
      parentId: category.parentId === 0 ? undefined : category.parentId,
      categoryName: category.categoryName,
      description: category.description,
      icon: category.icon,
      sortOrder: category.sortOrder,
    })
    setIsModalVisible(true)
  }

  // 处理表单提交
  const handleSubmit = async (values: CategoryFormData) => {
    try {
      const data = {
        ...values,
        parentId: values.parentId || 0, // 如果没有选择父级，则为顶级分类
      }
      
      if (editingCategory) {
        await interviewCategoryApi.updateCategory(editingCategory.id, data)
        message.success('更新成功')
      } else {
        await interviewCategoryApi.createCategory(data)
        message.success('创建成功')
      }
      
      setIsModalVisible(false)
      loadCategories()
    } catch (error) {
      message.error(editingCategory ? '更新失败' : '创建失败')
      console.error('Error submitting category:', error)
    }
  }

  // 处理删除
  const handleDeleteCategory = async (id: number) => {
    try {
      await interviewCategoryApi.deleteCategory(id)
      message.success('删除成功')
      loadCategories()
    } catch (error) {
      message.error('删除失败')
      console.error('Error deleting category:', error)
    }
  }

  // 处理状态切换
  const handleStatusChange = async (id: number, status: number) => {
    try {
      await interviewCategoryApi.updateCategoryStatus(id, status)
      message.success('状态更新成功')
      loadCategories()
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

  // 转换分类数据为Tree格式用于显示
  const getCategoryTreeDisplayData = (categories: InterviewCategory[]): TreeDataNode[] => {
    return categories.map(category => ({
      title: (
        <Space>
          <span>{category.categoryName}</span>
          <Tag>{category.questionCount}</Tag>
          {renderStatus(category.status)}
          <Space size="small">
            <Button
              type="text"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => handleAddCategory(category.id)}
              title="添加子分类"
            />
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditCategory(category)}
              title="编辑"
            />
            <Popconfirm
              title="确定要删除这个分类吗？"
              onConfirm={() => handleDeleteCategory(category.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                title="删除"
              />
            </Popconfirm>
          </Space>
        </Space>
      ),
      key: category.id,
      children: category.children ? getCategoryTreeDisplayData(category.children) : undefined,
    }))
  }

  return (
    <div>
      <Card title="分类管理" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddCategory()}>
          新增分类
        </Button>
      }>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索分类名称"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>
        
        {/* 整理分类树按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Modal
            title="分类树"
            open={isTreeModalVisible}
            onCancel={() => setIsTreeModalVisible(false)}
            footer={null}
            width={800}
          >
            <Tree
              showLine
              defaultExpandAll
              expandedKeys={expandedKeys}
              onExpand={setExpandedKeys}
              treeData={getCategoryTreeDisplayData(categories)}
              height={400}
            />
          </Modal>
          
          <Button 
            icon={<FolderOutlined />} 
            onClick={() => setIsTreeModalVisible(true)}
          >
            整理分类树
          </Button>
        </div>
        
        {/* 分类列表 */}
        <Table
          columns={columns}
          dataSource={flatCategories}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingCategory ? '编辑分类' : '新增分类'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="parentId"
            label="父级分类"
          >
            <TreeSelect
              placeholder="请选择父级分类（不选择则为顶级分类）"
              treeData={getCategoryTreeData(categories)}
              allowClear
              treeDefaultExpandAll
            />
          </Form.Item>
          
          <Form.Item
            name="categoryName"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="分类描述"
          >
            <TextArea
              rows={3}
              placeholder="请输入分类描述"
            />
          </Form.Item>
          
          <Form.Item
            name="icon"
            label="分类图标"
          >
            <Input placeholder="请输入图标类名或图标URL" />
          </Form.Item>
          
          <Form.Item
            name="sortOrder"
            label="排序"
            initialValue={0}
          >
            <Input type="number" placeholder="请输入排序值（数字越小越靠前）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
