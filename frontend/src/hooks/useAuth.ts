import { useState, useEffect, useCallback } from 'react'
import { authAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface User {
  id: number
  username: string
  email: string
  nickname: string
  avatar?: string
  bio?: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuth = () => {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  })

  // 检查认证状态
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
        return
      }

      // 尝试获取用户信息
      const response = await authAPI.getCurrentUser()
      
      if (response.code === 200) {
        setAuthState({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
        
        // 更新localStorage中的用户信息
        localStorage.setItem('user_info', JSON.stringify(response.data))
      } else {
        throw new Error('获取用户信息失败')
      }
    } catch (error: any) {
      // 清除无效token
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_info')
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || '认证失败'
      })
    }
  }, [])

  // 登录
  const login = useCallback(async (credentials: { username: string; password: string }) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await authAPI.login(credentials)
      
      if (response.code === 200 && response.data?.accessToken) {
        const { accessToken, refreshToken, user } = response.data
        
        // 存储tokens
        localStorage.setItem('access_token', accessToken)
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken)
        }
        
        // 更新状态
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
        
        localStorage.setItem('user_info', JSON.stringify(user))
        toast.success('登录成功！')
        
        return { success: true, data: response.data }
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || '登录失败'
      
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }))
      
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  // 登出
  const logout = useCallback(async () => {
    try {
      // 调用后端登出接口
      await authAPI.logout()
    } catch (error) {
      console.error('登出请求失败:', error)
    } finally {
      // 无论如何都要清除本地状态
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_info')
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
      
      toast.success('退出成功')
      router.push('/login')
    }
  }, [router])

  // 刷新token
  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('没有刷新令牌')
      }

      const response = await authAPI.refreshToken(refreshToken)
      
      if (response.code === 200) {
        localStorage.setItem('access_token', response.data.accessToken)
        return true
      }
      
      throw new Error('令牌刷新失败')
    } catch (error) {
      // 刷新失败，强制登出
      logout()
      return false
    }
  }, [logout])

  // 组件挂载时检查认证状态
  useEffect(() => {
    // 先尝试从localStorage恢复用户信息
    const storedUserInfo = localStorage.getItem('user_info')
    const token = localStorage.getItem('access_token')
    
    if (storedUserInfo && token) {
      try {
        const user = JSON.parse(storedUserInfo)
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
      } catch (error) {
        // 存储的用户信息无效，需要重新认证
        checkAuth()
      }
    } else {
      checkAuth()
    }
  }, [checkAuth])

  return {
    ...authState,
    login,
    logout,
    checkAuth,
    refreshToken
  }
}
