'use client'

import { Badge, Tag } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { studyApi } from '@/services/interviewApi'
import useInterviewStore from '@/stores/interviewStore'

interface StudyStatusBadgeProps {
  questionId: number
  showText?: boolean
  size?: 'small' | 'default'
}

export default function StudyStatusBadge({ 
  questionId, 
  showText = false,
  size = 'small'
}: StudyStatusBadgeProps) {
  const { studyProgressMap } = useInterviewStore()
  
  // 从缓存获取学习进度
  const cachedProgress = studyProgressMap.get(questionId)
  
  // 查询学习进度
  const { data: progress } = useQuery({
    queryKey: ['studyProgress', questionId],
    queryFn: () => studyApi.getStudyProgress(questionId),
    enabled: !cachedProgress,
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  })

  const studyStatus = cachedProgress?.studyStatus ?? progress?.studyStatus

  if (studyStatus === undefined || studyStatus === null) {
    return null
  }

  const getStatusConfig = () => {
    switch(studyStatus) {
      case 0:
        return {
          color: 'default',
          icon: <MinusCircleOutlined />,
          text: '未学习',
          className: 'text-gray-500'
        }
      case 1:
        return {
          color: 'processing',
          icon: <ClockCircleOutlined />,
          text: '学习中',
          className: 'text-blue-500'
        }
      case 2:
        return {
          color: 'success',
          icon: <CheckCircleOutlined />,
          text: '已掌握',
          className: 'text-green-500'
        }
      default:
        return null
    }
  }

  const config = getStatusConfig()
  if (!config) return null

  if (!showText) {
    return (
      <span className={config.className} title={config.text}>
        {config.icon}
      </span>
    )
  }

  return (
    <Tag
      color={config.color}
      icon={config.icon}
      className={size === 'small' ? 'text-xs' : ''}
    >
      {config.text}
    </Tag>
  )
}
