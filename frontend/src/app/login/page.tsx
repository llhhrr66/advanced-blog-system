'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, Typography, Space, Checkbox, Divider } from 'antd'
import { 
  UserOutlined, 
  LockOutlined,
  GithubOutlined,
  GoogleOutlined,
  WechatOutlined,
  SafetyOutlined,
  LoginOutlined,
  RocketOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { authAPI, testAPI } from '@/lib/api'
import { setCookie, removeCookie } from '@/lib/cookies'
import toast from 'react-hot-toast'
import styles from './login.module.css'

const { Title, Text, Link } = Typography

interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

export default function LoginPage() {
  const [form] = Form.useForm()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    // 加载记住的用户名
    const savedUsername = localStorage.getItem('remembered_username')
    if (savedUsername) {
      form.setFieldsValue({ username: savedUsername, remember: true })
    }

    // 鼠标跟随效果
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const onFinish = async (values: LoginForm) => {
    try {
      setLoading(true)
      
      // 记住用户名
      if (values.remember) {
        localStorage.setItem('remembered_username', values.username)
      } else {
        localStorage.removeItem('remembered_username')
      }

      // 先测试API连接
      try {
        await testAPI.ping()
      } catch (pingError) {
        toast.error('无法连接到服务器，请检查后端服务是否启动')
        return
      }

      // 执行登录
      const response = await authAPI.login(values)
      
      // response已经是response.data了（由于响应拦截器处理）
      // 后端返回格式：{ code: 200, message: '登录成功', data: { accessToken, refreshToken, ... }}
      if (response.code === 200 && response.data?.accessToken) {
        const { accessToken, refreshToken, user } = response.data
        
        // 存储token到cookies（服务器端可访问）
        setCookie('access_token', accessToken, {
          path: '/',
          maxAge: 86400, // 24小时
          sameSite: 'strict'
        })
        
        if (refreshToken) {
          setCookie('refresh_token', refreshToken, {
            path: '/',
            maxAge: 604800, // 7天
            sameSite: 'strict'
          })
        }
        
        // 同时存储到localStorage（客户端使用）
        localStorage.setItem('access_token', accessToken)
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken)
        }
        
        // 存储用户信息
        if (user) {
          localStorage.setItem('user_info', JSON.stringify(user))
        }

        toast.success('登录成功，欢迎回来！')
        
        // 获取跳转目标页面
        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/'
        
        // 延迟跳转以显示成功提示
        setTimeout(() => {
          router.push(redirectTo)
          // 强制刷新以确保状态更新
          window.location.href = redirectTo
        }, 1000)
      } else {
        throw new Error(response.message || '登录失败：未收到有效token')
      }
    } catch (err: any) {
      console.error('登录错误:', err)
      const errorMessage = err.response?.data?.message || err.message || '登录失败'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      {/* 动态背景 */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        <div className={styles.gradientOrb3}></div>
      </div>

      {/* 鼠标跟随光效 */}
      <div 
        className={styles.mouseGlow}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      {/* 登录卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={styles.loginCard}
      >
        {/* Logo和标题 */}
        <motion.div 
          className={styles.loginHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={styles.logoContainer}>
            <RocketOutlined className={styles.logo} />
          </div>
          <Title level={2} className={styles.title}>欢迎回来</Title>
          <Text className={styles.subtitle}>登录到您的博客系统账户</Text>
        </motion.div>

        {/* 登录表单 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' }
              ]}
            >
              <Input 
                prefix={<UserOutlined className={styles.inputIcon} />} 
                placeholder="用户名 / 邮箱"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className={styles.inputIcon} />}
                placeholder="密码"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item>
              <div className={styles.formOptions}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className={styles.checkbox}>记住我</Checkbox>
                </Form.Item>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  忘记密码？
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<LoginOutlined />}
                className={styles.submitButton}
                block
              >
                {loading ? '登录中...' : '立即登录'}
              </Button>
            </Form.Item>
          </Form>

          {/* 分隔线 */}
          <Divider className={styles.divider}>或使用其他方式登录</Divider>

          {/* 社交登录 */}
          <Space className={styles.socialLogin} size="middle">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                shape="circle" 
                icon={<GithubOutlined />} 
                className={styles.socialButton}
                size="large"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                shape="circle" 
                icon={<GoogleOutlined />} 
                className={styles.socialButton}
                size="large"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                shape="circle" 
                icon={<WechatOutlined />} 
                className={styles.socialButton}
                size="large"
              />
            </motion.div>
          </Space>

          {/* 注册链接 */}
          <div className={styles.registerLink}>
            <Text>还没有账户？</Text>
            <Link href="/register" className={styles.registerButton}>立即注册</Link>
          </div>

          {/* 测试账户提示 */}
          <motion.div 
            className={styles.testAccount}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <SafetyOutlined className={styles.testIcon} />
            <div>
              <Text className={styles.testTitle}>测试账户</Text>
              <div className={styles.testCredentials}>
                <Text className={styles.credential}>admin / admin123</Text>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 装饰元素 */}
      <div className={styles.decorativeElements}>
        <motion.div 
          className={styles.floatingShape1}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className={styles.floatingShape2}
          animate={{
            y: [0, 20, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  )
}
