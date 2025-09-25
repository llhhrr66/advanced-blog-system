'use client'

import { useState, useEffect, useMemo } from 'react'
import { Layout, Card, Input, Select, Tag, Button, Space, Pagination, Empty, Spin, Badge, Divider } from 'antd'
import { 
  SearchOutlined, 
  FilterOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  LikeOutlined,
  StarOutlined,
  TagsOutlined
} from '@ant-design/icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import useInterviewStore from '@/stores/interviewStore'
import CategoryTree from '@/components/interview/CategoryTree'
import QuestionFilter from '@/components/interview/QuestionFilter'
import StudyStatusBadge from '@/components/interview/StudyStatusBadge'
import { categoryApi, questionApi, tagApi } from '@/services/interviewApi'
import type { Question, QuestionFilter as IQuestionFilter } from '@/types/interview'

const { Sider, Content } = Layout
const { Search } = Input

export default function InterviewBanksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { filter, setFilter, currentCategory, setCurrentCategory } = useInterviewStore()
  
  // 初始化筛选条件
  const [localFilter, setLocalFilter] = useState<IQuestionFilter>({
    ...filter,
    categoryId: searchParams.get('category') ? parseInt(searchParams.get('category')!) : undefined,
    keyword: searchParams.get('keyword') || '',
    difficulty: searchParams.get('difficulty') ? parseInt(searchParams.get('difficulty')!) as 1 | 2 | 3 : undefined,
    pageNum: parseInt(searchParams.get('page') || '1'),
    pageSize: 20
  })

  // 模拟数据
  const categories = [
    { id: 1, categoryName: 'Java基础', questionCount: 145 },
    { id: 2, categoryName: 'Java并发', questionCount: 98 },
    { id: 3, categoryName: 'JVM', questionCount: 76 },
    { id: 4, categoryName: 'Spring', questionCount: 123 },
    { id: 5, categoryName: '数据库', questionCount: 189 }
  ]
  
  const tags = [
    { id: 1, tagName: '高频', tagType: 1, useCount: 120 },
    { id: 2, tagName: '大厂', tagType: 2, useCount: 89 },
    { id: 3, tagName: '阿里', tagType: 2, useCount: 65 }
  ]
  
  const mockQuestions = [
    { 
      id: 1, 
      title: 'HashMap底层原理是什么？', 
      content: 'HashMap是基于哈希表实现的Map接口的具体实现类。它使用数组+链表+红黑树的数据结构，通过hash函数计算key的位置，支持快速的插入、删除和查找操作。当链表长度超过8时会转为红黑树以优化查找性能。', 
      difficulty: 2, 
      viewCount: 5420, 
      likeCount: 89, 
      collectCount: 156, 
      commentCount: 23, 
      tags: [{ id: 1, tagName: '高频' }] 
    },
    { 
      id: 2, 
      title: 'Spring的IoC和AOP原理', 
      content: 'IoC（控制反转）是Spring的核心特性，通过依赖注入实现对象之间的解耦。AOP（面向切面编程）通过代理模式实现横切关注点的分离，如日志、事务、安全等功能可以统一处理而不侵入业务代码。', 
      difficulty: 3, 
      viewCount: 4850, 
      likeCount: 134, 
      collectCount: 98, 
      commentCount: 45, 
      tags: [{ id: 2, tagName: '大厂' }] 
    },
    { 
      id: 3, 
      title: 'JVM内存模型详解', 
      content: 'JVM内存模型定义了程序中各种变量的访问规则。包括程序计数器、虚拟机栈、本地方法栈、堆内存、方法区等区域。堆内存用于存储对象实例，方法区用于存储类信息、常量、静态变量等。', 
      difficulty: 3, 
      viewCount: 4320, 
      likeCount: 112, 
      collectCount: 87, 
      commentCount: 34, 
      tags: [{ id: 3, tagName: '阿里' }] 
    }
  ]
  
  const questionData = {
    content: mockQuestions,
    totalElements: mockQuestions.length
  }
  
  const isLoading = false

  // 处理分类选择
  const handleCategorySelect = (categoryId: number | null) => {
    const newFilter = { 
      ...localFilter, 
      categoryId: categoryId || undefined,
      pageNum: 1
    }
    setLocalFilter(newFilter)
    setFilter(newFilter)
    
    // 更新URL
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set('category', categoryId.toString())
    } else {
      params.delete('category')
    }
    params.set('page', '1')
    router.push(`/interview/banks?${params.toString()}`)
  }

  // 处理搜索
  const handleSearch = (value: string) => {
    const newFilter = { 
      ...localFilter, 
      keyword: value,
      pageNum: 1
    }
    setLocalFilter(newFilter)
    setFilter(newFilter)
  }

  // 处理筛选
  const handleFilterChange = (key: string, value: any) => {
    const newFilter = { 
      ...localFilter, 
      [key]: value,
      pageNum: 1
    }
    setLocalFilter(newFilter)
    setFilter(newFilter)
  }

  // 处理分页
  const handlePageChange = (page: number, pageSize: number) => {
    const newFilter = { 
      ...localFilter, 
      pageNum: page,
      pageSize
    }
    setLocalFilter(newFilter)
    setFilter(newFilter)
    
    // 更新URL
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/interview/banks?${params.toString()}`)
  }

  // 跳转到题目详情
  const goToQuestion = (questionId: number) => {
    router.push(`/interview/question/${questionId}`)
  }

  const getDifficultyColor = (difficulty: number) => {
    switch(difficulty) {
      case 1: return 'green'
      case 2: return 'orange'
      case 3: return 'red'
      default: return 'default'
    }
  }

  const getDifficultyText = (difficulty: number) => {
    switch(difficulty) {
      case 1: return '简单'
      case 2: return '中等'
      case 3: return '困难'
      default: return '未知'
    }
  }

  return (
    <Layout className="min-h-[calc(100vh-64px)]">
      {/* 左侧分类栏 */}
      <Sider 
        width={260} 
        theme="light"
        className="border-r border-gray-200 overflow-auto"
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">题目分类</h3>
          <CategoryTree 
            categories={categories}
            selectedCategoryId={localFilter.categoryId}
            onSelect={handleCategorySelect}
          />
        </div>
      </Sider>

      {/* 中间题目列表 */}
      <Content className="bg-gray-50">
        <div className="p-6">
          {/* 搜索和筛选栏 */}
          <div className="mb-6 space-y-4">
            <Search
              placeholder="搜索题目标题或内容"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              defaultValue={localFilter.keyword}
              onSearch={handleSearch}
            />
            
            <div className="flex items-center justify-between">
              <Space>
                <Select
                  placeholder="难度"
                  allowClear
                  style={{ width: 120 }}
                  value={localFilter.difficulty}
                  onChange={(value) => handleFilterChange('difficulty', value)}
                >
                  <Select.Option value={1}>简单</Select.Option>
                  <Select.Option value={2}>中等</Select.Option>
                  <Select.Option value={3}>困难</Select.Option>
                </Select>
                
                <Select
                  placeholder="学习状态"
                  allowClear
                  style={{ width: 120 }}
                  value={localFilter.studyStatus}
                  onChange={(value) => handleFilterChange('studyStatus', value)}
                >
                  <Select.Option value={0}>未学习</Select.Option>
                  <Select.Option value={1}>学习中</Select.Option>
                  <Select.Option value={2}>已掌握</Select.Option>
                </Select>

                <Select
                  placeholder="排序方式"
                  style={{ width: 120 }}
                  value={localFilter.sortBy || 'default'}
                  onChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <Select.Option value="default">默认排序</Select.Option>
                  <Select.Option value="difficulty">难度排序</Select.Option>
                  <Select.Option value="viewCount">浏览最多</Select.Option>
                  <Select.Option value="updateTime">最近更新</Select.Option>
                </Select>
              </Space>

              <div className="text-gray-500">
                共 {questionData?.totalElements || 0} 道题目
              </div>
            </div>
          </div>

          {/* 题目列表 */}
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Spin size="large" tip="加载中..." />
            </div>
          ) : questionData && questionData.content.length > 0 ? (
            <>
              <div className="space-y-4">
                {questionData.content.map((question: Question) => (
                  <Card
                    key={question.id}
                    hoverable
                    className="cursor-pointer"
                    onClick={() => goToQuestion(question.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-base font-medium line-clamp-1">
                            {question.title}
                          </h4>
                          <Tag color={getDifficultyColor(question.difficulty)}>
                            {getDifficultyText(question.difficulty)}
                          </Tag>
                          <StudyStatusBadge questionId={question.id} />
                        </div>
                        
                        <div className="text-gray-500 text-sm line-clamp-2 mb-3">
                          {question.content ? question.content.replace(/[#*`]/g, '').substring(0, 150) + '...' : '暂无内容预览'}
                        </div>

                        <div className="flex items-center space-x-4 text-gray-400 text-sm">
                          <span className="flex items-center">
                            <EyeOutlined className="mr-1" />
                            {question.viewCount}
                          </span>
                          <span className="flex items-center">
                            <LikeOutlined className="mr-1" />
                            {question.likeCount}
                          </span>
                          <span className="flex items-center">
                            <StarOutlined className="mr-1" />
                            {question.collectCount}
                          </span>
                          <Divider type="vertical" />
                          <Space size={[0, 8]} wrap>
                            {question.tags?.slice(0, 3).map(tag => (
                              <Tag key={tag.id} className="text-xs">
                                {tag.tagName}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* 分页 */}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={localFilter.pageNum}
                  pageSize={localFilter.pageSize}
                  total={questionData.totalElements}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total) => `共 ${total} 道题目`}
                  onChange={handlePageChange}
                  pageSizeOptions={['10', '20', '50', '100']}
                />
              </div>
            </>
          ) : (
            <Empty description="暂无题目" />
          )}
        </div>
      </Content>

      {/* 右侧筛选栏 */}
      <Sider 
        width={280} 
        theme="light"
        className="border-l border-gray-200"
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div className="p-4">
          <QuestionFilter
            tags={tags}
            onFilterChange={handleFilterChange}
            currentFilter={localFilter}
          />
        </div>
      </Sider>
    </Layout>
  )
}
