---
title: Spring框架核心面试题
date: 2025-09-21 14:30:00
updated: 2025-09-25 16:00:00
tags: [Spring, IoC, AOP, 面试题]
categories: Spring面试
---

# Spring框架核心面试题

## 1. ✅ 什么是Spring IoC容器？

IoC（Inversion of Control）控制反转是Spring的核心：

### 核心概念
- **控制反转**：将对象创建和依赖管理交给容器
- **依赖注入**：容器负责注入对象依赖

### 实现方式
```java
// 构造器注入
@Component
public class UserService {
    private final UserRepository repository;
    
    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}

// Setter注入
@Component
public class OrderService {
    private PaymentService paymentService;
    
    @Autowired
    public void setPaymentService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}

// 字段注入（不推荐）
@Component
public class ProductService {
    @Autowired
    private ProductRepository repository;
}
```

## 2. ✅ Spring AOP是什么？

AOP（Aspect-Oriented Programming）面向切面编程：

### 核心概念
- **切面（Aspect）**：横切关注点的模块化
- **连接点（Join Point）**：程序执行点
- **切点（Pointcut）**：匹配连接点的表达式
- **通知（Advice）**：在切点执行的动作

### 通知类型
```java
@Aspect
@Component
public class LoggingAspect {
    
    @Before("@annotation(Loggable)")
    public void logBefore(JoinPoint joinPoint) {
        // 方法执行前
    }
    
    @After("@annotation(Loggable)")
    public void logAfter(JoinPoint joinPoint) {
        // 方法执行后
    }
    
    @Around("@annotation(Timed)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object proceed = joinPoint.proceed();
        long executionTime = System.currentTimeMillis() - start;
        System.out.println(executionTime + "ms");
        return proceed;
    }
}
```

## 3. ❌ Spring Bean的生命周期？

Bean生命周期主要阶段：

1. **实例化**：创建Bean实例
2. **属性赋值**：注入依赖
3. **初始化**：
   - BeanNameAware.setBeanName()
   - BeanFactoryAware.setBeanFactory()
   - ApplicationContextAware.setApplicationContext()
   - @PostConstruct方法
   - InitializingBean.afterPropertiesSet()
   - 自定义init-method
4. **使用**：Bean可以被使用
5. **销毁**：
   - @PreDestroy方法
   - DisposableBean.destroy()
   - 自定义destroy-method

## 4. Spring事务管理

### 事务传播行为
- **REQUIRED**：默认，存在事务则加入，否则创建新事务
- **REQUIRES_NEW**：总是创建新事务
- **SUPPORTS**：存在事务则加入，否则非事务执行
- **NOT_SUPPORTED**：总是非事务执行
- **MANDATORY**：必须在事务中执行
- **NEVER**：必须非事务执行
- **NESTED**：嵌套事务

### 声明式事务
```java
@Service
@Transactional
public class TransferService {
    
    @Transactional(propagation = Propagation.REQUIRED, 
                   isolation = Isolation.READ_COMMITTED,
                   timeout = 30,
                   rollbackFor = Exception.class)
    public void transfer(Account from, Account to, BigDecimal amount) {
        // 转账逻辑
    }
}
```

#Spring #面试题 #框架
