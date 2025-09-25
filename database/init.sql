-- 创建数据库
CREATE DATABASE IF NOT EXISTS blog_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE blog_system;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像URL',
    bio TEXT COMMENT '个人简介',
    role VARCHAR(20) DEFAULT 'USER' COMMENT '角色: ADMIN/USER',
    status INT DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
    last_login_time DATETIME COMMENT '最后登录时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0 COMMENT '逻辑删除标记',
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 文章分类表
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    description TEXT COMMENT '分类描述',
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID',
    sort_order INT DEFAULT 0 COMMENT '排序',
    icon VARCHAR(50) COMMENT '图标',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章分类表';

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL COMMENT '标签名称',
    color VARCHAR(20) COMMENT '标签颜色',
    description TEXT COMMENT '标签描述',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

-- 文章表
CREATE TABLE IF NOT EXISTS articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '文章标题',
    content LONGTEXT COMMENT '文章内容(Markdown)',
    summary TEXT COMMENT '文章摘要',
    cover_image VARCHAR(255) COMMENT '封面图片URL',
    author_id BIGINT NOT NULL COMMENT '作者ID',
    category_id BIGINT COMMENT '分类ID',
    status INT DEFAULT 0 COMMENT '状态: 0-草稿 1-已发布 2-已下架',
    is_top INT DEFAULT 0 COMMENT '是否置顶',
    is_recommend INT DEFAULT 0 COMMENT '是否推荐',
    view_count BIGINT DEFAULT 0 COMMENT '浏览量',
    like_count BIGINT DEFAULT 0 COMMENT '点赞数',
    comment_count BIGINT DEFAULT 0 COMMENT '评论数',
    collect_count BIGINT DEFAULT 0 COMMENT '收藏数',
    article_type INT DEFAULT 1 COMMENT '文章类型: 1-原创 2-转载 3-翻译',
    original_url VARCHAR(500) COMMENT '原文链接',
    keywords VARCHAR(255) COMMENT 'SEO关键词',
    description TEXT COMMENT 'SEO描述',
    publish_time DATETIME COMMENT '发布时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_author_id (author_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_publish_time (publish_time),
    FULLTEXT idx_fulltext (title, content, summary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS article_tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_article_tag (article_id, tag_id),
    INDEX idx_article_id (article_id),
    INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章标签关联表';

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT NOT NULL COMMENT '文章ID',
    user_id BIGINT NOT NULL COMMENT '评论用户ID',
    parent_id BIGINT DEFAULT 0 COMMENT '父评论ID',
    content TEXT NOT NULL COMMENT '评论内容',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    status INT DEFAULT 1 COMMENT '状态: 0-待审核 1-已发布 2-已隐藏',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_article_id (article_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 面试题分类表
CREATE TABLE IF NOT EXISTS interview_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    description TEXT COMMENT '分类描述',
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID',
    sort_order INT DEFAULT 0 COMMENT '排序',
    icon VARCHAR(50) COMMENT '图标',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='面试题分类表';

-- 面试题表
CREATE TABLE IF NOT EXISTS interview_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '题目标题',
    content TEXT COMMENT '题目内容',
    question_type INT DEFAULT 1 COMMENT '题型: 1-选择 2-简答 3-编程 4-设计',
    answer TEXT COMMENT '参考答案',
    analysis TEXT COMMENT '答案解析',
    code_example TEXT COMMENT '代码示例',
    difficulty INT DEFAULT 2 COMMENT '难度: 1-简单 2-中等 3-困难',
    category_id BIGINT COMMENT '分类ID',
    frequency INT DEFAULT 0 COMMENT '出现频率(1-100)',
    importance INT DEFAULT 50 COMMENT '重要程度(1-100)',
    companies JSON COMMENT '出题公司列表',
    knowledge_points JSON COMMENT '知识点列表',
    view_count BIGINT DEFAULT 0 COMMENT '浏览次数',
    collect_count BIGINT DEFAULT 0 COMMENT '收藏次数',
    attempt_count BIGINT DEFAULT 0 COMMENT '答题次数',
    correct_rate DECIMAL(5,2) DEFAULT 0 COMMENT '正确率',
    average_time INT DEFAULT 0 COMMENT '平均用时(秒)',
    status INT DEFAULT 1 COMMENT '状态: 0-待审核 1-已发布 2-已下架',
    creator_id BIGINT COMMENT '创建人ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_category_id (category_id),
    INDEX idx_difficulty (difficulty),
    INDEX idx_frequency (frequency),
    FULLTEXT idx_fulltext (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='面试题表';

-- 面试题标签关联表
CREATE TABLE IF NOT EXISTS interview_question_tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_question_tag (question_id, tag_id),
    INDEX idx_question_id (question_id),
    INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='面试题标签关联表';

-- 用户答题记录表
CREATE TABLE IF NOT EXISTS user_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    question_id BIGINT NOT NULL COMMENT '题目ID',
    user_answer TEXT COMMENT '用户答案',
    is_correct INT DEFAULT 0 COMMENT '是否正确',
    score DECIMAL(5,2) DEFAULT 0 COMMENT '得分',
    time_spent INT DEFAULT 0 COMMENT '用时(秒)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_question_id (question_id),
    INDEX idx_user_question (user_id, question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户答题记录表';

-- 文章点赞记录表
CREATE TABLE IF NOT EXISTS article_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_article_user (article_id, user_id),
    INDEX idx_article_id (article_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章点赞记录表';

-- 文章收藏记录表
CREATE TABLE IF NOT EXISTS article_collections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_article_user (article_id, user_id),
    INDEX idx_article_id (article_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章收藏记录表';

-- 插入初始数据
-- 插入管理员用户
INSERT INTO users (username, password, email, nickname, role, status) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'admin@blog.com', '系统管理员', 'ADMIN', 1);

-- 插入文章分类
INSERT INTO categories (name, description, sort_order) VALUES
('后端开发', 'Java, Spring Boot, 微服务等后端技术', 1),
('前端开发', 'React, Vue, Next.js等前端技术', 2),
('架构设计', '系统架构、设计模式、高并发等', 3),
('数据库', 'MySQL, Redis, MongoDB等数据库技术', 4),
('DevOps', 'Docker, K8s, CI/CD等运维技术', 5),
('算法与数据结构', '常见算法和数据结构', 6);

-- 插入标签
INSERT INTO tags (name, color) VALUES
('Java', '#f50'),
('Spring Boot', '#2db7f5'),
('React', '#87d068'),
('Next.js', '#108ee9'),
('MySQL', '#ff6b6b'),
('Redis', '#dc3545'),
('Docker', '#0088cc'),
('微服务', '#722ed1'),
('设计模式', '#fa8c16'),
('高并发', '#eb2f96');

-- 插入面试题分类
INSERT INTO interview_categories (name, description, sort_order) VALUES
('Java基础', 'Java语言基础知识', 1),
('Java集合', 'Collection、Map等集合框架', 2),
('JVM', 'Java虚拟机原理', 3),
('并发编程', '多线程、并发包等', 4),
('Spring框架', 'Spring、Spring Boot、Spring Cloud', 5),
('数据库', 'SQL、MySQL优化等', 6),
('Redis', 'Redis缓存相关', 7),
('设计模式', '常见设计模式', 8),
('分布式', '分布式系统设计', 9),
('网络协议', 'TCP/IP、HTTP等', 10);

-- 插入示例面试题
INSERT INTO interview_questions (title, content, question_type, difficulty, category_id, frequency, companies, knowledge_points) VALUES
('HashMap底层实现原理', '请详细说明HashMap的底层数据结构，以及JDK1.7和JDK1.8的区别', 2, 2, 2, 95, 
 '["阿里巴巴", "字节跳动", "美团", "腾讯"]', '["HashMap", "红黑树", "hash碰撞", "扩容机制"]'),
 
('volatile关键字的作用', '解释volatile关键字的作用和使用场景', 2, 2, 4, 88,
 '["百度", "京东", "滴滴"]', '["volatile", "内存可见性", "指令重排序"]'),
 
('Spring AOP实现原理', '说明Spring AOP的实现原理，JDK动态代理和CGLIB的区别', 2, 3, 5, 85,
 '["腾讯", "网易", "快手"]', '["AOP", "动态代理", "CGLIB", "切面编程"]'),
 
('MySQL索引优化', '如何进行MySQL索引优化，什么情况下索引会失效', 2, 2, 6, 92,
 '["美团", "滴滴", "58同城"]', '["索引", "B+树", "查询优化", "执行计划"]'),
 
('Redis缓存穿透、击穿、雪崩', '解释缓存穿透、缓存击穿、缓存雪崩的区别和解决方案', 2, 2, 7, 90,
 '["字节跳动", "快手", "拼多多"]', '["Redis", "缓存", "布隆过滤器", "限流"]');

-- 插入测试用户
INSERT INTO users (username, password, email, nickname, avatar, bio, role) VALUES
('testuser', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'test@blog.com', '测试用户', 'https://api.dicebear.com/7.x/avataaars/svg?seed=test', '热爱技术，喜欢分享', 'USER'),
('author1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'author1@blog.com', '技术小哥', 'https://api.dicebear.com/7.x/avataaars/svg?seed=author1', 'Java后端开发工程师', 'USER'),
('author2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'author2@blog.com', '前端达人', 'https://api.dicebear.com/7.x/avataaars/svg?seed=author2', 'React/Vue开发者', 'USER');

-- 插入测试文章
INSERT INTO articles (title, content, summary, cover_image, author_id, category_id, status, is_recommend, view_count, like_count, comment_count, publish_time) VALUES
('深入理解Spring Boot 3.0新特性', 
'# Spring Boot 3.0 新特性详解\n\n## 1. Native Image支持\n\nSpring Boot 3.0带来了对GraalVM Native Image的原生支持...\n\n## 2. 优化的自动配置\n\n新版本对自动配置进行了大量优化...\n\n## 3. Jakarta EE 9支持\n\n从Java EE迁移到Jakarta EE...', 
'Spring Boot 3.0带来了革命性的更新，包括Native Image支持、优化的自动配置机制、Jakarta EE 9支持等重要特性。本文将深入解析这些新特性的使用方法和最佳实践。',
'https://images.unsplash.com/photo-1517180102446-f3c586d3b9e4?w=800&h=400&fit=crop',
1, 1, 1, 1, 5234, 128, 32, NOW()),

('构建高并发系统的核心技术', 
'# 高并发系统设计实战\n\n## 1. 缓存设计\n\n### 1.1 多级缓存架构\n本地缓存 + Redis缓存 + CDN...\n\n## 2. 数据库优化\n\n### 2.1 读写分离\n主从复制架构...\n\n## 3. 消息队列\n\n使用RabbitMQ/Kafka进行异步处理...',
'从零开始构建支持百万级并发的系统架构，涵盖缓存设计、消息队列、数据库优化、限流熔断等核心技术要点。',
'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
1, 3, 1, 1, 8932, 256, 67, NOW()),

('React 18与Next.js 14最佳实践', 
'# React 18 新特性\n\n## 1. Concurrent Features\n\n### Suspense和并发渲染...\n\n## 2. Next.js 14 App Router\n\n新的路由系统带来了更好的性能...',
'探索React 18的并发特性与Next.js 14的App Router，学习如何构建高性能的现代化前端应用。',
'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
2, 2, 1, 1, 3421, 89, 23, NOW()),

('MySQL性能优化实战指南',
'# MySQL优化技巧\n\n## 1. 索引优化\n\n正确使用索引是提升性能的关键...\n\n## 2. SQL优化\n\n避免全表扫描，合理使用JOIN...',
'深入MySQL性能优化，包含索引设计、SQL优化、分库分表、读写分离等实战技巧。',
'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
1, 4, 1, 0, 4532, 167, 45, NOW()),

('Docker容器化部署实践',
'# Docker实战\n\n## 1. Dockerfile编写\n\n构建高效的镜像...\n\n## 2. Docker Compose\n\n多容器编排...',
'从Docker基础到Kubernetes部署，全面掌握容器化技术栈。',
'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop',
3, 5, 1, 0, 2876, 98, 28, NOW()),

('Redis缓存设计与优化',
'# Redis实战\n\n## 1. 数据结构选择\n\nString, Hash, List, Set, ZSet的使用场景...\n\n## 2. 缓存策略\n\n缓存穿透、击穿、雪崩的解决方案...',
'Redis缓存设计最佳实践，包含数据结构选择、缓存策略、集群方案等核心内容。',
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
2, 4, 1, 1, 6234, 198, 56, NOW());

-- 插入文章标签关联
INSERT INTO article_tags (article_id, tag_id) VALUES
(1, 2), (1, 1), -- Spring Boot文章关联Spring Boot和Java标签
(2, 8), (2, 10), (2, 6), -- 高并发文章
(3, 3), (3, 4), -- React/Next.js文章
(4, 5), (4, 1), -- MySQL文章
(5, 7), -- Docker文章
(6, 6), (6, 10); -- Redis文章

-- 插入测试评论
INSERT INTO comments (article_id, user_id, content, like_count) VALUES
(1, 2, '文章写得很详细，Spring Boot 3.0的新特性确实很强大！', 12),
(1, 3, '感谢分享，Native Image对性能提升很明显', 8),
(2, 2, '高并发设计的思路很清晰，学习了', 15),
(2, 4, '能详细讲讲限流算法的实现吗？', 5),
(3, 1, 'Next.js的App Router确实比Pages Router好用很多', 7);

-- 插入文章点赞记录
INSERT INTO article_likes (article_id, user_id) VALUES
(1, 2), (1, 3), (1, 4),
(2, 1), (2, 3), (2, 4),
(3, 1), (3, 2);

-- 插入文章收藏记录
INSERT INTO article_collections (article_id, user_id) VALUES
(1, 2), (1, 3),
(2, 1), (2, 4),
(3, 2);

-- 更新文章统计数据
UPDATE articles SET 
  comment_count = (SELECT COUNT(*) FROM comments WHERE article_id = articles.id),
  like_count = (SELECT COUNT(*) FROM article_likes WHERE article_id = articles.id),
  collect_count = (SELECT COUNT(*) FROM article_collections WHERE article_id = articles.id);

-- 创建视图：热门文章
CREATE VIEW v_hot_articles AS
SELECT 
    a.*,
    u.nickname as author_name,
    c.name as category_name
FROM articles a
LEFT JOIN users u ON a.author_id = u.id
LEFT JOIN categories c ON a.category_id = c.id
WHERE a.deleted = 0 AND a.status = 1
ORDER BY (a.view_count * 1 + a.like_count * 3 + a.comment_count * 5) DESC
LIMIT 100;

-- 创建视图：热门面试题
CREATE VIEW v_hot_interview_questions AS
SELECT 
    q.*,
    c.name as category_name
FROM interview_questions q
LEFT JOIN interview_categories c ON q.category_id = c.id
WHERE q.deleted = 0 AND q.status = 1
ORDER BY q.frequency DESC, q.view_count DESC
LIMIT 100;
