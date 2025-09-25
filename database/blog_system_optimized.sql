-- ================================================
-- 博客系统数据库结构设计 - 优化版
-- ================================================
-- 创建时间: 2024-09-24
-- 版本: v1.0.0
-- 说明: 专注于博客核心功能，去除不必要的面试题模块
-- ================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS blog_system 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci
COMMENT '博客系统数据库';

USE blog_system;

-- ================================================
-- 用户管理模块
-- ================================================

-- 用户基础信息表
CREATE TABLE IF NOT EXISTS users (
    -- 主键ID
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户唯一标识符，自增主键',
    
    -- 基础登录信息
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户登录名，全局唯一，3-50字符，支持字母数字下划线',
    password VARCHAR(255) NOT NULL COMMENT '用户密码，BCrypt加密存储，原始密码6-20字符',
    email VARCHAR(100) UNIQUE COMMENT '用户邮箱地址，全局唯一，用于找回密码和通知',
    phone VARCHAR(20) COMMENT '手机号码，可为空，格式：+86-138****8888',
    
    -- 用户展示信息
    nickname VARCHAR(50) COMMENT '用户昵称，用于前台显示，2-50字符，默认使用username',
    avatar VARCHAR(500) COMMENT '用户头像URL地址，支持相对路径和绝对URL，默认使用系统头像',
    bio TEXT COMMENT '用户个人简介，最大1000字符，支持简单的Markdown语法',
    
    -- 权限和状态
    role VARCHAR(20) DEFAULT 'USER' COMMENT '用户角色：ADMIN-管理员，USER-普通用户，AUTHOR-作者',
    status INT DEFAULT 1 COMMENT '账户状态：0-禁用（无法登录），1-正常，2-待激活',
    
    -- 统计信息
    article_count INT DEFAULT 0 COMMENT '发表文章总数，冗余字段用于快速查询',
    follower_count INT DEFAULT 0 COMMENT '粉丝数量，用于用户影响力统计',
    following_count INT DEFAULT 0 COMMENT '关注数量，用于社交功能',
    
    -- 时间戳
    last_login_time DATETIME COMMENT '最后登录时间，用于统计活跃度',
    last_login_ip VARCHAR(50) COMMENT '最后登录IP地址，用于安全监控',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '账户创建时间，不可修改',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间，自动维护',
    
    -- 逻辑删除标记
    deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记：0-未删除，1-已删除',
    
    -- 索引定义
    INDEX idx_username (username) COMMENT '用户名索引，用于登录查询',
    INDEX idx_email (email) COMMENT '邮箱索引，用于邮箱登录和找回密码',
    INDEX idx_status_role (status, role) COMMENT '状态角色复合索引，用于管理员查询',
    INDEX idx_create_time (create_time) COMMENT '创建时间索引，用于注册统计'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户基础信息表，存储用户账户、个人资料和权限信息';

-- ================================================
-- 内容分类模块
-- ================================================

-- 文章分类表
CREATE TABLE IF NOT EXISTS categories (
    -- 主键ID
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '分类唯一标识符，自增主键',
    
    -- 基础信息
    name VARCHAR(50) NOT NULL COMMENT '分类名称，唯一，2-50字符，如：后端开发、前端技术',
    slug VARCHAR(100) UNIQUE COMMENT '分类别名，用于URL友好显示，如：backend-dev',
    description TEXT COMMENT '分类描述，最大500字符，用于SEO和用户理解',
    
    -- 层级结构
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID，0表示顶级分类，支持最多3级嵌套',
    level TINYINT DEFAULT 1 COMMENT '分类层级：1-一级分类，2-二级分类，3-三级分类',
    path VARCHAR(200) COMMENT '分类路径，如：1/2/3，便于查询所有子分类',
    
    -- 显示设置
    icon VARCHAR(100) COMMENT '分类图标，支持FontAwesome图标名或图片URL',
    color VARCHAR(20) COMMENT '分类主题色，16进制颜色值，如：#1890ff',
    cover_image VARCHAR(500) COMMENT '分类封面图URL，用于分类页面展示',
    sort_order INT DEFAULT 0 COMMENT '排序权重，数值越大越靠前，默认按创建时间排序',
    
    -- 统计信息
    article_count INT DEFAULT 0 COMMENT '该分类下文章数量，冗余字段便于快速查询',
    
    -- 状态控制
    status TINYINT(1) DEFAULT 1 COMMENT '分类状态：0-禁用，1-启用',
    
    -- 时间戳
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '分类创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
    
    -- 逻辑删除标记
    deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记：0-未删除，1-已删除',
    
    -- 索引定义
    INDEX idx_parent_id (parent_id) COMMENT '父分类索引，用于查询子分类',
    INDEX idx_slug (slug) COMMENT '别名索引，用于URL路由',
    INDEX idx_sort_order (sort_order) COMMENT '排序索引',
    INDEX idx_status (status) COMMENT '状态索引，用于前台查询'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章分类表，支持多级分类和自定义显示样式';

-- ================================================
-- 标签系统模块
-- ================================================

-- 文章标签表
CREATE TABLE IF NOT EXISTS tags (
    -- 主键ID
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '标签唯一标识符，自增主键',
    
    -- 基础信息
    name VARCHAR(50) UNIQUE NOT NULL COMMENT '标签名称，全局唯一，1-50字符，如：Java、Redis',
    slug VARCHAR(100) UNIQUE COMMENT '标签别名，用于URL友好显示，如：java、redis',
    description TEXT COMMENT '标签描述，最大200字符，解释标签含义和用途',
    
    -- 显示设置
    color VARCHAR(20) COMMENT '标签颜色，16进制颜色值，如：#f50，用于前台标签展示',
    background_color VARCHAR(20) COMMENT '标签背景色，可选，用于特殊显示效果',
    
    -- 统计信息
    use_count INT DEFAULT 0 COMMENT '标签使用次数，每当文章关联此标签时+1',
    click_count INT DEFAULT 0 COMMENT '标签点击次数，用于热门标签统计',
    
    -- 状态控制
    status TINYINT(1) DEFAULT 1 COMMENT '标签状态：0-禁用，1-启用',
    
    -- 时间戳
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '标签创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
    
    -- 逻辑删除标记
    deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记：0-未删除，1-已删除',
    
    -- 索引定义
    INDEX idx_name (name) COMMENT '标签名称索引',
    INDEX idx_slug (slug) COMMENT '标签别名索引',
    INDEX idx_use_count (use_count DESC) COMMENT '使用次数索引，用于热门标签查询',
    INDEX idx_status (status) COMMENT '状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章标签表，用于文章内容标记和分类';

-- ================================================
-- 文章内容模块
-- ================================================

-- 文章主表
CREATE TABLE IF NOT EXISTS articles (
    -- 主键ID
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '文章唯一标识符，自增主键',
    
    -- 基础内容信息
    title VARCHAR(200) NOT NULL COMMENT '文章标题，5-200字符，必填，用于显示和SEO',
    slug VARCHAR(300) COMMENT '文章URL别名，英文数字连字符，如：spring-boot-guide',
    content LONGTEXT COMMENT '文章正文内容，Markdown格式，最大16MB',
    summary TEXT COMMENT '文章摘要，最大500字符，为空时自动从content提取前200字',
    
    -- 展示设置
    cover_image VARCHAR(500) COMMENT '文章封面图URL，支持相对路径和绝对URL',
    
    -- 关联信息
    author_id BIGINT NOT NULL COMMENT '作者ID，关联users表，文章归属用户',
    category_id BIGINT COMMENT '文章分类ID，关联categories表，可为空',
    
    -- 文章状态
    status TINYINT DEFAULT 0 COMMENT '发布状态：0-草稿，1-已发布，2-已下架，3-待审核',
    
    -- 特殊标记
    is_top TINYINT(1) DEFAULT 0 COMMENT '是否置顶：0-普通文章，1-置顶文章',
    is_featured TINYINT(1) DEFAULT 0 COMMENT '是否精选：0-普通文章，1-精选文章',
    allow_comment TINYINT(1) DEFAULT 1 COMMENT '是否允许评论：0-禁止评论，1-允许评论',
    
    -- 统计数据
    view_count BIGINT DEFAULT 0 COMMENT '浏览次数，每次访问文章详情页+1',
    like_count BIGINT DEFAULT 0 COMMENT '点赞数量，与article_likes表保持同步',
    comment_count BIGINT DEFAULT 0 COMMENT '评论数量，与comments表保持同步',
    collect_count BIGINT DEFAULT 0 COMMENT '收藏数量，与article_collections表保持同步',
    share_count BIGINT DEFAULT 0 COMMENT '分享次数，记录社交分享数据',
    
    -- 文章属性
    article_type TINYINT DEFAULT 1 COMMENT '文章类型：1-原创，2-转载，3-翻译',
    original_url VARCHAR(500) COMMENT '原文链接，转载或翻译文章的源地址',
    read_time INT COMMENT '预计阅读时间，单位分钟，根据字数自动计算',
    word_count INT COMMENT '文章字数，不包含Markdown语法字符',
    
    -- SEO优化
    keywords VARCHAR(500) COMMENT 'SEO关键词，逗号分隔，最多10个关键词',
    meta_description TEXT COMMENT 'SEO描述，最大160字符，用于搜索引擎展示',
    
    -- 时间管理
    publish_time DATETIME COMMENT '文章发布时间，可预设未来时间实现定时发布',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间，草稿创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后编辑时间',
    
    -- 逻辑删除标记
    deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记：0-未删除，1-已删除',
    
    -- 索引定义
    INDEX idx_author_id (author_id) COMMENT '作者索引，用于查询用户文章',
    INDEX idx_category_id (category_id) COMMENT '分类索引，用于分类页面',
    INDEX idx_status (status) COMMENT '状态索引，用于前台查询已发布文章',
    INDEX idx_publish_time (publish_time DESC) COMMENT '发布时间索引，用于文章列表排序',
    INDEX idx_is_top_featured (is_top DESC, is_featured DESC) COMMENT '置顶精选复合索引',
    INDEX idx_view_count (view_count DESC) COMMENT '浏览量索引，用于热门文章排序',
    INDEX idx_slug (slug) COMMENT 'URL别名索引，用于URL路由',
    -- 全文索引用于搜索功能
    FULLTEXT idx_fulltext_search (title, content, summary) COMMENT '全文搜索索引，支持中英文搜索'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章主表，存储博客文章的所有基础信息和内容';

-- ================================================
-- 关联关系模块
-- ================================================

-- 文章标签关联表（多对多关系）
CREATE TABLE IF NOT EXISTS article_tags (
    -- 主键ID
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '关联关系唯一标识符，自增主键',
    
    -- 关联字段
    article_id BIGINT NOT NULL COMMENT '文章ID，关联articles表主键',
    tag_id BIGINT NOT NULL COMMENT '标签ID，关联tags表主键',
    
    -- 时间戳
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '关联创建时间，用于统计标签使用趋势',
    
    -- 唯一约束
    UNIQUE KEY uk_article_tag (article_id, tag_id) COMMENT '文章标签唯一约束，防止重复关联',
    
    -- 外键索引
    INDEX idx_article_id (article_id) COMMENT '文章ID索引，用于查询文章的所有标签',
    INDEX idx_tag_id (tag_id) COMMENT '标签ID索引，用于查询标签下的所有文章',
    
    -- 外键约束
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章标签关联表，维护文章与标签的多对多关系';

-- ================================================
-- 评论互动模块
-- ================================================

-- 文章评论表
CREATE TABLE IF NOT EXISTS comments (
    -- 主键ID
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '评论唯一标识符，自增主键',
    
    -- 关联信息
    article_id BIGINT NOT NULL COMMENT '文章ID，关联articles表，评论所属文章',
    user_id BIGINT NOT NULL COMMENT '评论用户ID，关联users表，评论作者',
    parent_id BIGINT DEFAULT 0 COMMENT '父评论ID，0表示顶级评论，其他值表示回复评论',
    
    -- 评论内容
    content TEXT NOT NULL COMMENT '评论正文内容，1-500字符，支持简单文本和表情',
    
    -- 用户信息快照（冗余字段，防止用户信息变更影响历史评论显示）
    user_name VARCHAR(50) COMMENT '评论时的用户昵称快照',
    user_avatar VARCHAR(500) COMMENT '评论时的用户头像快照',
    user_email VARCHAR(100) COMMENT '评论时的用户邮箱快照（用于Gravatar）',
    
    -- 评论属性
    ip_address VARCHAR(50) COMMENT '评论者IP地址，用于反垃圾和安全控制',
    user_agent TEXT COMMENT '用户浏览器信息，用于技术统计',
    
    -- 互动统计
    like_count INT DEFAULT 0 COMMENT '评论点赞数，与comment_likes表同步',
    reply_count INT DEFAULT 0 COMMENT '回复数量，子评论统计',
    
    -- 状态管理
    status TINYINT DEFAULT 1 COMMENT '评论状态：0-待审核，1-已发布，2-已隐藏，3-垃圾评论',
    
    -- 时间戳
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '评论发表时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '评论最后修改时间',
    
    -- 逻辑删除标记
    deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记：0-未删除，1-已删除',
    
    -- 索引定义
    INDEX idx_article_id (article_id) COMMENT '文章ID索引，用于查询文章的所有评论',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引，用于查询用户的所有评论',
    INDEX idx_parent_id (parent_id) COMMENT '父评论索引，用于查询回复评论',
    INDEX idx_status_time (status, create_time DESC) COMMENT '状态时间复合索引，用于前台评论展示',
    
    -- 外键约束
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章评论表，支持多级评论回复和状态管理';

-- ================================================
-- 用户行为记录模块
-- ================================================

-- 文章点赞记录表
CREATE TABLE IF NOT EXISTS article_likes (
    -- 主键ID
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '点赞记录唯一标识符，自增主键',
    
    -- 关联信息
    article_id BIGINT NOT NULL COMMENT '文章ID，关联articles表',
    user_id BIGINT NOT NULL COMMENT '点赞用户ID，关联users表',
    
    -- 行为信息
    ip_address VARCHAR(50) COMMENT '点赞时的IP地址，用于防刷控制',
    
    -- 时间戳
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间，用于统计和排序',
    
    -- 唯一约束
    UNIQUE KEY uk_article_user_like (article_id, user_id) COMMENT '文章用户点赞唯一约束，防止重复点赞',
    
    -- 索引定义
    INDEX idx_article_id (article_id) COMMENT '文章ID索引，用于统计文章点赞数',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引，用于查询用户点赞记录',
    INDEX idx_create_time (create_time DESC) COMMENT '时间索引，用于点赞趋势统计',
    
    -- 外键约束
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章点赞记录表，记录用户对文章的点赞行为';

-- 文章收藏记录表
CREATE TABLE IF NOT EXISTS article_collections (
    -- 主键ID
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '收藏记录唯一标识符，自增主键',
    
    -- 关联信息
    article_id BIGINT NOT NULL COMMENT '文章ID，关联articles表',
    user_id BIGINT NOT NULL COMMENT '收藏用户ID，关联users表',
    
    -- 收藏信息
    folder_name VARCHAR(100) DEFAULT 'default' COMMENT '收藏夹名称，支持用户自定义分类收藏',
    notes TEXT COMMENT '收藏备注，用户可添加个人笔记',
    
    -- 时间戳
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
    
    -- 唯一约束
    UNIQUE KEY uk_article_user_collect (article_id, user_id) COMMENT '文章用户收藏唯一约束，防止重复收藏',
    
    -- 索引定义
    INDEX idx_article_id (article_id) COMMENT '文章ID索引，用于统计文章收藏数',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引，用于查询用户收藏记录',
    INDEX idx_folder_name (folder_name) COMMENT '收藏夹名称索引',
    INDEX idx_create_time (create_time DESC) COMMENT '时间索引，用于收藏列表排序',
    
    -- 外键约束
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章收藏记录表，记录用户对文章的收藏行为和个人笔记';

-- 评论点赞记录表
CREATE TABLE IF NOT EXISTS comment_likes (
    -- 主键ID
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '评论点赞记录唯一标识符，自增主键',
    
    -- 关联信息
    comment_id BIGINT NOT NULL COMMENT '评论ID，关联comments表',
    user_id BIGINT NOT NULL COMMENT '点赞用户ID，关联users表',
    
    -- 时间戳
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
    
    -- 唯一约束
    UNIQUE KEY uk_comment_user_like (comment_id, user_id) COMMENT '评论用户点赞唯一约束，防止重复点赞',
    
    -- 索引定义
    INDEX idx_comment_id (comment_id) COMMENT '评论ID索引，用于统计评论点赞数',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引，用于查询用户点赞记录',
    
    -- 外键约束
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论点赞记录表，记录用户对评论的点赞行为';

-- ================================================
-- 系统配置模块
-- ================================================

-- 系统配置表
CREATE TABLE IF NOT EXISTS system_configs (
    -- 主键ID
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '配置项唯一标识符，自增主键',
    
    -- 配置信息
    config_key VARCHAR(100) UNIQUE NOT NULL COMMENT '配置键名，全局唯一，如：site_title、smtp_host',
    config_value TEXT COMMENT '配置值，支持字符串、JSON格式的复杂配置',
    config_type VARCHAR(20) DEFAULT 'string' COMMENT '配置类型：string-字符串，number-数字，boolean-布尔，json-JSON对象',
    
    -- 配置描述
    config_group VARCHAR(50) COMMENT '配置分组，如：基础设置、邮件配置、SEO设置',
    description VARCHAR(500) COMMENT '配置项描述，说明配置的作用和格式要求',
    
    -- 状态控制
    is_public TINYINT(1) DEFAULT 0 COMMENT '是否公开配置：0-仅管理员可见，1-前台可访问',
    status TINYINT(1) DEFAULT 1 COMMENT '配置状态：0-禁用，1-启用',
    
    -- 时间戳
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '配置创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '配置最后修改时间',
    
    -- 索引定义
    INDEX idx_config_key (config_key) COMMENT '配置键索引',
    INDEX idx_config_group (config_group) COMMENT '配置分组索引',
    INDEX idx_is_public (is_public) COMMENT '公开状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表，存储博客系统的各种配置参数';

-- ================================================
-- 初始化数据
-- ================================================

-- 插入系统管理员用户
INSERT INTO users (username, password, email, nickname, role, status) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'admin@blog.com', '系统管理员', 'ADMIN', 1);

-- 插入测试用户
INSERT INTO users (username, password, email, nickname, avatar, bio, role, status) VALUES
('testuser', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'test@blog.com', '测试用户', 'https://api.dicebear.com/7.x/avataaars/svg?seed=test', '热爱技术，喜欢分享', 'USER', 1),
('author1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'author1@blog.com', '技术小哥', 'https://api.dicebear.com/7.x/avataaars/svg?seed=author1', 'Java后端开发工程师', 'USER', 1),
('author2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'author2@blog.com', '前端达人', 'https://api.dicebear.com/7.x/avataaars/svg?seed=author2', 'React/Vue开发者', 'USER', 1);

-- 插入文章分类
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('后端开发', 'backend', 'Java, Spring Boot, 微服务等后端技术分享', 'server', '#1890ff', 1),
('前端开发', 'frontend', 'React, Vue, Next.js等前端技术分享', 'code', '#52c41a', 2),
('架构设计', 'architecture', '系统架构、设计模式、高并发解决方案', 'cluster', '#722ed1', 3),
('数据库', 'database', 'MySQL, Redis, MongoDB等数据库技术', 'database', '#fa541c', 4),
('DevOps', 'devops', 'Docker, K8s, CI/CD等运维自动化技术', 'cloud', '#13c2c2', 5),
('算法与数据结构', 'algorithm', '常见算法和数据结构解析', 'function', '#eb2f96', 6);

-- 插入文章标签
INSERT INTO tags (name, slug, color, description) VALUES
('Java', 'java', '#f50', 'Java编程语言相关技术'),
('Spring Boot', 'spring-boot', '#2db7f5', 'Spring Boot框架技术'),
('React', 'react', '#87d068', 'React前端框架技术'),
('Next.js', 'nextjs', '#108ee9', 'Next.js全栈框架'),
('MySQL', 'mysql', '#ff6b6b', 'MySQL数据库技术'),
('Redis', 'redis', '#dc3545', 'Redis缓存数据库'),
('Docker', 'docker', '#0088cc', 'Docker容器化技术'),
('微服务', 'microservice', '#722ed1', '微服务架构设计'),
('设计模式', 'design-pattern', '#fa8c16', '软件设计模式'),
('高并发', 'high-concurrency', '#eb2f96', '高并发系统设计');

-- 插入示例文章
INSERT INTO articles (title, slug, content, summary, cover_image, author_id, category_id, status, is_featured, view_count, like_count, comment_count, article_type, keywords, meta_description, publish_time) VALUES
('深入理解Spring Boot 3.0新特性', 
 'spring-boot-3-new-features',
 '# Spring Boot 3.0 新特性详解\n\n## 1. Native Image支持\n\nSpring Boot 3.0带来了对GraalVM Native Image的原生支持，可以将应用编译为原生可执行文件，显著减少内存占用和启动时间。\n\n### 1.1 配置Native Image\n\n在pom.xml中添加相关插件配置：\n\n```xml\n<plugin>\n    <groupId>org.graalvm.buildtools</groupId>\n    <artifactId>native-maven-plugin</artifactId>\n</plugin>\n```\n\n## 2. 优化的自动配置\n\n新版本对自动配置进行了大量优化，提升了应用启动速度和运行效率。\n\n## 3. Jakarta EE 9支持\n\n从Java EE迁移到Jakarta EE，包名从javax.*变更为jakarta.*。', 
 'Spring Boot 3.0带来了革命性的更新，包括Native Image支持、优化的自动配置机制、Jakarta EE 9支持等重要特性。本文将深入解析这些新特性的使用方法和最佳实践。',
 'https://images.unsplash.com/photo-1517180102446-f3c586d3b9e4?w=800&h=400&fit=crop',
 1, 1, 1, 1, 5234, 128, 32, 1, 'Spring Boot,Java,后端开发,Native Image,Jakarta EE', 'Spring Boot 3.0新特性详解，包含Native Image支持、自动配置优化等核心更新', NOW()),

('构建高并发系统的核心技术', 
 'high-concurrency-system-design',
 '# 高并发系统设计实战\n\n构建一个能够支持百万级并发的系统需要从多个维度进行考虑和优化。\n\n## 1. 缓存设计\n\n### 1.1 多级缓存架构\n\n- **浏览器缓存**：利用HTTP缓存头\n- **CDN缓存**：静态资源分发\n- **反向代理缓存**：Nginx缓存\n- **应用缓存**：本地缓存 + Redis\n- **数据库缓存**：MySQL查询缓存\n\n### 1.2 缓存策略\n\n- **缓存穿透**：使用布隆过滤器\n- **缓存击穿**：互斥锁机制\n- **缓存雪崩**：缓存过期时间随机化\n\n## 2. 数据库优化\n\n### 2.1 读写分离\n\n主从复制架构，读操作分散到多个从库。\n\n### 2.2 分库分表\n\n水平拆分和垂直拆分策略。\n\n## 3. 消息队列\n\n使用RabbitMQ/Kafka进行异步处理，削峰填谷。',
 '从零开始构建支持百万级并发的系统架构，涵盖缓存设计、消息队列、数据库优化、限流熔断等核心技术要点。',
 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
 1, 3, 1, 1, 8932, 256, 67, 1, '高并发,系统架构,缓存,消息队列,数据库优化', '高并发系统设计实战指南，包含缓存、消息队列、数据库优化等核心技术', NOW()),

('React 18与Next.js 14最佳实践', 
 'react18-nextjs14-best-practices',
 '# React 18 新特性与Next.js 14实战\n\n## 1. React 18 Concurrent Features\n\n### 1.1 Suspense和并发渲染\n\nReact 18引入了并发特性，允许React在渲染过程中暂停和恢复工作。\n\n```jsx\nimport { Suspense } from \'react\'\nimport { lazy } from \'react\'\n\nconst LazyComponent = lazy(() => import(\'./LazyComponent\'))\n\nfunction App() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <LazyComponent />\n    </Suspense>\n  )\n}\n```\n\n### 1.2 useTransition Hook\n\n用于标记非紧急的状态更新。\n\n```jsx\nimport { useTransition, startTransition } from \'react\'\n\nfunction SearchBox() {\n  const [isPending, startTransition] = useTransition()\n  const [query, setQuery] = useState(\'\')\n  \n  const handleChange = (e) => {\n    startTransition(() => {\n      setQuery(e.target.value)\n    })\n  }\n  \n  return (\n    <input onChange={handleChange} />\n  )\n}\n```\n\n## 2. Next.js 14 App Router\n\n### 2.1 新的路由系统\n\nNext.js 14的App Router带来了更好的性能和开发体验。\n\n### 2.2 Server Components\n\n服务端组件可以减少客户端JavaScript bundle大小。',
 '探索React 18的并发特性与Next.js 14的App Router，学习如何构建高性能的现代化前端应用。',
 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
 2, 2, 1, 1, 3421, 89, 23, 1, 'React,Next.js,前端开发,并发渲染,App Router', 'React 18与Next.js 14最佳实践，包含并发特性和新路由系统', NOW());

-- 插入文章标签关联
INSERT INTO article_tags (article_id, tag_id) VALUES
-- Spring Boot文章关联Java和Spring Boot标签
(1, 1), (1, 2),
-- 高并发文章关联微服务、高并发、Redis标签
(2, 7), (2, 8), (2, 10),
-- React文章关联React和Next.js标签
(3, 3), (3, 4);

-- 插入测试评论
INSERT INTO comments (article_id, user_id, content, user_name, user_avatar, status) VALUES
(1, 2, '文章写得很详细，Spring Boot 3.0的新特性确实很强大！Native Image的性能提升很明显。', '测试用户', 'https://api.dicebear.com/7.x/avataaars/svg?seed=test', 1),
(1, 3, '感谢分享，Native Image对性能提升很明显，正好项目中需要用到。', '技术小哥', 'https://api.dicebear.com/7.x/avataaars/svg?seed=author1', 1),
(2, 2, '高并发设计的思路很清晰，特别是多级缓存的设计很有参考价值。', '测试用户', 'https://api.dicebear.com/7.x/avataaars/svg?seed=test', 1),
(2, 4, '能详细讲讲限流算法的实现吗？比如令牌桶和漏桶算法的区别。', '前端达人', 'https://api.dicebear.com/7.x/avataaars/svg?seed=author2', 1),
(3, 1, 'Next.js的App Router确实比Pages Router好用很多，性能也有显著提升。', '系统管理员', NULL, 1);

-- 插入文章点赞记录
INSERT INTO article_likes (article_id, user_id) VALUES
(1, 2), (1, 3), (1, 4),
(2, 1), (2, 3), (2, 4),
(3, 1), (3, 2);

-- 插入文章收藏记录
INSERT INTO article_collections (article_id, user_id, folder_name, notes) VALUES
(1, 2, 'Spring学习', 'Spring Boot 3.0新特性学习笔记'),
(1, 3, 'default', ''),
(2, 1, '架构设计', '高并发系统设计参考资料'),
(2, 4, 'default', ''),
(3, 2, '前端技术', 'React 18学习资料');

-- 更新文章统计数据（触发器会自动维护，这里手动初始化）
UPDATE articles SET 
  comment_count = (SELECT COUNT(*) FROM comments WHERE article_id = articles.id AND status = 1 AND deleted = 0),
  like_count = (SELECT COUNT(*) FROM article_likes WHERE article_id = articles.id),
  collect_count = (SELECT COUNT(*) FROM article_collections WHERE article_id = articles.id)
WHERE deleted = 0;

-- 更新标签使用统计
UPDATE tags SET 
  use_count = (SELECT COUNT(*) FROM article_tags WHERE tag_id = tags.id)
WHERE deleted = 0;

-- 更新分类文章统计
UPDATE categories SET 
  article_count = (SELECT COUNT(*) FROM articles WHERE category_id = categories.id AND status = 1 AND deleted = 0)
WHERE deleted = 0;

-- 插入系统基础配置
INSERT INTO system_configs (config_key, config_value, config_type, config_group, description, is_public) VALUES
('site_title', '我的技术博客', 'string', '基础设置', '网站标题，显示在浏览器标题栏', 1),
('site_description', '专注于技术分享的个人博客', 'string', '基础设置', '网站描述，用于SEO', 1),
('site_keywords', '技术博客,编程,Java,前端,后端', 'string', '基础设置', '网站关键词，用于SEO', 1),
('site_logo', '/images/logo.png', 'string', '基础设置', '网站Logo图片路径', 1),
('site_footer', '© 2024 我的技术博客. All rights reserved.', 'string', '基础设置', '网站底部版权信息', 1),
('comment_enable', '1', 'boolean', '功能设置', '是否开启评论功能', 0),
('comment_audit', '0', 'boolean', '功能设置', '评论是否需要审核', 0),
('register_enable', '1', 'boolean', '功能设置', '是否允许用户注册', 0),
('page_size', '10', 'number', '显示设置', '文章列表每页显示数量', 0);

-- ================================================
-- 创建有用的视图
-- ================================================

-- 热门文章视图
CREATE VIEW v_hot_articles AS
SELECT 
    a.id,
    a.title,
    a.slug,
    a.summary,
    a.cover_image,
    a.view_count,
    a.like_count,
    a.comment_count,
    a.collect_count,
    a.publish_time,
    u.nickname as author_name,
    u.avatar as author_avatar,
    c.name as category_name,
    c.slug as category_slug,
    -- 热门度计算公式：浏览量*1 + 点赞数*3 + 评论数*5 + 收藏数*8
    (a.view_count * 1 + a.like_count * 3 + a.comment_count * 5 + a.collect_count * 8) as hot_score
FROM articles a
LEFT JOIN users u ON a.author_id = u.id
LEFT JOIN categories c ON a.category_id = c.id
WHERE a.deleted = 0 AND a.status = 1 AND u.deleted = 0
ORDER BY hot_score DESC, a.publish_time DESC
LIMIT 100;

-- 用户文章统计视图
CREATE VIEW v_user_article_stats AS
SELECT 
    u.id as user_id,
    u.username,
    u.nickname,
    u.avatar,
    COUNT(a.id) as total_articles,
    SUM(CASE WHEN a.status = 1 THEN 1 ELSE 0 END) as published_articles,
    SUM(CASE WHEN a.status = 0 THEN 1 ELSE 0 END) as draft_articles,
    SUM(a.view_count) as total_views,
    SUM(a.like_count) as total_likes,
    SUM(a.comment_count) as total_comments
FROM users u
LEFT JOIN articles a ON u.id = a.author_id AND a.deleted = 0
WHERE u.deleted = 0
GROUP BY u.id, u.username, u.nickname, u.avatar;

-- ================================================
-- 创建触发器（自动维护统计数据）
-- ================================================

DELIMITER //

-- 文章点赞数统计触发器
CREATE TRIGGER tr_article_like_insert 
AFTER INSERT ON article_likes
FOR EACH ROW
BEGIN
    UPDATE articles SET like_count = like_count + 1 WHERE id = NEW.article_id;
END//

CREATE TRIGGER tr_article_like_delete 
AFTER DELETE ON article_likes
FOR EACH ROW
BEGIN
    UPDATE articles SET like_count = like_count - 1 WHERE id = OLD.article_id;
END//

-- 文章收藏数统计触发器
CREATE TRIGGER tr_article_collect_insert 
AFTER INSERT ON article_collections
FOR EACH ROW
BEGIN
    UPDATE articles SET collect_count = collect_count + 1 WHERE id = NEW.article_id;
END//

CREATE TRIGGER tr_article_collect_delete 
AFTER DELETE ON article_collections
FOR EACH ROW
BEGIN
    UPDATE articles SET collect_count = collect_count - 1 WHERE id = OLD.article_id;
END//

-- 文章评论数统计触发器
CREATE TRIGGER tr_comment_insert 
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    IF NEW.status = 1 THEN
        UPDATE articles SET comment_count = comment_count + 1 WHERE id = NEW.article_id;
    END IF;
END//

CREATE TRIGGER tr_comment_update 
AFTER UPDATE ON comments
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        IF NEW.status = 1 THEN
            UPDATE articles SET comment_count = comment_count + 1 WHERE id = NEW.article_id;
        ELSE
            UPDATE articles SET comment_count = comment_count - 1 WHERE id = NEW.article_id;
        END IF;
    END IF;
END//

CREATE TRIGGER tr_comment_delete 
AFTER DELETE ON comments
FOR EACH ROW
BEGIN
    IF OLD.status = 1 THEN
        UPDATE articles SET comment_count = comment_count - 1 WHERE id = OLD.article_id;
    END IF;
END//

DELIMITER ;

-- ================================================
-- 创建存储过程
-- ================================================

DELIMITER //

-- 获取文章详情的存储过程（包含作者、分类、标签信息）
CREATE PROCEDURE sp_get_article_detail(IN article_id BIGINT)
BEGIN
    -- 增加浏览量
    UPDATE articles SET view_count = view_count + 1 WHERE id = article_id;
    
    -- 返回文章详细信息
    SELECT 
        a.*,
        u.nickname as author_name,
        u.avatar as author_avatar,
        u.bio as author_bio,
        c.name as category_name,
        c.slug as category_slug
    FROM articles a
    LEFT JOIN users u ON a.author_id = u.id
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.id = article_id AND a.deleted = 0 AND u.deleted = 0;
    
    -- 返回文章标签信息
    SELECT 
        t.id,
        t.name,
        t.slug,
        t.color
    FROM tags t
    INNER JOIN article_tags at ON t.id = at.tag_id
    WHERE at.article_id = article_id AND t.deleted = 0;
END//

DELIMITER ;

-- 创建索引优化查询性能（补充索引）
CREATE INDEX idx_articles_hot_score ON articles (view_count DESC, like_count DESC, comment_count DESC);
CREATE INDEX idx_users_role_status ON users (role, status);
CREATE INDEX idx_comments_article_status ON comments (article_id, status, create_time DESC);

-- ================================================
-- 数据库优化设置
-- ================================================

-- 设置MySQL参数优化
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
SET GLOBAL max_connections = 1000;
SET GLOBAL query_cache_size = 268435456; -- 256MB
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- ================================================
-- 完成数据库初始化
-- ================================================

-- 显示创建的表
SHOW TABLES;

-- 显示数据库信息
SELECT 
    'Blog System Database Initialized Successfully!' as status,
    COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'blog_system';
