'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Typography, 
  Space,
  List,
  Tag,
  Avatar,
  Progress,
  Alert,
  Divider,
  message,
  Modal,
  Descriptions
} from 'antd';
import {
  FileTextOutlined,
  FolderOutlined,
  TagsOutlined,
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  FireOutlined,
  UserOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  CommentOutlined,
  ReloadOutlined,
  ImportOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { categoryAPI, tagAPI, articleAPI } from '@/lib/api';
import type { ArticleStats } from '@/types/api';

const { Title, Text } = Typography;

interface DashboardStats {
  // 文章相关统计
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  // 其他统计
  categories: number;
  tags: number;
}

interface RecentActivity {
  id: string;
  type: 'article' | 'category' | 'tag';
  title: string;
  action: string;
  time: string;
}

interface SystemStatus {
  backend: 'online' | 'offline';
  database: 'online' | 'offline';
  cache: 'online' | 'offline';
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    categories: 0,
    tags: 0
  });
  
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    backend: 'online',
    database: 'online', 
    cache: 'online'
  });
  
  const [loading, setLoading] = useState(true);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [detailedStats, setDetailedStats] = useState<ArticleStats | null>(null);

  // 获取统计数据
  const fetchStats = async () => {
    try {
      // 并发获取分类、标签和文章统计
      const [categoriesResult, tagsResult, articleStatsResult] = await Promise.all([
        categoryAPI.getList(false),
        tagAPI.getList(),
        articleAPI.getStats() // 使用新的文章统计API
      ]);
      
      console.log('文章统计结果:', articleStatsResult);
      
      // 从文章统计API获取详细数据
      const articleStats: ArticleStats = articleStatsResult.code === 200 && articleStatsResult.data
        ? articleStatsResult.data
        : {
            total: 0,
            published: 0,
            draft: 0,
            totalViews: 0,
            totalLikes: 0,
            totalComments: 0
          };
      
      setStats({
        totalArticles: articleStats.total,
        publishedArticles: articleStats.published,
        draftArticles: articleStats.draft,
        totalViews: articleStats.totalViews,
        totalLikes: articleStats.totalLikes,
        totalComments: articleStats.totalComments,
        categories: categoriesResult.code === 200 ? categoriesResult.data.length : 0,
        tags: tagsResult.code === 200 ? tagsResult.data.length : 0
      });
      
      // 检测系统状态
      const allApisSuccess = categoriesResult.code === 200 && tagsResult.code === 200 && articleStatsResult.code === 200;
      setSystemStatus({
        backend: allApisSuccess ? 'online' : 'offline',
        database: allApisSuccess ? 'online' : 'offline',
        cache: 'online' // 暂时假设缓存正常
      });
    } catch (error) {
      console.error('获取统计数据失败:', error);
      
      // 设置系统状态为离线
      setSystemStatus({
        backend: 'offline',
        database: 'offline',
        cache: 'offline'
      });
    }
  };

  // 获取最近活动数据（暂时为空，等待后端API）
  const fetchRecentActivities = async () => {
    try {
      // TODO: 待后端实现活动日志API后再获取真实数据
      // const activitiesResult = await activityAPI.getRecent();
      
      // 暂时设置为空数组
      setRecentActivities([]);
    } catch (error) {
      console.error('获取最近活动失败:', error);
      setRecentActivities([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStats(),
          fetchRecentActivities()
        ]);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case 'category': return <FolderOutlined style={{ color: '#52c41a' }} />;
      case 'tag': return <TagsOutlined style={{ color: '#fa8c16' }} />;
      default: return <EditOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'online' ? '#52c41a' : '#ff4d4f';
  };

  // 直接路由跳转方法
  const navigateTo = (path: string) => {
    router.push(path);
  };
  
  // 手动测试统计功能
  const testStatsFunction = async () => {
    try {
      message.loading('正在获取文章统计数据...', 0);
      const result = await articleAPI.getStats();
      message.destroy();
      
      if (result.code === 200) {
        setDetailedStats(result.data);
        setStatsModalVisible(true);
        message.success('获取文章统计数据成功！');
      } else {
        message.error(`获取失败：${result.message || '未知错误'}`);
      }
    } catch (error: any) {
      message.destroy();
      console.error('文章统计API调用失败:', error);
      message.error(`网络错误：${error.message || '请检查网络连接'}`);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ padding: '0 0 24px' }}>
      {/* 欢迎区域 */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.6 }}
      >
        <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
          <Row align="middle">
            <Col flex={1}>
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                <RocketOutlined style={{ marginRight: 8 }} />
                欢迎回到管理后台
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
                今天是个管理博客内容的好日子！
              </Text>
            </Col>
            <Col>
              <Space>
                <Button 
                  type="primary" 
                  ghost 
                  icon={<PlusOutlined />} 
                  size="large"
                  onClick={() => navigateTo('/admin/categories')}
                >
                  新建分类
                </Button>
                <Button 
                  type="primary" 
                  ghost 
                  icon={<TagsOutlined />} 
                  size="large"
                  onClick={() => navigateTo('/admin/tags')}
                >
                  管理标签
                </Button>
                <Button 
                  type="primary" 
                  ghost 
                  icon={<ImportOutlined />} 
                  size="large"
                  onClick={() => navigateTo('/admin/import')}
                >
                  批量导入
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Card>
              <Statistic
                title="总文章数"
                value={stats.totalArticles}
                prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                suffix={<Text type="secondary" style={{ fontSize: '12px' }}>(已发布{stats.publishedArticles})</Text>}
                loading={loading}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card>
              <Statistic
                title="草稿数量"
                value={stats.draftArticles}
                prefix={<EditOutlined style={{ color: '#faad14' }} />}
                loading={loading}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card>
              <Statistic
                title="总浏览量"
                value={stats.totalViews}
                prefix={<EyeOutlined style={{ color: '#eb2f96' }} />}
                loading={loading}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card>
              <Statistic
                title="总点赞数"
                value={stats.totalLikes}
                prefix={<HeartOutlined style={{ color: '#f5222d' }} />}
                loading={loading}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
      
      {/* 第二行统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card>
              <Statistic
                title="总评论数"
                value={stats.totalComments}
                prefix={<CommentOutlined style={{ color: '#722ed1' }} />}
                loading={loading}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card>
              <Statistic
                title="分类数量"
                value={stats.categories}
                prefix={<FolderOutlined style={{ color: '#52c41a' }} />}
                loading={loading}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Card>
              <Statistic
                title="标签数量"
                value={stats.tags}
                prefix={<TagsOutlined style={{ color: '#fa8c16' }} />}
                loading={loading}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Card 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={testStatsFunction}
            >
              <Statistic
                title={
                  <Text style={{ color: 'white' }}>测试统计</Text>
                }
                value="API测试"
                valueStyle={{ color: 'white', fontSize: '16px' }}
                prefix={<RocketOutlined style={{ color: 'white' }} />}
                loading={loading}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]}>
        {/* 快捷操作 */}
        <Col xs={24} lg={12}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Card title={
              <Space>
                <SettingOutlined />
                快捷操作
              </Space>
            }>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Button 
                    type="dashed" 
                    icon={<FolderOutlined />} 
                    block
                    onClick={() => navigateTo('/admin/categories')}
                    style={{ height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    分类管理
                  </Button>
                </Col>
                <Col span={12}>
                  <Button 
                    type="dashed" 
                    icon={<TagsOutlined />} 
                    block
                    onClick={() => navigateTo('/admin/tags')}
                    style={{ height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    标签管理
                  </Button>
                </Col>
                <Col span={12}>
                  <Button 
                    type="dashed" 
                    icon={<PlusOutlined />} 
                    block
                    style={{ height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    新建文章
                  </Button>
                </Col>
                <Col span={12}>
                  <Button 
                    type="dashed" 
                    icon={<ImportOutlined />} 
                    block
                    onClick={() => navigateTo('/admin/import')}
                    style={{ height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    批量导入
                  </Button>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </Col>

        {/* 系统状态 */}
        <Col xs={24} lg={12}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <Card title={
              <Space>
                <CheckCircleOutlined />
                系统状态
              </Space>
            }>
              <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Progress 
                      type="circle" 
                      percent={100} 
                      size={60}
                      strokeColor={getStatusColor(systemStatus.backend)}
                      format={() => systemStatus.backend === 'online' ? '正常' : '异常'}
                    />
                    <div style={{ marginTop: 8, fontSize: 12 }}>后端服务</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Progress 
                      type="circle" 
                      percent={100} 
                      size={60}
                      strokeColor={getStatusColor(systemStatus.database)}
                      format={() => systemStatus.database === 'online' ? '正常' : '异常'}
                    />
                    <div style={{ marginTop: 8, fontSize: 12 }}>数据库</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Progress 
                      type="circle" 
                      percent={100} 
                      size={60}
                      strokeColor={getStatusColor(systemStatus.cache)}
                      format={() => systemStatus.cache === 'online' ? '正常' : '异常'}
                    />
                    <div style={{ marginTop: 8, fontSize: 12 }}>缓存服务</div>
                  </div>
                </Col>
              </Row>
              
              <Alert
                message="系统运行正常"
                description="所有服务状态良好，可以正常使用所有功能。"
                type="success"
                showIcon
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 最近活动 */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{ marginTop: 16 }}
      >
        <Card title={
          <Space>
            <ClockCircleOutlined />
            最近活动
          </Space>
        }>
          {recentActivities.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={getActivityIcon(item.type)} />}
                    title={
                      <Space>
                        <Text strong>{item.action}</Text>
                        <Tag color={item.type === 'article' ? 'blue' : item.type === 'category' ? 'green' : 'orange'}>
                          {item.type === 'article' ? '文章' : item.type === 'category' ? '分类' : '标签'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        <Text>{item.title}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          {item.time}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              <ClockCircleOutlined style={{ fontSize: 32, marginBottom: 16 }} />
              <div>暂无最近活动</div>
              <div style={{ fontSize: 12, marginTop: 8 }}>开始管理您的内容，活动将显示在这里</div>
            </div>
          )}
        </Card>
      </motion.div>
      
      {/* 统计详情Modal */}
      <Modal
        title={
          <Space>
            <RocketOutlined style={{ color: '#1890ff' }} />
            文章统计详情
          </Space>
        }
        open={statsModalVisible}
        onCancel={() => setStatsModalVisible(false)}
        footer={[
          <Button key="refresh" type="primary" icon={<ReloadOutlined />} onClick={fetchStats}>
            刷新数据
          </Button>,
          <Button key="close" onClick={() => setStatsModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {detailedStats ? (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="总文章数" span={1}>
              <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                {detailedStats.total}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="已发布文章" span={1}>
              <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                {detailedStats.published}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="草稿文章" span={1}>
              <Text strong style={{ color: '#faad14', fontSize: '16px' }}>
                {detailedStats.draft}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="发布率" span={1}>
              <Text strong style={{ color: '#722ed1', fontSize: '16px' }}>
                {detailedStats.total > 0 
                  ? `${((detailedStats.published / detailedStats.total) * 100).toFixed(1)}%`
                  : '0%'
                }
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="总浏览量" span={1}>
              <Text strong style={{ color: '#eb2f96', fontSize: '16px' }}>
                {detailedStats.totalViews.toLocaleString()}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="总点赞数" span={1}>
              <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                {detailedStats.totalLikes.toLocaleString()}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="总评论数" span={1}>
              <Text strong style={{ color: '#722ed1', fontSize: '16px' }}>
                {detailedStats.totalComments.toLocaleString()}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="平均浏览量" span={1}>
              <Text strong style={{ color: '#13c2c2', fontSize: '16px' }}>
                {detailedStats.published > 0
                  ? Math.round(detailedStats.totalViews / detailedStats.published)
                  : 0
                }
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="互动数据" span={2}>
              <Space size="large">
                <Text>
                  <HeartOutlined style={{ color: '#f5222d', marginRight: 4 }} />
                  平均点赞: {detailedStats.published > 0
                    ? Math.round(detailedStats.totalLikes / detailedStats.published)
                    : 0
                  }
                </Text>
                <Text>
                  <CommentOutlined style={{ color: '#722ed1', marginRight: 4 }} />
                  平均评论: {detailedStats.published > 0
                    ? Math.round(detailedStats.totalComments / detailedStats.published)
                    : 0
                  }
                </Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Alert message="暂无统计数据" type="info" />
        )}
      </Modal>
    </div>
  );
}
