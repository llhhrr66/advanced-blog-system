# 📚 博客系统数据库迁移指南

> 版本: v1.0.0  
> 更新时间: 2024-09-24

## 🎯 迁移目标

本次数据库迁移主要完成以下任务：

1. **删除无关表**: 移除面试题相关的表和数据
2. **添加详细注释**: 为所有表和字段添加中文注释
3. **优化数据库**: 更新统计数据并优化表结构
4. **验证完整性**: 确保核心功能表完整可用

## 📁 文件说明

| 文件名 | 说明 | 用途 |
|--------|------|------|
| `database_migration.sql` | **推荐使用** - 完整迁移脚本 | 一键完成所有迁移操作 |
| `add_comments.sql` | 字段注释添加脚本 | 仅添加表和字段注释 |
| `remove_interview_tables.sql` | 面试题表删除脚本 | 仅删除面试题相关内容 |
| `blog_system_optimized.sql` | 优化版初始化脚本 | 全新安装推荐使用 |
| `cleanup_unused_tables.sql` | 清理无用表脚本 | 清理特定表 |

## 🚀 快速开始

### 方案一：一键迁移（推荐）

```sql
-- 连接到MySQL数据库
mysql -u your_username -p

-- 执行完整迁移脚本
source D:\111GRBK\blog-system\database\database_migration.sql
```

### 方案二：分步执行

如果你希望分步骤执行，可以按以下顺序：

```sql
-- 1. 删除面试题相关表
source D:\111GRBK\blog-system\database\remove_interview_tables.sql

-- 2. 添加字段注释
source D:\111GRBK\blog-system\database\add_comments.sql
```

### 方案三：全新安装

如果是全新安装，直接使用优化版脚本：

```sql
-- 全新安装（推荐）
source D:\111GRBK\blog-system\database\blog_system_optimized.sql
```

## ⚠️ 执行前准备

### 1. 数据备份

```bash
# 备份当前数据库
mysqldump -u your_username -p blog_system > backup_blog_system_$(date +%Y%m%d_%H%M%S).sql
```

### 2. 检查权限

确保数据库用户有以下权限：
- `SELECT, INSERT, UPDATE, DELETE` - 数据操作
- `CREATE, ALTER, DROP` - 结构修改
- `INDEX` - 索引操作

### 3. 环境要求

- MySQL版本: 8.0+ (推荐)
- 字符集: utf8mb4
- 排序规则: utf8mb4_unicode_ci

## 📊 迁移后验证

### 1. 检查表结构
```sql
-- 查看所有表及注释
SELECT 
    table_name as '表名',
    table_comment as '表注释',
    table_rows as '记录数'
FROM information_schema.tables 
WHERE table_schema = 'blog_system'
ORDER BY table_name;
```

### 2. 检查字段注释
```sql
-- 查看指定表的字段注释
SHOW FULL COLUMNS FROM users;
SHOW FULL COLUMNS FROM articles;
```

### 3. 验证数据完整性
```sql
-- 检查核心数据是否完整
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'articles' as table_name, COUNT(*) as count FROM articles
UNION ALL
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'tags' as table_name, COUNT(*) as count FROM tags;
```

## 🗂️ 迁移后表结构

### 核心表 (9张)

| 表名 | 中文名 | 记录数预估 | 重要程度 |
|------|--------|-----------|----------|
| `users` | 用户基础信息表 | 100-10K | ⭐⭐⭐⭐⭐ |
| `categories` | 文章分类表 | 10-50 | ⭐⭐⭐⭐ |
| `tags` | 文章标签表 | 50-200 | ⭐⭐⭐⭐ |
| `articles` | 文章主表 | 100-50K | ⭐⭐⭐⭐⭐ |
| `article_tags` | 文章标签关联表 | 500-200K | ⭐⭐⭐ |
| `comments` | 文章评论表 | 1K-500K | ⭐⭐⭐⭐ |
| `article_likes` | 文章点赞记录表 | 5K-1M | ⭐⭐⭐ |
| `article_collections` | 文章收藏记录表 | 1K-200K | ⭐⭐⭐ |
| `system_configs` | 系统配置表 | 20-100 | ⭐⭐ |

### 已删除的表

- ❌ `interview_categories` - 面试题分类表
- ❌ `interview_questions` - 面试题表  
- ❌ `interview_question_tags` - 面试题标签关联表
- ❌ `user_answers` - 用户答题记录表

## 🛠️ 常见问题

### Q1: 执行过程中出现权限错误？
```sql
-- 检查当前用户权限
SHOW GRANTS FOR CURRENT_USER();

-- 如需要，联系管理员授权
GRANT ALL PRIVILEGES ON blog_system.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

### Q2: 字符编码问题？
```sql
-- 确保数据库和表使用正确的字符集
ALTER DATABASE blog_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 检查表字符集
SELECT table_name, table_collation 
FROM information_schema.tables 
WHERE table_schema = 'blog_system';
```

### Q3: 外键约束错误？
```sql
-- 查看当前外键约束
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE 
WHERE table_schema = 'blog_system' 
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### Q4: 如何回滚？
如果迁移出现问题，可以使用备份恢复：

```bash
# 恢复备份
mysql -u your_username -p blog_system < backup_blog_system_YYYYMMDD_HHMMSS.sql
```

## 📈 性能优化建议

### 1. 索引优化
```sql
-- 检查索引使用情况
SHOW INDEX FROM articles;
SHOW INDEX FROM comments;

-- 分析慢查询
SHOW VARIABLES LIKE 'slow_query_log';
```

### 2. 配置优化
```sql
-- MySQL性能配置检查
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW VARIABLES LIKE 'max_connections';
```

### 3. 定期维护
```sql
-- 定期优化表
OPTIMIZE TABLE articles;
OPTIMIZE TABLE comments;

-- 更新表统计信息
ANALYZE TABLE articles;
ANALYZE TABLE users;
```

## 🔗 相关文档

- [数据库设计文档](./数据库设计文档.md) - 详细的表结构说明
- [API设计文档](../api/README.md) - 接口设计规范  
- [前端对接文档](../frontend/README.md) - 前端集成指南

## 📞 技术支持

如果在迁移过程中遇到问题，请：

1. 检查错误日志
2. 确认数据备份完整
3. 查看相关文档
4. 提交技术支持请求

---

**⚠️ 重要提醒**: 请在生产环境执行前，务必在测试环境完整验证迁移脚本！
