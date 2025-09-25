// 面试题模块使用全局布局，不需要独立的layout
export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
