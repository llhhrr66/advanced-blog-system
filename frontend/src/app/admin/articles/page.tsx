'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Tag, 
  Typography, 
  Card,
  Popconfirm,
  message,
  DatePicker,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { categoryAPI, tagAPI, articleAPI } from '@/lib/api';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  categoryId: number;
  categoryName: string;
  tags: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  viewCount: number;
  likeCount: number;
  createTime: string;
  updateTime: string;
  author: string;
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 筛选条件
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<any[]>([]);

  // 分页
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const result = await categoryAPI.getList();
      if (result.code === 200) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('获取分类列表失败:', error);
    }
  };

  // 获取标签列表
  const fetchTags = async () => {
    try {
      const result = await tagAPI.getList();
      if (result.code === 200) {
        setTags(result.data);
      }
    } catch (error) {
      console.error('获取标签列表失败:', error);
    }
  };

  // 获取文章列表（真实后端API）
  const fetchArticles = async () => {
    setLoading(true);
    try {
      // 调用真实的文章API
      const result = await articleAPI.getList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchText,
        categoryId: selectedCategory,
        status: selectedStatus,
        // startDate: dateRange[0]?.format('YYYY-MM-DD'),
        // endDate: dateRange[1]?.format('YYYY-MM-DD'),
      });
      
      if (result.code === 200) {
        // 后端返回的数据结构：{code, message, data: {total, pages, list}}
        const { total, list } = result.data;
        
        // 转换后端数据格式到前端需要的格式
        const formattedArticles: Article[] = list.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary || '',
          content: item.content || '',
          status: item.status === 0 ? 'draft' : item.status === 1 ? 'published' : 'archived',
          categoryId: item.category?.id || 0,
          categoryName: item.category?.name || '无分类',
          tags: item.tags || [],
          viewCount: item.viewCount || 0,
          likeCount: item.likeCount || 0,
          createTime: item.createTime,
          updateTime: item.updateTime,
          author: item.author || '管理员'
        }));
        
        setArticles(formattedArticles);
        setPagination(prev => ({
          ...prev,
          total: total || list.length
        }));
      } else {
        message.error(result.message || '获取文章列表失败');
        setArticles([]);
      }
    } catch (error) {
      console.error('获取文章列表失败:', error);
      message.error('网络错误，请稍后重试');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // 删除文章
  const handleDelete = async (id: number) => {
    try {
      const result = await articleAPI.delete(id);
      if (result.code === 200) {
        message.success('文章删除成功');
        fetchArticles();
      } else {
        message.error(result.message || '删除失败');
      }
    } catch (error) {
      console.error('删除文章失败:', error);
      message.error('网络错误，请稍后重试');
    }
  };

  // 状态标签颜色映射
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'green';
      case 'draft': return 'orange';
      case 'archived': return 'red';
      default: return 'default';
    }
  };

  // 状态文本映射
  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return '已发布';
      case 'draft': return '草稿';
      case 'archived': return '已归档';
      default: return '未知';
    }
  };

  // 表格列配置
  const columns: ColumnsType<Article> = [
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
      render: (text, record) => (
        <Button 
          type="link" 
          onClick={() => router.push(`/admin/articles/${record.id}`)}
          style={{ padding: 0, textAlign: 'left' }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
      render: (text) => text || '无分类',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: Tag[]) => (
        <Space wrap>
          {tags?.map(tag => (
            <Tag key={tag.id} color={tag.color} style={{ margin: '2px' }}>
              {tag.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      sorter: (a, b) => a.viewCount - b.viewCount,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
      render: (time) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
          >
            预览
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => router.push(`/admin/articles/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这篇文章吗？"
            description="删除后不可恢复，请谨慎操作。"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 重置筛选条件
  const handleReset = () => {
    setSearchText('');
    setSelectedCategory(undefined);
    setSelectedStatus(undefined);
    setDateRange([]);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 处理表格变化
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(pagination);
    fetchArticles();
  };

  // 新建文章
  const handleCreate = () => {
    router.push('/admin/articles/create');
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchArticles();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [searchText, selectedCategory, selectedStatus, dateRange, pagination.current, pagination.pageSize]);

  return (
    <div>
      {/* 页面标题 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>文章管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleCreate}
        >
          新建文章
        </Button>
      </div>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="搜索文章标题"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={fetchArticles}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择分类"
              value={selectedCategory}
              onChange={setSelectedCategory}
              allowClear
              style={{ width: '100%' }}
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择状态"
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="published">已发布</Option>
              <Option value="draft">草稿</Option>
              <Option value="archived">已归档</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              <Button onClick={fetchArticles} icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 文章列表 */}
      <Card>
        {articles.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
            <FileTextOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <div style={{ fontSize: 16, marginBottom: 8 }}>暂无文章</div>
            <div style={{ fontSize: 14 }}>
              <Button type="link" onClick={handleCreate}>
                立即创建第一篇文章
              </Button>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={articles}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
        )}
      </Card>
    </div>
  );
}
