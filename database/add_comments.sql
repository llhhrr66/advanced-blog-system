-- ================================================
-- 博客系统数据库表字段注释添加脚本
-- ================================================
-- 创建时间: 2024-09-24
-- 版本: v1.0.0
-- 说明: 为所有表和字段添加详细的中文注释
-- ================================================

USE blog_system;

-- ================================================
-- 用户管理模块
-- ================================================

-- 为users表添加详细注释
ALTER TABLE users COMMENT '用户基础信息表，存储用户账户、个人资料和权限信息';

-- 为users表的字段添加详细注释
ALTER TABLE users MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户唯一标识符，自增主键';
ALTER TABLE users MODIFY COLUMN username VARCHAR(50) NOT NULL COMMENT '用户登录名，全局唯一，3-50字符，支持字母数字下划线';
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL COMMENT '用户密码，BCrypt加密存储，原始密码6-20字符';
ALTER TABLE users MODIFY COLUMN email VARCHAR(100) COMMENT '用户邮箱地址，全局唯一，用于找回密码和通知';
ALTER TABLE users MODIFY COLUMN phone VARCHAR(20) COMMENT '手机号码，可为空，格式：+86-138****8888';
ALTER TABLE users MODIFY COLUMN nickname VARCHAR(50) COMMENT '用户昵称，用于前台显示，2-50字符，默认使用username';
ALTER TABLE users MODIFY COLUMN avatar VARCHAR(500) COMMENT '用户头像URL地址，支持相对路径和绝对URL，默认使用系统头像';
ALTER TABLE users MODIFY COLUMN bio TEXT COMMENT '用户个人简介，最大1000字符，支持简单的Markdown语法';
ALTER TABLE users MODIFY COLUMN role VARCHAR(20) DEFAULT 'USER' COMMENT '用户角色：ADMIN-管理员，USER-普通用户，AUTHOR-作者';
ALTER TABLE users MODIFY COLUMN status INT DEFAULT 1 COMMENT '账户状态：0-禁用（无法登录），1-正常，2-待激活';
ALTER TABLE users MODIFY COLUMN article_count INT DEFAULT 0 COMMENT '发表文章总数，冗余字段用于快速查询';
ALTER TABLE users MODIFY COLUMN follower_count INT DEFAULT 0 COMMENT '粉丝数量，用于用户影响力统计';
ALTER TABLE users MODIFY COLUMN following_count INT DEFAULT 0 COMMENT '关注数量，用于社交功能';
ALTER TABLE users MODIFY COLUMN last_login_time DATETIME COMMENT '最后登录时间，用于统计活跃度';
ALTER TABLE users MODIFY COLUMN last_login_ip VARCHAR(50) COMMENT '最后登录IP地址，用于安全监控';
ALTER TABLE users MODIFY COLUMN create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '账户创建时间，不可修改';
ALTER TABLE users MODIFY COLUMN update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间，自动维护';
ALTER TABLE users MODIFY COLUMN deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记：0-未删除，1-已删除';

-- ================================================
-- 内容分类模块
-- ================================================

-- 为categories表添加详细注释
ALTER TABLE categories COMMENT '文章分类表，支持多级分类和自定义显示样式';

-- 为categories表的字段添加详细注释
ALTER TABLE categories MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '分类唯一标识符，自增主键';
ALTER TABLE categories MODIFY COLUMN name VARCHAR(50) NOT NULL COMMENT '分类名称，唯一，2-50字符，如：后端开发、前端技术';
ALTER TABLE categories MODIFY COLUMN slug VARCHAR(100) COMMENT '分类别名，用于URL友好显示，如：backend-dev';
ALTER TABLE categories MODIFY COLUMN description TEXT COMMENT '分类描述，最大500字符，用于SEO和用户理解';
ALTER TABLE categories MODIFY COLUMN parent_id BIGINT DEFAULT 0 COMMENT '父分类ID，0表示顶级分类，支持最多3级嵌套';
ALTER TABLE categories MODIFY COLUMN level TINYINT DEFAULT 1 COMMENT '分类层级：1-一级分类，2-二级分类，3-三级分类';
ALTER TABLE categories MODIFY COLUMN path VARCHAR(200) COMMENT '分类路径，如：1/2/3，便于查询所有子分类';
ALTER TABLE categories MODIFY COLUMN icon VARCHAR(100) COMMENT '分类图标，支持FontAwesome图标名或图片URL';
ALTER TABLE categories MODIFY COLUMN color VARCHAR(20) COMMENT '分类主题色，16进制颜色值，如：#1890ff';
ALTER TABLE categories MODIFY COLUMN cover_image VARCHAR(500) COMMENT '分类封面图URL，用于分类页面展示';
ALTER TABLE categories MODIFY COLUMN sort_order INT DEFAULT 0 COMMENT '排序权重，数值越大越靠前，默认按创建时间排序';
ALTER TABLE categories MODIFY COLUMN article_count INT DEFAULT 0 COMMENT '该分类下文章数量，冗余字段便于快速查询';
ALTER TABLE categories MODIFY COLUMN status TINYINT(1) DEFAULT 1 COMMENT '分类状态：0-禁用，1-启用';
ALTER TABLE categories MODIFY COLUMN create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '分类创建时间';
ALTER TABLE categories MODIFY COLUMN update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间';
ALTER TABLE categories MODIFY COLUMN deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记：0-未删除，1-已删除';

-- ================================================
-- 标签系统模块
-- ================================================

-- 为tags表添加详细注释
ALTER TABLE tags COMMENT '文章标签表，用于文章内容标记和分类';

-- 为tags表的字段添加详细注释
ALTER TABLE tags MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '标签唯一标识符，自增主键';
ALTER TABLE tags MODIFY COLUMN name VARCHAR(50) NOT NULL COMMENT '标签名称，全局唯一，1-50字符，如：Java、Redis';
ALTER TABLE tags MODIFY COLUMN slug VARCHAR(100) COMMENT '标签别名，用于URL友好显示，如：java、redis';
ALTER TABLE tags MODIFY COLUMN description TEXT COMMENT '标签描述，最大200字符，解释标签含义和用途';
ALTER TABLE tags MODIFY COLUMN color VARCHAR(20) COMMENT '标签颜色，16进制颜色值，如：#f50，用于前台标签展示';
ALTER TABLE tags MODIFY COLUMN background_color VARCHAR(20) COMMENT '标签背景色，可选，用于特殊显示效果';
ALTER TABLE tags MODIFY COLUMN use_count INT DEFAULT 0 COMMENT '标签使用次数，每当文章关联此标签时+1';
ALTER TABLE tags MODIFY COLUMN click_count INT DEFAULT 0 COMMENT '标签点击次数，用于热门标签统计';
ALTER TABLE tags MODIFY COLUMN status TINYINT(1) DEFAULT 1 COMMENT '标签状态：0-禁用，1-启用';
ALTER TABLE tags MODIFY COLUMN create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '标签创建时间';
ALTER TABLE tags MODIFY COLUMN update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间';
ALTER TABLE tags MODIFY COLUMN deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记：0-未删除，1-已删除';

-- ================================================
-- 文章内容模块
-- ================================================

-- 为articles表添加详细注释
ALTER TABLE articles COMMENT '文章主表，存储博客文章的所有基础信息和内容';

-- 为articles表的字段添加详细注释
ALTER TABLE articles MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '文章唯一标识符，自增主键';
ALTER TABLE articles MODIFY COLUMN title VARCHAR(200) NOT NULL COMMENT '文章标题，5-200字符，必填，用于显示和SEO';
ALTER TABLE articles MODIFY COLUMN slug VARCHAR(300) COMMENT '文章URL别名，英文数字连字符，如：spring-boot-guide';
ALTER TABLE articles MODIFY COLUMN content LONGTEXT COMMENT '文章正文内容，Markdown格式，最大16MB';
ALTER TABLE articles MODIFY COLUMN summary TEXT COMMENT '文章摘要，最大500字符，为空时自动从content提取前200字';
ALTER TABLE articles MODIFY COLUMN cover_image VARCHAR(500) COMMENT '文章封面图URL，支持相对路径和绝对URL';
ALTER TABLE articles MODIFY COLUMN author_id BIGINT NOT NULL COMMENT '作者ID，关联users表，文章归属用户';
ALTER TABLE articles MODIFY COLUMN category_id BIGINT COMMENT '文章分类ID，关联categories表，可为空';
ALTER TABLE articles MODIFY COLUMN status TINYINT DEFAULT 0 COMMENT '发布状态：0-草稿，1-已发布，2-已下架，3-待审核';
ALTER TABLE articles MODIFY COLUMN is_top TINYINT(1) DEFAULT 0 COMMENT '是否置顶：0-普通文章，1-置顶文章';
ALTER TABLE articles MODIFY COLUMN is_featured TINYINT(1) DEFAULT 0 COMMENT '是否精选：0-普通文章，1-精选文章';
ALTER TABLE articles MODIFY COLUMN allow_comment TINYINT(1) DEFAULT 1 COMMENT '是否允许评论：0-禁止评论，1-允许评论';
ALTER TABLE articles MODIFY COLUMN view_count BIGINT DEFAULT 0 COMMENT '浏览次数，每次访问文章详情页+1';
ALTER TABLE articles MODIFY COLUMN like_count BIGINT DEFAULT 0 COMMENT '点赞数量，与article_likes表保持同步';
ALTER TABLE articles MODIFY COLUMN comment_count BIGINT DEFAULT 0 COMMENT '评论数量，与comments表保持同步';
ALTER TABLE articles MODIFY COLUMN collect_count BIGINT DEFAULT 0 COMMENT '收藏数量，与article_collections表保持同步';
ALTER TABLE articles MODIFY COLUMN share_count BIGINT DEFAULT 0 COMMENT '分享次数，记录社交分享数据';
ALTER TABLE articles MODIFY COLUMN article_type TINYINT DEFAULT 1 COMMENT '文章类型：1-原创，2-转载，3-翻译';
ALTER TABLE articles MODIFY COLUMN original_url VARCHAR(500) COMMENT '原文链接，转载或翻译文章的源地址';
ALTER TABLE articles MODIFY COLUMN read_time INT COMMENT '预计阅读时间，单位分钟，根据字数自动计算';
ALTER TABLE articles MODIFY COLUMN word_count INT COMMENT '文章字数，不包含Markdown语法字符';
ALTER TABLE articles MODIFY COLUMN keywords VARCHAR(500) COMMENT 'SEO关键词，逗号分隔，最多10个关键词';
ALTER TABLE articles MODIFY COLUMN meta_description TEXT COMMENT 'SEO描述，最大160字符，用于搜索引擎展示';
ALTER TABLE articles MODIFY COLUMN publish_time DATETIME COMMENT '文章发布时间，可预设未来时间实现定时发布';
ALTER TABLE articles MODIFY COLUMN create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间，草稿创建时间';
ALTER TABLE articles MODIFY COLUMN update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后编辑时间';
ALTER TABLE articles MODIFY COLUMN deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记：0-未删除，1-已删除';

-- ================================================
-- 关联关系模块
-- ================================================

-- 为article_tags表添加详细注释
ALTER TABLE article_tags COMMENT '文章标签关联表，维护文章与标签的多对多关系';

-- 为article_tags表的字段添加详细注释
ALTER TABLE article_tags MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '关联关系唯一标识符，自增主键';
ALTER TABLE article_tags MODIFY COLUMN article_id BIGINT NOT NULL COMMENT '文章ID，关联articles表主键';
ALTER TABLE article_tags MODIFY COLUMN tag_id BIGINT NOT NULL COMMENT '标签ID，关联tags表主键';
ALTER TABLE article_tags MODIFY COLUMN create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '关联创建时间，用于统计标签使用趋势';

-- ================================================
-- 评论互动模块
-- ================================================

-- 为comments表添加详细注释
ALTER TABLE comments COMMENT '文章评论表，支持多级评论回复和状态管理';

-- 为comments表的字段添加详细注释
ALTER TABLE comments MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '评论唯一标识符，自增主键';
ALTER TABLE comments MODIFY COLUMN article_id BIGINT NOT NULL COMMENT '文章ID，关联articles表，评论所属文章';
ALTER TABLE comments MODIFY COLUMN user_id BIGINT NOT NULL COMMENT '评论用户ID，关联users表，评论作者';
ALTER TABLE comments MODIFY COLUMN parent_id BIGINT DEFAULT 0 COMMENT '父评论ID，0表示顶级评论，其他值表示回复评论';
ALTER TABLE comments MODIFY COLUMN content TEXT NOT NULL COMMENT '评论正文内容，1-500字符，支持简单文本和表情';
ALTER TABLE comments MODIFY COLUMN user_name VARCHAR(50) COMMENT '评论时的用户昵称快照';
ALTER TABLE comments MODIFY COLUMN user_avatar VARCHAR(500) COMMENT '评论时的用户头像快照';
ALTER TABLE comments MODIFY COLUMN user_email VARCHAR(100) COMMENT '评论时的用户邮箱快照（用于Gravatar）';
ALTER TABLE comments MODIFY COLUMN ip_address VARCHAR(50) COMMENT '评论者IP地址，用于反垃圾和安全控制';
ALTER TABLE comments MODIFY COLUMN user_agent TEXT COMMENT '用户浏览器信息，用于技术统计';
ALTER TABLE comments MODIFY COLUMN like_count INT DEFAULT 0 COMMENT '评论点赞数，与comment_likes表同步';
ALTER TABLE comments MODIFY COLUMN reply_count INT DEFAULT 0 COMMENT '回复数量，子评论统计';
ALTER TABLE comments MODIFY COLUMN status TINYINT DEFAULT 1 COMMENT '评论状态：0-待审核，1-已发布，2-已隐藏，3-垃圾评论';
ALTER TABLE comments MODIFY COLUMN create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '评论发表时间';
ALTER TABLE comments MODIFY COLUMN update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '评论最后修改时间';
ALTER TABLE comments MODIFY COLUMN deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记：0-未删除，1-已删除';

-- ================================================
-- 用户行为记录模块
-- ================================================

-- 为article_likes表添加详细注释
ALTER TABLE article_likes COMMENT '文章点赞记录表，记录用户对文章的点赞行为';

-- 为article_likes表的字段添加详细注释
ALTER TABLE article_likes MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '点赞记录唯一标识符，自增主键';
ALTER TABLE article_likes MODIFY COLUMN article_id BIGINT NOT NULL COMMENT '文章ID，关联articles表';
ALTER TABLE article_likes MODIFY COLUMN user_id BIGINT NOT NULL COMMENT '点赞用户ID，关联users表';
ALTER TABLE article_likes MODIFY COLUMN ip_address VARCHAR(50) COMMENT '点赞时的IP地址，用于防刷控制';
ALTER TABLE article_likes MODIFY COLUMN create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间，用于统计和排序';

-- 为article_collections表添加详细注释
ALTER TABLE article_collections COMMENT '文章收藏记录表，记录用户对文章的收藏行为和个人笔记';

-- 为article_collections表的字段添加详细注释
ALTER TABLE article_collections MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '收藏记录唯一标识符，自增主键';
ALTER TABLE article_collections MODIFY COLUMN article_id BIGINT NOT NULL COMMENT '文章ID，关联articles表';
ALTER TABLE article_collections MODIFY COLUMN user_id BIGINT NOT NULL COMMENT '收藏用户ID，关联users表';
ALTER TABLE article_collections MODIFY COLUMN folder_name VARCHAR(100) DEFAULT 'default' COMMENT '收藏夹名称，支持用户自定义分类收藏';
ALTER TABLE article_collections MODIFY COLUMN notes TEXT COMMENT '收藏备注，用户可添加个人笔记';
ALTER TABLE article_collections MODIFY COLUMN create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间';

-- 为comment_likes表添加详细注释（如果存在）
-- 先检查表是否存在
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables 
                    WHERE table_schema = 'blog_system' AND table_name = 'comment_likes');

-- 添加注释
SET @sql = IF(@table_exists > 0, 
    'ALTER TABLE comment_likes COMMENT \'评论点赞记录表，记录用户对评论的点赞行为\';', 
    'SELECT \'Table comment_likes does not exist\' as message;');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 为comment_likes表的字段添加详细注释（如果表存在）
SET @sql = IF(@table_exists > 0, 
    'ALTER TABLE comment_likes 
     MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT \'评论点赞记录唯一标识符，自增主键\',
     MODIFY COLUMN comment_id BIGINT NOT NULL COMMENT \'评论ID，关联comments表\',
     MODIFY COLUMN user_id BIGINT NOT NULL COMMENT \'点赞用户ID，关联users表\',
     MODIFY COLUMN create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT \'点赞时间\';', 
    'SELECT \'Skipping comment_likes field comments\' as message;');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ================================================
-- 系统配置模块
-- ================================================

-- 检查system_configs表是否存在
SET @system_configs_exists = (SELECT COUNT(*) FROM information_schema.tables 
                             WHERE table_schema = 'blog_system' AND table_name = 'system_configs');

-- 为system_configs表添加详细注释（如果存在）
SET @sql = IF(@system_configs_exists > 0, 
    'ALTER TABLE system_configs COMMENT \'系统配置表，存储博客系统的各种配置参数\';', 
    'SELECT \'Table system_configs does not exist\' as message;');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 为system_configs表的字段添加详细注释（如果表存在）
SET @sql = IF(@system_configs_exists > 0, 
    'ALTER TABLE system_configs 
     MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT \'配置项唯一标识符，自增主键\',
     MODIFY COLUMN config_key VARCHAR(100) NOT NULL COMMENT \'配置键名，全局唯一，如：site_title、smtp_host\',
     MODIFY COLUMN config_value TEXT COMMENT \'配置值，支持字符串、JSON格式的复杂配置\',
     MODIFY COLUMN config_type VARCHAR(20) DEFAULT \'string\' COMMENT \'配置类型：string-字符串，number-数字，boolean-布尔，json-JSON对象\',
     MODIFY COLUMN config_group VARCHAR(50) COMMENT \'配置分组，如：基础设置、邮件配置、SEO设置\',
     MODIFY COLUMN description VARCHAR(500) COMMENT \'配置项描述，说明配置的作用和格式要求\',
     MODIFY COLUMN is_public TINYINT(1) DEFAULT 0 COMMENT \'是否公开配置：0-仅管理员可见，1-前台可访问\',
     MODIFY COLUMN status TINYINT(1) DEFAULT 1 COMMENT \'配置状态：0-禁用，1-启用\',
     MODIFY COLUMN create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT \'配置创建时间\',
     MODIFY COLUMN update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'配置最后修改时间\';', 
    'SELECT \'Skipping system_configs field comments\' as message;');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ================================================
-- 索引注释
-- ================================================

-- 为users表的索引添加注释
ALTER TABLE users DROP INDEX idx_username;
ALTER TABLE users ADD INDEX idx_username (username) COMMENT '用户名索引，用于登录查询';

ALTER TABLE users DROP INDEX idx_email;
ALTER TABLE users ADD INDEX idx_email (email) COMMENT '邮箱索引，用于邮箱登录和找回密码';

-- 检查复合索引是否存在
SET @idx_status_role_exists = (SELECT COUNT(*) FROM information_schema.statistics
                              WHERE table_schema = 'blog_system' AND table_name = 'users' 
                              AND index_name = 'idx_status_role');

SET @sql = IF(@idx_status_role_exists > 0, 
    'ALTER TABLE users DROP INDEX idx_status_role;
     ALTER TABLE users ADD INDEX idx_status_role (status, role) COMMENT \'状态角色复合索引，用于管理员查询\';', 
    'ALTER TABLE users ADD INDEX idx_status_role (status, role) COMMENT \'状态角色复合索引，用于管理员查询\';');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 为categories表的索引添加注释
ALTER TABLE categories DROP INDEX idx_parent_id;
ALTER TABLE categories ADD INDEX idx_parent_id (parent_id) COMMENT '父分类索引，用于查询子分类';

-- 检查复合索引是否存在
SET @idx_slug_exists = (SELECT COUNT(*) FROM information_schema.statistics
                       WHERE table_schema = 'blog_system' AND table_name = 'categories' 
                       AND index_name = 'idx_slug');

SET @sql = IF(@idx_slug_exists > 0, 
    'ALTER TABLE categories DROP INDEX idx_slug;
     ALTER TABLE categories ADD INDEX idx_slug (slug) COMMENT \'别名索引，用于URL路由\';', 
    'ALTER TABLE categories ADD INDEX idx_slug (slug) COMMENT \'别名索引，用于URL路由\';');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 更多索引注释...

-- ================================================
-- 完成
-- ================================================

SELECT 'Database field comments added successfully!' as message;
