'use client'

import { useEffect } from 'react'
import { ConfigProvider, Layout } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GlobalHeader from '@/components/layout/GlobalHeader'
import useInterviewStore from '@/stores/interviewStore'

const { Content } = Layout

// 创建QueryClient实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟缓存
      cacheTime: 10 * 60 * 1000, // 10分钟垃圾回收
      refetchOnWindowFocus: false, // 窗口聚焦时不重新获取
      retry: 1, // 失败重试1次
    },
  },
})

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { isDarkMode } = useInterviewStore()

  useEffect(() => {
    // 应用暗黑模式
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={zhCN}>
        <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <GlobalHeader />
          <Content className="mt-16">
            {children}
          </Content>
        </Layout>
      </ConfigProvider>
    </QueryClientProvider>
  )
}
