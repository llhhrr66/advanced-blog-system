import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import RootLayoutContent from '@/components/layout/RootLayoutContent'
import '@/styles/globals.css'
import 'highlight.js/styles/github-dark.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TechBlog - 技术博客与Java面试题库',
  description: '分享技术知识，记录成长历程，助力面试准备。包含1275+道Java面试题',
  keywords: 'blog,技术博客,Java,面试,Spring Boot,React,Next.js,面试题,面试鸭',
  authors: [{ name: 'TechBlog Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <RootLayoutContent>
          {children}
        </RootLayoutContent>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
