import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 需要认证的路径
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/editor',
  '/admin'
]

// 公开路径（不需要认证）
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/',
  '/articles'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 获取token
  const token = request.cookies.get('access_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  // 检查是否为受保护路径
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // 检查是否为认证相关路径
  const isAuthRoute = pathname.startsWith('/login') || 
                     pathname.startsWith('/register')
  
  // 如果是受保护路径且没有token，跳转到登录页
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // 如果已登录用户访问登录/注册页面，跳转到首页
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // 添加安全头
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
}

// 配置matcher
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径除了以下开头的:
     * - api (API 路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (favicon 文件)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
