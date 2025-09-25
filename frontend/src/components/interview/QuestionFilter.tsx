'use client'

import { useState } from 'react'
import { Card, Checkbox, Radio, Space, Button, Divider, Collapse, Tag } from 'antd'
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons'
import type { Tag as ITag, QuestionFilter as IQuestionFilter } from '@/types/interview'

const { Panel } = Collapse

interface QuestionFilterProps {
  tags: ITag[]
  onFilterChange: (key: string, value: any) => void
  currentFilter: IQuestionFilter
}

export default function QuestionFilter({
  tags,
  onFilterChange,
  currentFilter
}: QuestionFilterProps) {
  const [selectedTags, setSelectedTags] = useState<number[]>(currentFilter.tags || [])

  // 按类型分组标签
  const tagGroups = tags.reduce((groups, tag) => {
    const type = tag.tagType
    const typeName = ['', '技术', '公司', '岗位', '其他'][type]
    if (!groups[typeName]) {
      groups[typeName] = []
    }
    groups[typeName].push(tag)
    return groups
  }, {} as Record<string, ITag[]>)

  const handleTagToggle = (tagId: number) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId]
    
    setSelectedTags(newTags)
    onFilterChange('tags', newTags.length > 0 ? newTags : undefined)
  }

  const handleReset = () => {
    setSelectedTags([])
    onFilterChange('difficulty', undefined)
    onFilterChange('studyStatus', undefined)
    onFilterChange('tags', undefined)
    onFilterChange('sortBy', 'default')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FilterOutlined className="mr-2" />
          筛选条件
        </h3>
        <Button
          type="text"
          size="small"
          icon={<ReloadOutlined />}
          onClick={handleReset}
        >
          重置
        </Button>
      </div>

      {/* 难度筛选 */}
      <div>
        <div className="text-sm font-medium mb-2 text-gray-600">难度</div>
        <Radio.Group 
          value={currentFilter.difficulty}
          onChange={e => onFilterChange('difficulty', e.target.value)}
          className="w-full"
        >
          <Space direction="vertical" className="w-full">
            <Radio value={undefined}>全部</Radio>
            <Radio value={1}>
              <Tag color="green">简单</Tag>
            </Radio>
            <Radio value={2}>
              <Tag color="orange">中等</Tag>
            </Radio>
            <Radio value={3}>
              <Tag color="red">困难</Tag>
            </Radio>
          </Space>
        </Radio.Group>
      </div>

      <Divider className="my-3" />

      {/* 学习状态筛选 */}
      <div>
        <div className="text-sm font-medium mb-2 text-gray-600">学习状态</div>
        <Radio.Group 
          value={currentFilter.studyStatus}
          onChange={e => onFilterChange('studyStatus', e.target.value)}
          className="w-full"
        >
          <Space direction="vertical" className="w-full">
            <Radio value={undefined}>全部</Radio>
            <Radio value={0}>
              <span className="text-gray-500">未学习</span>
            </Radio>
            <Radio value={1}>
              <span className="text-blue-500">学习中</span>
            </Radio>
            <Radio value={2}>
              <span className="text-green-500">已掌握</span>
            </Radio>
          </Space>
        </Radio.Group>
      </div>

      <Divider className="my-3" />

      {/* 标签筛选 */}
      <div>
        <div className="text-sm font-medium mb-2 text-gray-600">标签</div>
        <Collapse 
          ghost 
          defaultActiveKey={['技术']}
          expandIconPosition="end"
        >
          {Object.entries(tagGroups).map(([typeName, typeTags]) => (
            <Panel 
              header={`${typeName} (${typeTags.length})`} 
              key={typeName}
              className="mb-2"
            >
              <div className="flex flex-wrap gap-2">
                {typeTags.map(tag => (
                  <Tag
                    key={tag.id}
                    color={selectedTags.includes(tag.id) ? 'blue' : undefined}
                    className="cursor-pointer select-none"
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.tagName}
                    {tag.useCount > 0 && (
                      <span className="ml-1 text-xs opacity-60">
                        ({tag.useCount})
                      </span>
                    )}
                  </Tag>
                ))}
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>

      <Divider className="my-3" />

      {/* 其他筛选选项 */}
      <div className="space-y-3">
        <Checkbox
          onChange={e => onFilterChange('hasNote', e.target.checked ? true : undefined)}
        >
          有笔记
        </Checkbox>
        <Checkbox
          onChange={e => onFilterChange('isCollected', e.target.checked ? true : undefined)}
        >
          已收藏
        </Checkbox>
        <Checkbox
          onChange={e => onFilterChange('isMarked', e.target.checked ? true : undefined)}
        >
          已标记
        </Checkbox>
      </div>

      {/* 当前筛选条件展示 */}
      {(selectedTags.length > 0 || currentFilter.difficulty || currentFilter.studyStatus) && (
        <>
          <Divider className="my-3" />
          <div>
            <div className="text-sm font-medium mb-2 text-gray-600">当前条件</div>
            <div className="flex flex-wrap gap-2">
              {currentFilter.difficulty && (
                <Tag 
                  closable
                  onClose={() => onFilterChange('difficulty', undefined)}
                  color={
                    currentFilter.difficulty === 1 ? 'green' :
                    currentFilter.difficulty === 2 ? 'orange' : 'red'
                  }
                >
                  {currentFilter.difficulty === 1 ? '简单' :
                   currentFilter.difficulty === 2 ? '中等' : '困难'}
                </Tag>
              )}
              {currentFilter.studyStatus !== undefined && (
                <Tag 
                  closable
                  onClose={() => onFilterChange('studyStatus', undefined)}
                >
                  {currentFilter.studyStatus === 0 ? '未学习' :
                   currentFilter.studyStatus === 1 ? '学习中' : '已掌握'}
                </Tag>
              )}
              {selectedTags.map(tagId => {
                const tag = tags.find(t => t.id === tagId)
                return tag && (
                  <Tag
                    key={tagId}
                    closable
                    onClose={() => handleTagToggle(tagId)}
                  >
                    {tag.tagName}
                  </Tag>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
