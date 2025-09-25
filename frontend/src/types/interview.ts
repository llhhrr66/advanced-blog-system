// 面试题相关类型定义

// 分类
export interface Category {
  id: number
  parentId: number
  categoryName: string
  categoryPath?: string
  description?: string
  icon?: string
  sortOrder: number
  questionCount: number
  status: number
  children?: Category[]
}

// 面试题
export interface Question {
  id: number
  categoryId: number
  title: string
  content: string
  contentHtml?: string
  difficulty: 1 | 2 | 3 // 1-简单 2-中等 3-困难
  source?: string
  sourceUrl?: string
  filePath?: string
  viewCount: number
  likeCount: number
  collectCount: number
  commentCount: number
  sortOrder: number
  status: 0 | 1 | 2 // 0-草稿 1-发布 2-归档
  tags?: Tag[]
  category?: Category
  importTime?: string
  lastUpdateTime?: string
  createTime: string
  updateTime: string
}

// 标签
export interface Tag {
  id: number
  tagName: string
  tagType: 1 | 2 | 3 | 4 // 1-技术 2-公司 3-岗位 4-其他
  useCount: number
}

// 学习进度
export interface StudyProgress {
  id: number
  userId: number
  questionId: number
  categoryId: number
  studyStatus: 0 | 1 | 2 // 0-未学习 1-学习中 2-已掌握
  difficultyRating?: number // 1-5星
  importanceRating?: number // 1-5星
  studyCount: number
  totalStudyTime: number // 秒
  lastStudyTime?: string
  masteryTime?: string
  nextReviewTime?: string
  reviewCount: number
  isMarked: boolean
  markReason?: string
}

// 用户笔记
export interface UserNote {
  id: number
  userId: number
  questionId: number
  noteContent: string
  noteHtml?: string
  isPublic: boolean
  likeCount: number
  createTime: string
  updateTime: string
}

// 收藏
export interface Collection {
  id: number
  userId: number
  questionId: number
  folderId: number
  createTime: string
}

// 收藏夹
export interface CollectionFolder {
  id: number
  userId: number
  folderName: string
  description?: string
  questionCount: number
  isDefault: boolean
}

// 导入任务
export interface ImportTask {
  id: number
  taskName: string
  sourcePath: string
  totalFiles: number
  successCount: number
  failCount: number
  skipCount: number
  taskStatus: 0 | 1 | 2 | 3 | 4 // 0-待执行 1-执行中 2-成功 3-失败 4-部分成功
  errorMessage?: string
  startTime?: string
  endTime?: string
}

// 学习统计
export interface StudyStatistics {
  totalStudyCount: number
  newStudyCount: number
  reviewCount: number
  masteryCount: number
  studyDuration: number // 秒
  categoryDistribution?: Record<string, number>
  statDate: string
}

// API响应
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  code?: string
}

// 分页响应
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// 题目筛选参数
export interface QuestionFilter {
  categoryId?: number
  difficulty?: 1 | 2 | 3
  tags?: number[]
  studyStatus?: 0 | 1 | 2
  keyword?: string
  sortBy?: 'default' | 'difficulty' | 'viewCount' | 'updateTime'
  pageNum?: number
  pageSize?: number
}

// 题目导航信息
export interface QuestionNavigation {
  current: Question
  previous?: Question
  next?: Question
  totalCount: number
  currentIndex: number
}
