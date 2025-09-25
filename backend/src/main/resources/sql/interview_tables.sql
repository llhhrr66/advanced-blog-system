-- 面试题管理相关表结构

-- 创建面试题分类表
CREATE TABLE IF NOT EXISTS interview_category (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    name VARCHAR(100) NOT NULL COMMENT '分类名称',
    description TEXT COMMENT '分类描述',
    status INT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    sort_order INT DEFAULT 0 COMMENT '排序',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除',
    PRIMARY KEY (id),
    UNIQUE KEY uk_name (name),
    KEY idx_status (status),
    KEY idx_sort_order (sort_order),
    KEY idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='面试题分类表';

-- 创建面试题表
CREATE TABLE IF NOT EXISTS interview_question (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '题目ID',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    title VARCHAR(255) NOT NULL COMMENT '题目标题',
    content LONGTEXT NOT NULL COMMENT '题目内容（Markdown格式）',
    difficulty INT NOT NULL COMMENT '难度等级：1-简单，2-中等，3-困难',
    status INT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    source VARCHAR(100) COMMENT '来源',
    source_url VARCHAR(500) COMMENT '来源URL',
    sort_order INT DEFAULT 0 COMMENT '排序',
    view_count INT DEFAULT 0 COMMENT '查看次数',
    favorite_count INT DEFAULT 0 COMMENT '收藏次数',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除',
    PRIMARY KEY (id),
    KEY idx_category_id (category_id),
    KEY idx_difficulty (difficulty),
    KEY idx_status (status),
    KEY idx_sort_order (sort_order),
    KEY idx_view_count (view_count),
    KEY idx_create_time (create_time),
    FOREIGN KEY (category_id) REFERENCES interview_category(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='面试题表';

-- 插入默认分类数据
INSERT IGNORE INTO interview_category (name, description, sort_order) VALUES
('Java基础', 'Java语言基础知识，包括语法、面向对象、集合、异常等', 1),
('Spring Framework', 'Spring框架相关，包括IoC、AOP、MVC等', 2),
('Spring Boot', 'Spring Boot框架及其生态', 3),
('数据库', 'MySQL、Redis等数据库相关问题', 4),
('分布式', '微服务、分布式系统、消息队列等', 5),
('算法与数据结构', '常见算法题和数据结构问题', 6),
('网络编程', 'HTTP、TCP/IP、网络协议等', 7),
('操作系统', 'Linux、进程线程、内存管理等', 8),
('前端技术', 'JavaScript、Vue、React等前端技术', 9),
('其他', '其他技术相关面试题', 10);

-- 插入示例面试题数据
INSERT IGNORE INTO interview_question (category_id, title, content, difficulty, source) VALUES
(1, 'Java中的面向对象特性有哪些？', 
'## 问题描述
Java中的面向对象特性有哪些？请详细解释每个特性。

## 参考答案
Java中的面向对象特性主要有四个：

### 1. 封装（Encapsulation）
- 将数据和操作数据的方法绑定在一起
- 通过访问修饰符控制访问权限
- 隐藏内部实现细节

### 2. 继承（Inheritance）
- 子类可以继承父类的属性和方法
- 提高代码复用性
- 使用extends关键字实现

### 3. 多态（Polymorphism）
- 同一个方法在不同对象上有不同的实现
- 运行时动态绑定
- 方法重载和方法重写

### 4. 抽象（Abstraction）
- 抽象类和接口
- 隐藏复杂的实现，只暴露必要的接口', 
1, '经典面试题'),

(2, 'Spring IoC容器的工作原理', 
'## 问题描述
请解释Spring IoC容器的工作原理，以及依赖注入的几种方式。

## 参考答案
### IoC容器工作原理
1. **配置读取**：读取Bean配置信息（XML、注解、Java配置类）
2. **Bean定义解析**：将配置转换为BeanDefinition对象
3. **Bean实例化**：根据BeanDefinition创建Bean实例
4. **依赖注入**：注入Bean的依赖关系
5. **Bean初始化**：执行初始化方法
6. **Bean使用**：提供给应用程序使用

### 依赖注入方式
1. **构造器注入**：通过构造函数注入依赖
2. **Setter注入**：通过setter方法注入依赖  
3. **字段注入**：直接在字段上使用@Autowired注解', 
2, '经典面试题'),

(4, 'MySQL索引优化策略', 
'## 问题描述
MySQL索引优化有哪些策略？请详细说明。

## 参考答案
### 索引优化策略
1. **选择合适的索引类型**
   - B+Tree索引（默认）
   - Hash索引
   - 全文索引

2. **索引设计原则**
   - 选择性高的字段建索引
   - 避免过多索引
   - 复合索引遵循最左前缀原则

3. **查询优化**
   - 避免SELECT *
   - 使用EXPLAIN分析执行计划
   - 避免在WHERE子句中使用函数

4. **索引维护**
   - 定期分析表统计信息
   - 删除不使用的索引
   - 监控索引使用情况', 
2, '数据库优化');
