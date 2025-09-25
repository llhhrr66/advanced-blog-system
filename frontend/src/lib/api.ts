import axios from 'axios'
import { getCookie, removeCookie } from '@/lib/cookies'
import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponseData, 
  RegisterRequest, 
  UserInfo,
  Article,
  ArticleListRequest,
  ArticleRequest,
  PageResponse,
  Category,
  Tag,
  ArticleStats,
  BatchOperationRequest,
  BatchImportRequest,
  BatchImportResponse,
  ImportProgress
} from '@/types/api'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 优先从 localStorage 获取token，如果没有再从 cookies 获取
    let token = localStorage.getItem('access_token')
    if (!token) {
      token = getCookie('access_token')
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 直接返回response.data，让类型在调用处处理
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // 清除token并跳转到登录页
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_info')
      
      // 清除cookies
      removeCookie('access_token', { path: '/' })
      removeCookie('refresh_token', { path: '/' })
      
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 认证相关API
export const authAPI = {
  // 登录
  login: (data: LoginRequest) =>
    api.post('/auth/login', data).then(res => res.data),
  
  // 注册
  register: (data: RegisterRequest) =>
    api.post('/auth/register', data).then(res => res.data),
  
  // 刷新token
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }).then(res => res.data),
  
  // 获取当前用户信息
  getCurrentUser: () =>
    api.get('/auth/current').then(res => res.data),
  
  // 退出登录
  logout: () =>
    api.post('/auth/logout').then(res => res.data),
}

// 文章管理API
export const articleAPI = {
  // 获取文章列表
  getList: (params: ArticleListRequest) =>
    api.get('/articles', { params }).then(res => res.data),
    
  // 获取文章详情
  getDetail: (id: number) =>
    api.get(`/articles/${id}`).then(res => res.data),
    
  // 创建文章
  create: (data: ArticleRequest) =>
    api.post('/articles', data).then(res => res.data),
    
  // 更新文章
  update: (id: number, data: ArticleRequest) =>
    api.put(`/articles/${id}`, data).then(res => res.data),
    
  // 删除文章
  delete: (id: number) =>
    api.delete(`/articles/${id}`).then(res => res.data),
    
  // 获取我的文章列表
  getMyArticles: (params: ArticleListRequest) =>
    api.get('/articles/my', { params }).then(res => res.data),
    
  // 获取文章统计
  getStats: () =>
    api.get('/articles/stats').then(res => res.data),
    
  // 批量操作文章
  batchOperation: (data: BatchOperationRequest) =>
    api.post('/articles/batch', data).then(res => res.data),
    
  // 批量导入文章
  batchImport: (data: BatchImportRequest) =>
    api.post('/import/batch', data).then(res => res.data),
    
  // 获取导入进度
  getImportProgress: (taskId: string) =>
    api.get(`/import/progress/${taskId}`).then(res => res.data),
    
  // 取消导入任务
  cancelImport: (taskId: string) =>
    api.post(`/import/cancel/${taskId}`).then(res => res.data),
}

// 分类管理API
export const categoryAPI = {
  // 获取分类列表
  getList: (includeArticleCount = false) =>
    api.get('/categories', { params: { includeArticleCount } }).then(res => res.data),
    
  // 创建分类
  create: (data: { name: string; description?: string; icon?: string; sortOrder?: number }) =>
    api.post('/categories', data).then(res => res.data),
    
  // 更新分类
  update: (id: number, data: { name: string; description?: string; icon?: string; sortOrder?: number }) =>
    api.put(`/categories/${id}`, data).then(res => res.data),
    
  // 删除分类
  delete: (id: number) =>
    api.delete(`/categories/${id}`).then(res => res.data),
}

// 批量导入API
export const importAPI = {
  // 扫描目录
  scanDirectory: (directory: string) =>
    api.get('/import/scan', { params: { directory } }).then(res => res.data),
    
  // 上传文件
  uploadFiles: (files: FormData) =>
    api.post('/import/upload', files, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => res.data),
    
  // 批量导入
  batchImport: (data: BatchImportRequest) =>
    api.post('/import/batch', data).then(res => res.data),
    
  // 获取导入进度
  getImportProgress: (taskId: string) =>
    api.get(`/import/progress/${taskId}`).then(res => res.data),
    
  // 取消导入任务
  cancelImport: (taskId: string) =>
    api.post(`/import/cancel/${taskId}`).then(res => res.data),
    
  // 单文件导入
  importSingle: (fileInfo: any, config: any) =>
    api.post('/import/single', { fileInfo, config }).then(res => res.data),
    
  // 验证文件
  validateFiles: (files: any[]) =>
    api.post('/import/validate', files).then(res => res.data),
}

// 标签管理API
export const tagAPI = {
  // 获取标签列表
  getList: () =>
    api.get('/tags').then(res => res.data),
    
  // 获取热门标签
  getHotTags: () =>
    api.get('/tags/hot').then(res => res.data),
    
  // 创建标签
  create: (data: { name: string; color?: string; description?: string }) =>
    api.post('/tags', data).then(res => res.data),
    
  // 更新标签
  update: (id: number, data: { name: string; color?: string; description?: string }) =>
    api.put(`/tags/${id}`, data).then(res => res.data),
    
  // 删除标签
  delete: (id: number) =>
    api.delete(`/tags/${id}`).then(res => res.data),
}

// 测试API
export const testAPI = {
  ping: () => api.get('/test/ping').then(res => res.data),
}

export default api
