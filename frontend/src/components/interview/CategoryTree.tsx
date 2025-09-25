'use client'

import { useMemo } from 'react'
import { Tree, Badge, Space } from 'antd'
import { FolderOutlined, FolderOpenOutlined, FileTextOutlined } from '@ant-design/icons'
import type { Category } from '@/types/interview'
import type { DataNode } from 'antd/es/tree'

interface CategoryTreeProps {
  categories: Category[]
  selectedCategoryId?: number
  onSelect: (categoryId: number | null) => void
  showCount?: boolean
  expandedKeys?: string[]
  onExpand?: (keys: string[]) => void
}

export default function CategoryTree({
  categories,
  selectedCategoryId,
  onSelect,
  showCount = true,
  expandedKeys,
  onExpand
}: CategoryTreeProps) {
  
  // 构建树形数据
  const treeData = useMemo(() => {
    const buildTree = (items: Category[], parentId = 0): DataNode[] => {
      return items
        .filter(item => item.parentId === parentId)
        .map(item => {
          const children = buildTree(items, item.id)
          const hasChildren = children.length > 0
          
          return {
            key: item.id.toString(),
            title: (
              <div className="flex items-center justify-between w-full pr-2">
                <Space>
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.categoryName}
                  </span>
                </Space>
                {showCount && (
                  <Badge 
                    count={item.questionCount} 
                    showZero
                    className="ml-2"
                    style={{ 
                      backgroundColor: selectedCategoryId === item.id ? '#1890ff' : '#f0f0f0',
                      color: selectedCategoryId === item.id ? '#fff' : '#999'
                    }}
                  />
                )}
              </div>
            ),
            icon: hasChildren ? 
              (expandedKeys?.includes(item.id.toString()) ? 
                <FolderOpenOutlined className="text-blue-500" /> : 
                <FolderOutlined className="text-gray-500" />
              ) : 
              <FileTextOutlined className="text-gray-400" />,
            children: hasChildren ? children : undefined,
            isLeaf: !hasChildren
          }
        })
    }

    // 添加"全部"选项
    const allNode: DataNode = {
      key: '0',
      title: (
        <div className="flex items-center justify-between w-full pr-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            全部题目
          </span>
          {showCount && (
            <Badge 
              count={categories.reduce((sum, cat) => sum + cat.questionCount, 0)} 
              showZero
              style={{ 
                backgroundColor: !selectedCategoryId ? '#1890ff' : '#f0f0f0',
                color: !selectedCategoryId ? '#fff' : '#999'
              }}
            />
          )}
        </div>
      ),
      icon: <FolderOutlined className="text-blue-500" />,
      isLeaf: false
    }

    return [allNode, ...buildTree(categories)]
  }, [categories, selectedCategoryId, showCount, expandedKeys])

  const handleSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0]
      onSelect(key === '0' ? null : Number(key))
    }
  }

  return (
    <div className="category-tree">
      <Tree
        treeData={treeData}
        selectedKeys={selectedCategoryId ? [selectedCategoryId.toString()] : ['0']}
        expandedKeys={expandedKeys}
        onSelect={handleSelect}
        onExpand={(keys) => onExpand?.(keys as string[])}
        showIcon
        blockNode
        className="bg-transparent"
      />
      
      <style jsx global>{`
        .category-tree .ant-tree-node-content-wrapper {
          width: 100%;
        }
        .category-tree .ant-tree-node-selected {
          background-color: rgba(24, 144, 255, 0.1) !important;
        }
        .category-tree .ant-tree-node-content-wrapper:hover {
          background-color: rgba(0, 0, 0, 0.04) !important;
        }
        .dark .category-tree .ant-tree-node-content-wrapper:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
        }
        .dark .category-tree .ant-tree-node-selected {
          background-color: rgba(24, 144, 255, 0.2) !important;
        }
      `}</style>
    </div>
  )
}
