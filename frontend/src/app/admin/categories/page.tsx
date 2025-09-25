'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  InputNumber,
  message,
  Popconfirm,
  Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  articleCount: number;
  createTime: string;
  updateTime: string;
}

interface CategoryForm {
  name: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  // 获取分类列表
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories?includeArticleCount=true');
      const result = await response.json();
      if (result.code === 200) {
        setCategories(result.data);
      } else {
        message.error(result.message || '获取分类列表失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 创建分类
  const handleCreate = async (values: CategoryForm) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      
      if (result.code === 200) {
        message.success('分类创建成功');
        setModalVisible(false);
        form.resetFields();
        fetchCategories();
      } else {
        message.error(result.message || '创建失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  // 更新分类
  const handleUpdate = async (values: CategoryForm) => {
    if (!editingCategory) return;
    
    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, id: editingCategory.id }),
      });
      const result = await response.json();
      
      if (result.code === 200) {
        message.success('分类更新成功');
        setModalVisible(false);
        setEditingCategory(null);
        form.resetFields();
        fetchCategories();
      } else {
        message.error(result.message || '更新失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  // 删除分类
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.code === 200) {
        message.success('分类删除成功');
        fetchCategories();
      } else {
        message.error(result.message || '删除失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  // 表单提交
  const handleSubmit = async (values: CategoryForm) => {
    if (editingCategory) {
      await handleUpdate(values);
    } else {
      await handleCreate(values);
    }
  };

  // 编辑分类
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      icon: category.icon,
      sortOrder: category.sortOrder,
    });
    setModalVisible(true);
  };

  // 新增分类
  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 取消操作
  const handleCancel = () => {
    setModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  // 表格列配置
  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 120,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      sorter: (a, b) => a.sortOrder - b.sortOrder,
    },
    {
      title: '文章数量',
      dataIndex: 'articleCount',
      key: 'articleCount',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个分类吗？"
            description="删除后不可恢复，请谨慎操作。"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>分类管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增分类
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title={editingCategory ? '编辑分类' : '新增分类'}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[
              { required: true, message: '请输入分类名称' },
              { min: 1, max: 50, message: '分类名称长度必须在1-50字符之间' },
            ]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="分类描述"
            rules={[
              { max: 200, message: '描述长度不能超过200字符' },
            ]}
          >
            <Input.TextArea 
              placeholder="请输入分类描述" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="icon"
            label="图标名称"
            rules={[
              { max: 100, message: '图标名称长度不能超过100字符' },
            ]}
          >
            <Input placeholder="请输入Ant Design图标名称，如: CodeOutlined" />
          </Form.Item>

          <Form.Item
            name="sortOrder"
            label="排序值"
            tooltip="数值越小排序越前"
          >
            <InputNumber 
              placeholder="请输入排序值" 
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingCategory ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
