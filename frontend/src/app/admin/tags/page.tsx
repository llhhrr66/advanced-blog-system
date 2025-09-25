'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  message,
  Popconfirm,
  Typography,
  ColorPicker,
  Tag,
  Tabs,
  Card,
  Statistic
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FireOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Color } from 'antd/es/color-picker';

const { Title } = Typography;
const { TabPane } = Tabs;

interface TagItem {
  id: number;
  name: string;
  description: string;
  color: string;
  useCount: number;
  createTime: string;
  updateTime: string;
}

interface TagForm {
  name: string;
  description?: string;
  color?: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [hotTags, setHotTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hotLoading, setHotLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [form] = Form.useForm();

  // 获取标签列表
  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tags');
      const result = await response.json();
      if (result.code === 200) {
        setTags(result.data);
      } else {
        message.error(result.message || '获取标签列表失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取热门标签
  const fetchHotTags = async () => {
    setHotLoading(true);
    try {
      const response = await fetch('/api/tags/hot');
      const result = await response.json();
      if (result.code === 200) {
        setHotTags(result.data);
      } else {
        message.error(result.message || '获取热门标签失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    } finally {
      setHotLoading(false);
    }
  };

  // 创建标签
  const handleCreate = async (values: TagForm) => {
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      
      if (result.code === 200) {
        message.success('标签创建成功');
        setModalVisible(false);
        form.resetFields();
        fetchTags();
        fetchHotTags();
      } else {
        message.error(result.message || '创建失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  // 更新标签
  const handleUpdate = async (values: TagForm) => {
    if (!editingTag) return;
    
    try {
      const response = await fetch(`/api/tags/${editingTag.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, id: editingTag.id }),
      });
      const result = await response.json();
      
      if (result.code === 200) {
        message.success('标签更新成功');
        setModalVisible(false);
        setEditingTag(null);
        form.resetFields();
        fetchTags();
        fetchHotTags();
      } else {
        message.error(result.message || '更新失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  // 删除标签
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.code === 200) {
        message.success('标签删除成功');
        fetchTags();
        fetchHotTags();
      } else {
        message.error(result.message || '删除失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  // 表单提交
  const handleSubmit = async (values: TagForm) => {
    if (editingTag) {
      await handleUpdate(values);
    } else {
      await handleCreate(values);
    }
  };

  // 编辑标签
  const handleEdit = (tag: TagItem) => {
    setEditingTag(tag);
    form.setFieldsValue({
      name: tag.name,
      description: tag.description,
      color: tag.color,
    });
    setModalVisible(true);
  };

  // 新增标签
  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 取消操作
  const handleCancel = () => {
    setModalVisible(false);
    setEditingTag(null);
    form.resetFields();
  };

  // 表格列配置
  const columns: ColumnsType<TagItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Tag color={record.color}>{text}</Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      width: 120,
      render: (color) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div 
            style={{ 
              width: 20, 
              height: 20, 
              backgroundColor: color,
              border: '1px solid #d9d9d9',
              borderRadius: 4
            }} 
          />
          <span>{color}</span>
        </div>
      ),
    },
    {
      title: '使用次数',
      dataIndex: 'useCount',
      key: 'useCount',
      width: 100,
      sorter: (a, b) => a.useCount - b.useCount,
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
            title="确定删除这个标签吗？"
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
    fetchTags();
    fetchHotTags();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>标签管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增标签
        </Button>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="所有标签" key="1">
          <Table
            columns={columns}
            dataSource={tags}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </TabPane>
        <TabPane tab={
          <span>
            <FireOutlined />
            热门标签
          </span>
        } key="2">
          <div style={{ marginBottom: 16 }}>
            <Card>
              <Statistic
                title="热门标签总数"
                value={hotTags.length}
                suffix="个"
              />
            </Card>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {hotTags.map((tag) => (
              <Tag
                key={tag.id}
                color={tag.color}
                style={{ 
                  fontSize: 14, 
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
                onClick={() => handleEdit(tag)}
              >
                {tag.name} ({tag.useCount})
              </Tag>
            ))}
          </div>
          {hotLoading && <div>加载中...</div>}
        </TabPane>
      </Tabs>

      <Modal
        title={editingTag ? '编辑标签' : '新增标签'}
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
            label="标签名称"
            rules={[
              { required: true, message: '请输入标签名称' },
              { min: 1, max: 30, message: '标签名称长度必须在1-30字符之间' },
            ]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="标签描述"
            rules={[
              { max: 200, message: '描述长度不能超过200字符' },
            ]}
          >
            <Input.TextArea 
              placeholder="请输入标签描述" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="color"
            label="标签颜色"
            rules={[
              { pattern: /^#[0-9A-Fa-f]{3,6}$/, message: '请输入有效的颜色值' },
            ]}
          >
            <Input 
              placeholder="请输入颜色值，如: #1890ff" 
              addonBefore={
                <ColorPicker
                  value={form.getFieldValue('color')}
                  onChange={(color: Color) => {
                    form.setFieldsValue({ color: color.toHexString() });
                  }}
                  showText={() => ''}
                  size="small"
                />
              }
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingTag ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
