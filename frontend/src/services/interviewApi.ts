import axios from '@/lib/api'
import type {
  ApiResponse,
  PageResponse,
  Category,
  Question,
  QuestionFilter,
  QuestionNavigation,
  Tag,
  StudyProgress,
  UserNote,
  Collection,
  CollectionFolder,
  StudyStatistics,
  ImportTask
} from '@/types/interview'

const API_PREFIX = '/api/interview'

// 分类相关API
export const categoryApi = {
  // 获取分类树
  getCategoryTree: async (): Promise<Category[]> => {
    const { data } = await axios.get<ApiResponse<Category[]>>(`${API_PREFIX}/categories/tree`)
    return data.data || []
  },

  // 获取分类详情
  getCategoryById: async (id: number): Promise<Category> => {
    const { data } = await axios.get<ApiResponse<Category>>(`${API_PREFIX}/categories/${id}`)
    return data.data!
  },

  // 创建分类
  createCategory: async (category: Partial<Category>): Promise<Category> => {
    const { data } = await axios.post<ApiResponse<Category>>(`${API_PREFIX}/categories`, category)
    return data.data!
  },

  // 更新分类
  updateCategory: async (id: number, category: Partial<Category>): Promise<Category> => {
    const { data } = await axios.put<ApiResponse<Category>>(`${API_PREFIX}/categories/${id}`, category)
    return data.data!
  },

  // 删除分类
  deleteCategory: async (id: number): Promise<void> => {
    await axios.delete(`${API_PREFIX}/categories/${id}`)
  }
}

// 题目相关API
export const questionApi = {
  // 获取题目列表
  getQuestions: async (filter: QuestionFilter): Promise<PageResponse<Question>> => {
    const { data } = await axios.get<ApiResponse<PageResponse<Question>>>(`${API_PREFIX}/questions`, {
      params: filter
    })
    return data.data!
  },

  // 获取题目详情
  getQuestionById: async (id: number): Promise<Question> => {
    const { data } = await axios.get<ApiResponse<Question>>(`${API_PREFIX}/questions/${id}`)
    return data.data!
  },

  // 获取题目导航信息
  getQuestionNavigation: async (id: number, categoryId?: number): Promise<QuestionNavigation> => {
    const { data } = await axios.get<ApiResponse<QuestionNavigation>>(`${API_PREFIX}/questions/${id}/navigation`, {
      params: { categoryId }
    })
    return data.data!
  },

  // 创建题目
  createQuestion: async (question: Partial<Question>): Promise<Question> => {
    const { data } = await axios.post<ApiResponse<Question>>(`${API_PREFIX}/questions`, question)
    return data.data!
  },

  // 更新题目
  updateQuestion: async (id: number, question: Partial<Question>): Promise<Question> => {
    const { data } = await axios.put<ApiResponse<Question>>(`${API_PREFIX}/questions/${id}`, question)
    return data.data!
  },

  // 删除题目
  deleteQuestion: async (id: number): Promise<void> => {
    await axios.delete(`${API_PREFIX}/questions/${id}`)
  },

  // 增加浏览次数
  increaseViewCount: async (id: number): Promise<void> => {
    await axios.post(`${API_PREFIX}/questions/${id}/view`)
  },

  // 点赞题目
  likeQuestion: async (id: number): Promise<void> => {
    await axios.post(`${API_PREFIX}/questions/${id}/like`)
  },

  // 取消点赞
  unlikeQuestion: async (id: number): Promise<void> => {
    await axios.delete(`${API_PREFIX}/questions/${id}/like`)
  }
}

// 标签相关API
export const tagApi = {
  // 获取所有标签
  getTags: async (): Promise<Tag[]> => {
    const { data } = await axios.get<ApiResponse<Tag[]>>(`${API_PREFIX}/tags`)
    return data.data || []
  },

  // 获取热门标签
  getHotTags: async (limit: number = 20): Promise<Tag[]> => {
    const { data } = await axios.get<ApiResponse<Tag[]>>(`${API_PREFIX}/tags/hot`, {
      params: { limit }
    })
    return data.data || []
  },

  // 创建标签
  createTag: async (tag: Partial<Tag>): Promise<Tag> => {
    const { data } = await axios.post<ApiResponse<Tag>>(`${API_PREFIX}/tags`, tag)
    return data.data!
  }
}

// 学习进度API
export const studyApi = {
  // 获取题目学习进度
  getStudyProgress: async (questionId: number): Promise<StudyProgress | null> => {
    const { data } = await axios.get<ApiResponse<StudyProgress>>(`${API_PREFIX}/study/progress/${questionId}`)
    return data.data || null
  },

  // 更新学习进度
  updateStudyProgress: async (questionId: number, progress: Partial<StudyProgress>): Promise<StudyProgress> => {
    const { data } = await axios.post<ApiResponse<StudyProgress>>(`${API_PREFIX}/study/progress/${questionId}`, progress)
    return data.data!
  },

  // 获取学习统计
  getStudyStatistics: async (startDate?: string, endDate?: string): Promise<StudyStatistics[]> => {
    const { data } = await axios.get<ApiResponse<StudyStatistics[]>>(`${API_PREFIX}/study/statistics`, {
      params: { startDate, endDate }
    })
    return data.data || []
  },

  // 获取待复习题目
  getReviewQuestions: async (): Promise<Question[]> => {
    const { data } = await axios.get<ApiResponse<Question[]>>(`${API_PREFIX}/study/review`)
    return data.data || []
  },

  // 标记题目
  markQuestion: async (questionId: number, reason: string): Promise<void> => {
    await axios.post(`${API_PREFIX}/study/mark/${questionId}`, { reason })
  },

  // 取消标记
  unmarkQuestion: async (questionId: number): Promise<void> => {
    await axios.delete(`${API_PREFIX}/study/mark/${questionId}`)
  }
}

// 笔记相关API
export const noteApi = {
  // 获取题目笔记
  getQuestionNotes: async (questionId: number): Promise<UserNote[]> => {
    const { data } = await axios.get<ApiResponse<UserNote[]>>(`${API_PREFIX}/notes/question/${questionId}`)
    return data.data || []
  },

  // 获取我的笔记
  getMyNote: async (questionId: number): Promise<UserNote | null> => {
    const { data } = await axios.get<ApiResponse<UserNote>>(`${API_PREFIX}/notes/my/${questionId}`)
    return data.data || null
  },

  // 创建/更新笔记
  saveNote: async (questionId: number, content: string, isPublic: boolean = false): Promise<UserNote> => {
    const { data } = await axios.post<ApiResponse<UserNote>>(`${API_PREFIX}/notes/${questionId}`, {
      noteContent: content,
      isPublic
    })
    return data.data!
  },

  // 删除笔记
  deleteNote: async (noteId: number): Promise<void> => {
    await axios.delete(`${API_PREFIX}/notes/${noteId}`)
  },

  // 点赞笔记
  likeNote: async (noteId: number): Promise<void> => {
    await axios.post(`${API_PREFIX}/notes/${noteId}/like`)
  }
}

// 收藏相关API
export const collectionApi = {
  // 收藏题目
  collectQuestion: async (questionId: number, folderId?: number): Promise<void> => {
    await axios.post(`${API_PREFIX}/collections/${questionId}`, { folderId })
  },

  // 取消收藏
  uncollectQuestion: async (questionId: number): Promise<void> => {
    await axios.delete(`${API_PREFIX}/collections/${questionId}`)
  },

  // 检查是否收藏
  isCollected: async (questionId: number): Promise<boolean> => {
    const { data } = await axios.get<ApiResponse<boolean>>(`${API_PREFIX}/collections/check/${questionId}`)
    return data.data || false
  },

  // 获取收藏夹列表
  getCollectionFolders: async (): Promise<CollectionFolder[]> => {
    const { data } = await axios.get<ApiResponse<CollectionFolder[]>>(`${API_PREFIX}/collections/folders`)
    return data.data || []
  },

  // 创建收藏夹
  createFolder: async (folder: Partial<CollectionFolder>): Promise<CollectionFolder> => {
    const { data } = await axios.post<ApiResponse<CollectionFolder>>(`${API_PREFIX}/collections/folders`, folder)
    return data.data!
  },

  // 获取收藏夹内题目
  getFolderQuestions: async (folderId: number): Promise<Question[]> => {
    const { data } = await axios.get<ApiResponse<Question[]>>(`${API_PREFIX}/collections/folders/${folderId}/questions`)
    return data.data || []
  }
}

// 导入相关API
export const importApi = {
  // 创建导入任务
  createImportTask: async (taskName: string, sourcePath: string): Promise<ImportTask> => {
    const { data } = await axios.post<ApiResponse<ImportTask>>(`${API_PREFIX}/import/tasks`, {
      taskName,
      sourcePath
    })
    return data.data!
  },

  // 获取导入任务列表
  getImportTasks: async (): Promise<ImportTask[]> => {
    const { data } = await axios.get<ApiResponse<ImportTask[]>>(`${API_PREFIX}/import/tasks`)
    return data.data || []
  },

  // 获取导入任务详情
  getImportTaskDetail: async (taskId: number): Promise<ImportTask> => {
    const { data } = await axios.get<ApiResponse<ImportTask>>(`${API_PREFIX}/import/tasks/${taskId}`)
    return data.data!
  },

  // 执行导入任务
  executeImportTask: async (taskId: number): Promise<void> => {
    await axios.post(`${API_PREFIX}/import/tasks/${taskId}/execute`)
  }
}

// 搜索相关API
export const searchApi = {
  // 搜索题目
  searchQuestions: async (keyword: string, limit: number = 10): Promise<Question[]> => {
    const { data } = await axios.get<ApiResponse<Question[]>>(`${API_PREFIX}/search`, {
      params: { keyword, limit }
    })
    return data.data || []
  },

  // 获取搜索建议
  getSearchSuggestions: async (keyword: string): Promise<string[]> => {
    const { data } = await axios.get<ApiResponse<string[]>>(`${API_PREFIX}/search/suggestions`, {
      params: { keyword }
    })
    return data.data || []
  }
}
