import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category, Question, QuestionFilter, StudyProgress } from '@/types/interview'

interface InterviewState {
  // 分类数据
  categories: Category[]
  currentCategory: Category | null
  
  // 题目数据
  currentQuestion: Question | null
  questionList: Question[]
  
  // 筛选条件
  filter: QuestionFilter
  
  // 学习进度
  studyProgressMap: Map<number, StudyProgress>
  
  // UI状态
  sidebarCollapsed: boolean
  isDarkMode: boolean
  fontSize: 'small' | 'medium' | 'large'
  
  // 浏览历史
  browseHistory: number[] // 题目ID列表
  lastViewedQuestionId: number | null
  
  // Actions
  setCategories: (categories: Category[]) => void
  setCurrentCategory: (category: Category | null) => void
  setCurrentQuestion: (question: Question | null) => void
  setQuestionList: (questions: Question[]) => void
  setFilter: (filter: Partial<QuestionFilter>) => void
  updateStudyProgress: (questionId: number, progress: StudyProgress) => void
  toggleSidebar: () => void
  toggleDarkMode: () => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
  addToBrowseHistory: (questionId: number) => void
  clearBrowseHistory: () => void
}

const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      // 初始状态
      categories: [],
      currentCategory: null,
      currentQuestion: null,
      questionList: [],
      filter: {
        pageNum: 1,
        pageSize: 20,
        sortBy: 'default'
      },
      studyProgressMap: new Map(),
      sidebarCollapsed: false,
      isDarkMode: false,
      fontSize: 'medium',
      browseHistory: [],
      lastViewedQuestionId: null,

      // Actions
      setCategories: (categories) => set({ categories }),
      
      setCurrentCategory: (category) => set({ currentCategory: category }),
      
      setCurrentQuestion: (question) => {
        const state = get()
        if (question && !state.browseHistory.includes(question.id)) {
          state.addToBrowseHistory(question.id)
        }
        set({ 
          currentQuestion: question,
          lastViewedQuestionId: question?.id || null 
        })
      },
      
      setQuestionList: (questions) => set({ questionList: questions }),
      
      setFilter: (filter) => set((state) => ({
        filter: { ...state.filter, ...filter }
      })),
      
      updateStudyProgress: (questionId, progress) => set((state) => {
        const newMap = new Map(state.studyProgressMap)
        newMap.set(questionId, progress)
        return { studyProgressMap: newMap }
      }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      toggleDarkMode: () => set((state) => ({ 
        isDarkMode: !state.isDarkMode 
      })),
      
      setFontSize: (fontSize) => set({ fontSize }),
      
      addToBrowseHistory: (questionId) => set((state) => {
        const history = [...state.browseHistory]
        // 移除重复项
        const index = history.indexOf(questionId)
        if (index > -1) {
          history.splice(index, 1)
        }
        // 添加到最前面
        history.unshift(questionId)
        // 限制历史记录长度
        if (history.length > 50) {
          history.pop()
        }
        return { browseHistory: history }
      }),
      
      clearBrowseHistory: () => set({ browseHistory: [] })
    }),
    {
      name: 'interview-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        isDarkMode: state.isDarkMode,
        fontSize: state.fontSize,
        lastViewedQuestionId: state.lastViewedQuestionId,
        browseHistory: state.browseHistory.slice(0, 10) // 只持久化最近10条
      })
    }
  )
)

export default useInterviewStore
