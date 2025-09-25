// API响应通用格式
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 登录响应数据
export interface LoginResponseData {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: UserInfo
}

// 用户信息
export interface UserInfo {
  id: number
  username: string
  email: string
  nickname: string
  avatar?: string
  bio?: string
  role: string
}

// 登录请求
export interface LoginRequest {
  username: string
  password: string
}

// 注册请求
export interface RegisterRequest {
  username: string
  password: string
  email: string
  nickname?: string
}

// 文章接口
export interface Article {
  id: number
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  viewCount: number
  likeCount: number
  commentCount: number
  readTime?: number
  isTop: boolean
  isFeatured: boolean
  authorId: number
  author?: UserInfo
  categoryId?: number
  category?: Category
  tags?: Tag[]
  createdAt: string
  updatedAt: string
}

// 分类
export interface Category {
  id: number
  name: string
  description?: string
  articleCount: number
  createdAt: string
}

// 标签
export interface Tag {
  id: number
  name: string
  color?: string
  articleCount: number
  createdAt: string
}

// 评论
export interface Comment {
  id: number
  content: string
  articleId: number
  userId: number
  user?: UserInfo
  parentId?: number
  children?: Comment[]
  likeCount: number
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  createdAt: string
}

// 分页响应
export interface PageResponse<T> {
  list: T[]        // 修改为list以匹配后端返回的数据结构
  total: number
  current?: number // 设置为可选，后端不返回此字段
  size?: number    // 设置为可选，后端不返回此字段
  pages: number
}

// 分页请求参数
export interface PageRequest {
  page?: number
  size?: number
  keyword?: string
  sort?: string
  order?: 'asc' | 'desc'
}

// 文章列表请求参数
export interface ArticleListRequest extends PageRequest {
  categoryId?: number
  tagIds?: number[]
  status?: number
  authorId?: number
}

// 文章创建/更新请求
export interface ArticleRequest {
  title: string
  content: string
  summary?: string
  coverImage?: string
  categoryId: number
  tagIds: number[]
  status: number // 0-草稿 1-发布
  isTop?: boolean
  isRecommend?: boolean
  articleType?: number // 1-原创 2-转载 3-翻译
  originalUrl?: string
  keywords?: string
  description?: string
}

// 批量操作请求
export interface BatchOperationRequest {
  action: 'updateStatus' | 'delete' | 'setTop' | 'setRecommend'
  articleIds: number[]
  params?: Record<string, any>
}

// 文章统计响应
export interface ArticleStats {
  total: number
  published: number
  draft: number
  totalViews: number
  totalLikes: number
  totalComments: number
}

// 批量导入相关接口

// 导入的markdown文件信息
export interface ImportFileInfo {
  id: string
  name: string
  path: string
  size: number
  content: string
  frontmatter: Record<string, any>
  title: string
  category: string
  tags: string[]
  createTime?: string
  updateTime?: string
  originalUrl?: string
  selected: boolean
  selectedCategoryId?: string // 用户选择的分类
  status: 'pending' | 'success' | 'error' | 'skipped'
  error?: string
}

// 导入配置
export interface ImportConfig {
  mode: 'skip' | 'overwrite' | 'update' // 重复处理模式
  createCategories: boolean // 是否自动创建分类
  createTags: boolean // 是否自动创建标签
  defaultStatus: 0 | 1 // 默认文章状态：0-草稿，1-发布
  categoryMapping: Record<string, number> // 分类映射
  tagMapping: Record<string, number> // 标签映射
  preserveTime: boolean // 是否保留原始时间
  batchSize: number // 批量导入大小
  defaultCategoryId?: number // 默认分类 ID
}

// 导入进度信息
export interface ImportProgress {
  total: number
  processed: number
  success: number
  failed: number
  skipped: number
  currentFile?: string
  status: 'idle' | 'scanning' | 'importing' | 'completed' | 'cancelled'
  errors: Array<{
    file: string
    error: string
  }>
}

// 批量导入请求
export interface BatchImportRequest {
  files: ImportFileInfo[]
  config: ImportConfig
}

// 批量导入响应
export interface BatchImportResponse {
  progress: ImportProgress
  results: Array<{
    file: string
    articleId?: number
    status: 'success' | 'error' | 'skipped'
    message?: string
  }>
}
