import { Question, Category as InterviewCategory, ApiResponse, PageResponse } from '@/types/interview'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 面试题管理 API
export const interviewQuestionApi = {
  // 获取面试题列表（分页）
  async getQuestions(params: {
    pageNum?: number
    pageSize?: number
    categoryId?: number
    difficulty?: number
    status?: number
    keyword?: string
  }): Promise<ApiResponse<PageResponse<Question>>> {
    const response = await api.get('/interview/questions', { params })
    return response.data
  },

  // 根据ID获取面试题详情
  async getQuestion(id: number): Promise<ApiResponse<Question>> {
    const response = await api.get(`/interview/questions/${id}`)
    return response.data
  },

  // 创建新面试题
  async createQuestion(data: {
    categoryId: number
    title: string
    content: string
    difficulty: number
    status?: number
    source?: string
    sourceUrl?: string
  }): Promise<ApiResponse<Question>> {
    const response = await api.post('/interview/questions', data)
    return response.data
  },

  // 更新面试题
  async updateQuestion(id: number, data: {
    categoryId?: number
    title?: string
    content?: string
    difficulty?: number
    status?: number
    source?: string
    sourceUrl?: string
    sortOrder?: number
  }): Promise<ApiResponse<Question>> {
    const response = await api.put(`/interview/questions/${id}`, data)
    return response.data
  },

  // 删除面试题
  async deleteQuestion(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/interview/questions/${id}`)
    return response.data
  },

  // 批量删除面试题
  async deleteQuestions(ids: number[]): Promise<ApiResponse<void>> {
    const response = await api.delete('/interview/questions/batch', { data: { ids } })
    return response.data
  },

  // 更新面试题状态
  async updateQuestionStatus(id: number, status: number): Promise<ApiResponse<void>> {
    const response = await api.patch(`/interview/questions/${id}/status`, { status })
    return response.data
  },

  // 批量更新面试题状态
  async updateQuestionsStatus(ids: number[], status: number): Promise<ApiResponse<void>> {
    const response = await api.patch('/interview/questions/batch/status', { ids, status })
    return response.data
  }
}

// 面试题分类管理 API
export const interviewCategoryApi = {
  // 获取所有分类（树形结构）
  async getCategories(): Promise<ApiResponse<InterviewCategory[]>> {
    const response = await api.get('/interview/categories')
    return response.data
  },

  // 获取分类列表（平铺，带分页）
  async getCategoriesList(params: {
    pageNum?: number
    pageSize?: number
    parentId?: number
    keyword?: string
  }): Promise<ApiResponse<PageResponse<InterviewCategory>>> {
    const response = await api.get('/interview/categories/list', { params })
    return response.data
  },

  // 根据ID获取分类详情
  async getCategory(id: number): Promise<ApiResponse<InterviewCategory>> {
    const response = await api.get(`/interview/categories/${id}`)
    return response.data
  },

  // 创建新分类
  async createCategory(data: {
    parentId?: number
    categoryName: string
    description?: string
    icon?: string
    sortOrder?: number
  }): Promise<ApiResponse<InterviewCategory>> {
    const response = await api.post('/interview/categories', data)
    return response.data
  },

  // 更新分类
  async updateCategory(id: number, data: {
    parentId?: number
    categoryName?: string
    description?: string
    icon?: string
    sortOrder?: number
    status?: number
  }): Promise<ApiResponse<InterviewCategory>> {
    const response = await api.put(`/interview/categories/${id}`, data)
    return response.data
  },

  // 删除分类
  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/interview/categories/${id}`)
    return response.data
  },

  // 更新分类状态
  async updateCategoryStatus(id: number, status: number): Promise<ApiResponse<void>> {
    const response = await api.patch(`/interview/categories/${id}/status`, { status })
    return response.data
  }
}

// 批量导入 API
export const importApi = {
  // 扫描目录
  async scanDirectory(directory: string): Promise<ApiResponse<any[]>> {
    const response = await api.post('/import/scan', { directory })
    return response.data
  },

  // 批量导入
  async batchImport(data: {
    files: any[]
    config: {
      mode: 'skip' | 'update' | 'overwrite'
      createCategories: boolean
      createTags: boolean
      preserveTime: boolean
      defaultStatus: number
      batchSize?: number
    }
  }): Promise<ApiResponse<any>> {
    const response = await api.post('/import/batch', data)
    return response.data
  },

  // 获取导入进度
  async getImportProgress(taskId: string): Promise<ApiResponse<any>> {
    const response = await api.get(`/import/progress/${taskId}`)
    return response.data
  },

  // 取消导入
  async cancelImport(taskId: string): Promise<ApiResponse<void>> {
    const response = await api.post(`/import/cancel/${taskId}`)
    return response.data
  },

  // 验证文件
  async validateFile(file: any): Promise<ApiResponse<any>> {
    const response = await api.post('/import/validate', file)
    return response.data
  }
}

export default {
  interviewQuestionApi,
  interviewCategoryApi,
  importApi
}
