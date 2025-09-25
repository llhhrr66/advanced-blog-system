'use client';

import React, { useState, useRef } from 'react';
import {
  Card,
  Steps,
  Button,
  Upload,
  Typography,
  Space,
  Alert,
  Progress,
  Table,
  Tag,
  Checkbox,
  Select,
  InputNumber,
  Radio,
  Divider,
  message,
  Modal,
  Descriptions,
  Statistic,
  Row,
  Col
} from 'antd';
import {
  UploadOutlined,
  FileTextOutlined,
  SettingOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FolderOpenOutlined,
  TagsOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { UploadProps, StepsProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { motion } from 'framer-motion';
import { 
  processMarkdownFiles, 
  validateMarkdownFile, 
  generateImportSummary 
} from '@/utils/markdown';
import { importAPI, categoryAPI, tagAPI } from '@/lib/api';
import type { 
  ImportFileInfo, 
  ImportConfig, 
  ImportProgress, 
  Category, 
  Tag as TagType 
} from '@/types/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function ImportPage() {
  // 步骤控制
  const [currentStep, setCurrentStep] = useState(0);
  
  // 文件相关状态
  const [files, setFiles] = useState<ImportFileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 导入配置
  const [importConfig, setImportConfig] = useState<ImportConfig>({
    mode: 'skip',
    createCategories: true,
    createTags: true,
    defaultStatus: 0,
    categoryMapping: {},
    tagMapping: {},
    preserveTime: true,
    batchSize: 10
  });
  
  // 进度信息
  const [importProgress, setImportProgress] = useState<ImportProgress>({
    total: 0,
    processed: 0,
    success: 0,
    failed: 0,
    skipped: 0,
    status: 'idle',
    errors: []
  });
  
  // 现有分类和标签
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  
  // 预览Modal
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<ImportFileInfo | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 获取现有分类和标签
  const fetchCategoriesAndTags = async () => {
    try {
      const [categoriesResult, tagsResult] = await Promise.all([
        categoryAPI.getList(),
        tagAPI.getList()
      ]);
      
      if (categoriesResult.code === 200) {
        setCategories(categoriesResult.data);
      }
      if (tagsResult.code === 200) {
        setTags(tagsResult.data);
      }
    } catch (error) {
      console.error('获取分类和标签失败:', error);
      message.error('获取分类和标签失败');
    }
  };

  // 处理文件选择
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setLoading(true);
    try {
      const markdownFiles: Array<{
        name: string;
        path: string;
        content: string;
        size: number;
      }> = [];

      // 读取所有选中的文件
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (file.name.toLowerCase().endsWith('.md')) {
          const content = await file.text();
          markdownFiles.push({
            name: file.name,
            path: file.webkitRelativePath || file.name,
            content,
            size: file.size
          });
        }
      }

      if (markdownFiles.length === 0) {
        message.warning('未找到Markdown文件');
        return;
      }

      // 处理markdown文件
      const processedFiles = processMarkdownFiles(markdownFiles);
      setFiles(processedFiles);
      
      message.success(`成功扫描到 ${processedFiles.length} 个Markdown文件`);
      setCurrentStep(1); // 跳转到文件预览步骤

    } catch (error) {
      console.error('文件处理失败:', error);
      message.error('文件处理失败');
    } finally {
      setLoading(false);
    }
  };

  // 文件上传配置
  const uploadProps: UploadProps = {
    beforeUpload: () => false, // 阻止自动上传
    multiple: true,
    accept: '.md',
    showUploadList: false,
    onChange: (info) => {
      if (info.fileList.length > 0) {
        // 处理拖拽上传
        handleFilesFromUpload(info.fileList);
      }
    }
  };

  // 处理上传的文件
  const handleFilesFromUpload = async (fileList: any[]) => {
    setLoading(true);
    try {
      const markdownFiles: Array<{
        name: string;
        path: string;
        content: string;
        size: number;
      }> = [];

      for (const fileItem of fileList) {
        const file = fileItem.originFileObj;
        if (file && file.name.toLowerCase().endsWith('.md')) {
          const content = await file.text();
          markdownFiles.push({
            name: file.name,
            path: file.name,
            content,
            size: file.size
          });
        }
      }

      if (markdownFiles.length === 0) {
        message.warning('未找到Markdown文件');
        return;
      }

      const processedFiles = processMarkdownFiles(markdownFiles);
      setFiles(processedFiles);
      
      message.success(`成功上传 ${processedFiles.length} 个Markdown文件`);
      setCurrentStep(1);

    } catch (error) {
      console.error('文件上传处理失败:', error);
      message.error('文件上传处理失败');
    } finally {
      setLoading(false);
    }
  };

  // 表格列定义
  const fileColumns: ColumnsType<ImportFileInfo> = [
    {
      title: '选择',
      key: 'select',
      width: 60,
      render: (_, record, index) => (
        <Checkbox
          checked={record.selected}
          onChange={(e) => {
            const newFiles = [...files];
            newFiles[index].selected = e.target.checked;
            setFiles(newFiles);
          }}
        />
      ),
    },
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text) => text || <Text type="secondary">未设置</Text>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <Space wrap>
          {tags.slice(0, 3).map(tag => (
            <Tag key={tag} color="orange" size="small">{tag}</Tag>
          ))}
          {tags.length > 3 && <Text type="secondary">+{tags.length - 3}</Text>}
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const validation = validateMarkdownFile(record);
        return validation.valid ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>有效</Tag>
        ) : (
          <Tag color="red" icon={<ExclamationCircleOutlined />}>
            {validation.errors[0]}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          size="small"
          onClick={() => {
            setPreviewFile(record);
            setPreviewVisible(true);
          }}
        >
          预览
        </Button>
      ),
    },
  ];

  // 执行导入
  const handleImport = async () => {
    const selectedFiles = files.filter(f => f.selected);
    if (selectedFiles.length === 0) {
      message.warning('请至少选择一个文件进行导入');
      return;
    }

    setCurrentStep(3); // 跳转到导入进度步骤
    setImportProgress({
      total: selectedFiles.length,
      processed: 0,
      success: 0,
      failed: 0,
      skipped: 0,
      status: 'importing',
      errors: []
    });

    try {
      // 调用实际的批量导入API
      const response = await importAPI.batchImport({
        files: selectedFiles,
        config: importConfig
      });
      
      // 获取任务ID，轮询进度
      const taskId = response.data?.taskId;
      
      if (taskId) {
        // 轮询进度
        const pollInterval = setInterval(async () => {
          try {
            const progressResult = await importAPI.getImportProgress(taskId);
            const progress = progressResult.data;
            
            setImportProgress(progress);
            
            // 如果导入完成或取消，停止轮询
            if (progress.status === 'completed' || progress.status === 'cancelled') {
              clearInterval(pollInterval);
              
              if (progress.status === 'completed') {
                message.success(`导入完成！成功: ${progress.success}, 失败: ${progress.failed}, 跳过: ${progress.skipped}`);
              } else {
                message.info('导入已取消');
              }
            }
          } catch (error) {
            console.error('获取进度失败:', error);
          }
        }, 1000); // 每秒轮询一次
      } else {
        // 同步导入（如果后端不返回taskId）
        setImportProgress(response.data?.progress || {
          ...importProgress,
          status: 'completed'
        });
        message.success('导入完成！');
      }

    } catch (error) {
      console.error('导入失败:', error);
      message.error('导入过程中发生错误');
      setImportProgress(prev => ({
        ...prev,
        status: 'idle'
      }));
    }
  };

  // 步骤配置
  const steps: StepsProps['items'] = [
    {
      title: '选择文件',
      icon: <UploadOutlined />,
      description: '上传或选择Markdown文件',
    },
    {
      title: '文件预览',
      icon: <FileTextOutlined />,
      description: '预览和编辑文件信息',
    },
    {
      title: '导入配置',
      icon: <SettingOutlined />,
      description: '设置导入参数',
    },
    {
      title: '执行导入',
      icon: <RocketOutlined />,
      description: '批量导入文章',
    },
  ];

  // 获取导入摘要
  const importSummary = generateImportSummary(files);

  return (
    <div style={{ padding: '0 0 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <FolderOpenOutlined style={{ marginRight: 8 }} />
          批量导入
        </Title>
        <Paragraph type="secondary">
          支持批量导入Markdown文件到博客系统，自动解析文章信息并创建相应的分类和标签。
        </Paragraph>
      </div>

      <Card>
        <Steps 
          current={currentStep} 
          items={steps} 
          style={{ marginBottom: 32 }}
        />

        {/* 步骤1: 文件选择 */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <UploadOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                
                <div>
                  <Title level={3}>选择Markdown文件</Title>
                  <Paragraph type="secondary">
                    您可以选择单个文件或整个文件夹进行批量导入
                  </Paragraph>
                </div>

                <Space size="large">
                  <Upload {...uploadProps}>
                    <Button 
                      type="primary" 
                      icon={<UploadOutlined />} 
                      size="large"
                      loading={loading}
                    >
                      上传文件
                    </Button>
                  </Upload>

                  <Button 
                    icon={<FolderOpenOutlined />} 
                    size="large"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                    loading={loading}
                  >
                    选择文件夹
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".md"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    // @ts-ignore
                    webkitdirectory=""
                    directory=""
                  />
                </Space>

                <Alert
                  message="支持的文件格式"
                  description="仅支持 .md 格式的Markdown文件。系统会自动解析文件中的frontmatter信息。"
                  type="info"
                  showIcon
                  style={{ maxWidth: 600, margin: '0 auto' }}
                />
              </Space>
            </div>
          </motion.div>
        )}

        {/* 步骤2: 文件预览 */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* 摘要信息 */}
              <Row gutter={16}>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="总文件数"
                      value={importSummary.totalFiles}
                      prefix={<FileTextOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="已选择"
                      value={importSummary.selectedFiles}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="分类数"
                      value={importSummary.categories.length}
                      prefix={<FolderOpenOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="标签数"
                      value={importSummary.tags.length}
                      prefix={<TagsOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              {/* 批量操作 */}
              <Card size="small">
                <Space>
                  <Button
                    size="small"
                    onClick={() => {
                      setFiles(files.map(f => ({ ...f, selected: true })));
                    }}
                  >
                    全选
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setFiles(files.map(f => ({ ...f, selected: false })));
                    }}
                  >
                    全不选
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setFiles(files.map(f => ({ 
                        ...f, 
                        selected: validateMarkdownFile(f).valid 
                      })));
                    }}
                  >
                    只选择有效文件
                  </Button>
                </Space>
              </Card>

              {/* 文件列表 */}
              <Table
                columns={fileColumns}
                dataSource={files}
                rowKey="id"
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ x: 1000 }}
              />

              {/* 操作按钮 */}
              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button 
                    onClick={() => setCurrentStep(0)}
                  >
                    上一步
                  </Button>
                  <Button 
                    type="primary"
                    onClick={() => {
                      fetchCategoriesAndTags();
                      setCurrentStep(2);
                    }}
                    disabled={files.filter(f => f.selected).length === 0}
                  >
                    下一步
                  </Button>
                </Space>
              </div>
            </Space>
          </motion.div>
        )}

        {/* 步骤3: 导入配置 */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Card title="基础设置" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>重复文章处理方式：</Text>
                      <Radio.Group
                        value={importConfig.mode}
                        onChange={(e) => setImportConfig({
                          ...importConfig,
                          mode: e.target.value
                        })}
                        style={{ marginTop: 8 }}
                      >
                        <Radio value="skip">跳过</Radio>
                        <Radio value="overwrite">覆盖</Radio>
                        <Radio value="update">更新</Radio>
                      </Radio.Group>
                    </div>

                    <div>
                      <Text strong>默认文章状态：</Text>
                      <Select
                        value={importConfig.defaultStatus}
                        onChange={(value) => setImportConfig({
                          ...importConfig,
                          defaultStatus: value
                        })}
                        style={{ width: '100%', marginTop: 8 }}
                      >
                        <Option value={0}>草稿</Option>
                        <Option value={1}>发布</Option>
                      </Select>
                    </div>

                    <div>
                      <Text strong>批量处理大小：</Text>
                      <InputNumber
                        min={1}
                        max={50}
                        value={importConfig.batchSize}
                        onChange={(value) => setImportConfig({
                          ...importConfig,
                          batchSize: value || 10
                        })}
                        style={{ width: '100%', marginTop: 8 }}
                      />
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="高级选项" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Checkbox
                      checked={importConfig.createCategories}
                      onChange={(e) => setImportConfig({
                        ...importConfig,
                        createCategories: e.target.checked
                      })}
                    >
                      自动创建分类
                    </Checkbox>

                    <Checkbox
                      checked={importConfig.createTags}
                      onChange={(e) => setImportConfig({
                        ...importConfig,
                        createTags: e.target.checked
                      })}
                    >
                      自动创建标签
                    </Checkbox>

                    <Checkbox
                      checked={importConfig.preserveTime}
                      onChange={(e) => setImportConfig({
                        ...importConfig,
                        preserveTime: e.target.checked
                      })}
                    >
                      保留原始时间
                    </Checkbox>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Divider />

            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setCurrentStep(1)}>
                  上一步
                </Button>
                <Button type="primary" onClick={handleImport}>
                  开始导入
                </Button>
              </Space>
            </div>
          </motion.div>
        )}

        {/* 步骤4: 导入进度 */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <ClockCircleOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                <Title level={3} style={{ marginTop: 16 }}>
                  {importProgress.status === 'importing' ? '正在导入...' : 
                   importProgress.status === 'completed' ? '导入完成！' : '准备导入'}
                </Title>
                {importProgress.currentFile && (
                  <Text type="secondary">当前处理: {importProgress.currentFile}</Text>
                )}
              </div>

              <Progress 
                percent={Math.round((importProgress.processed / importProgress.total) * 100)}
                status={importProgress.status === 'completed' ? 'success' : 'active'}
                strokeColor={importProgress.status === 'completed' ? '#52c41a' : '#1890ff'}
              />

              <Row gutter={16}>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="总计"
                      value={importProgress.total}
                      prefix={<FileTextOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="成功"
                      value={importProgress.success}
                      valueStyle={{ color: '#52c41a' }}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="失败"
                      value={importProgress.failed}
                      valueStyle={{ color: '#ff4d4f' }}
                      prefix={<ExclamationCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="跳过"
                      value={importProgress.skipped}
                      valueStyle={{ color: '#faad14' }}
                      prefix={<InfoCircleOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              {importProgress.errors.length > 0 && (
                <Alert
                  message="导入错误"
                  description={
                    <div>
                      {importProgress.errors.map((error, index) => (
                        <div key={index}>
                          <Text strong>{error.file}:</Text> {error.error}
                        </div>
                      ))}
                    </div>
                  }
                  type="error"
                  showIcon
                />
              )}

              {importProgress.status === 'completed' && (
                <div style={{ textAlign: 'center' }}>
                  <Space>
                    <Button 
                      type="primary"
                      onClick={() => {
                        setCurrentStep(0);
                        setFiles([]);
                        setImportProgress({
                          total: 0,
                          processed: 0,
                          success: 0,
                          failed: 0,
                          skipped: 0,
                          status: 'idle',
                          errors: []
                        });
                      }}
                    >
                      重新导入
                    </Button>
                    <Button onClick={() => window.location.href = '/admin/articles'}>
                      查看文章
                    </Button>
                  </Space>
                </div>
              )}
            </Space>
          </motion.div>
        )}
      </Card>

      {/* 文件预览Modal */}
      <Modal
        title={
          <Space>
            <EyeOutlined />
            文件预览
          </Space>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {previewFile && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="文件名" span={2}>
                {previewFile.name}
              </Descriptions.Item>
              <Descriptions.Item label="标题">
                {previewFile.title}
              </Descriptions.Item>
              <Descriptions.Item label="分类">
                <Tag color="blue">{previewFile.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="标签" span={2}>
                <Space wrap>
                  {previewFile.tags.map(tag => (
                    <Tag key={tag} color="orange">{tag}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              {previewFile.createTime && (
                <Descriptions.Item label="创建时间">
                  {previewFile.createTime}
                </Descriptions.Item>
              )}
              {previewFile.originalUrl && (
                <Descriptions.Item label="原文链接">
                  <a href={previewFile.originalUrl} target="_blank" rel="noopener noreferrer">
                    {previewFile.originalUrl}
                  </a>
                </Descriptions.Item>
              )}
            </Descriptions>
            
            <div>
              <Text strong>内容预览：</Text>
              <div style={{ 
                maxHeight: 300, 
                overflow: 'auto', 
                padding: 12, 
                background: '#f5f5f5', 
                borderRadius: 6,
                marginTop: 8
              }}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: 12 }}>
                  {previewFile.content.substring(0, 1000)}
                  {previewFile.content.length > 1000 && '...'}
                </pre>
              </div>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
}
