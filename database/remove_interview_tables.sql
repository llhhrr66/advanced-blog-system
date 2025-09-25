-- ================================================
-- 博客系统删除无关面试题表脚本
-- ================================================
-- 创建时间: 2024-09-24
-- 版本: v1.0.0
-- 说明: 删除面试题相关的表和数据，只保留博客核心功能
-- ================================================

USE blog_system;

-- ================================================
-- 备份确认
-- ================================================

-- 显示当前数据库中的所有表
SELECT 
    table_name as '当前存在的表',
    table_comment as '表注释',
    table_rows as '估计行数'
FROM information_schema.tables 
WHERE table_schema = 'blog_system'
ORDER BY table_name;

-- ================================================
-- 删除面试题相关视图
-- ================================================

-- 删除热门面试题视图
DROP VIEW IF EXISTS v_hot_interview_questions;

SELECT 'Dropped view: v_hot_interview_questions' as message;

-- ================================================
-- 删除面试题相关表（按依赖顺序删除）
-- ================================================

-- 1. 删除用户答题记录表
DROP TABLE IF EXISTS user_answers;
SELECT 'Dropped table: user_answers' as message;

-- 2. 删除面试题标签关联表
DROP TABLE IF EXISTS interview_question_tags;
SELECT 'Dropped table: interview_question_tags' as message;

-- 3. 删除面试题表
DROP TABLE IF EXISTS interview_questions;
SELECT 'Dropped table: interview_questions' as message;

-- 4. 删除面试题分类表
DROP TABLE IF EXISTS interview_categories;
SELECT 'Dropped table: interview_categories' as message;

-- ================================================
-- 清理相关数据
-- ================================================

-- 从tags表中删除面试题相关的标签（如果有的话）
DELETE FROM tags WHERE name IN (
    'Java基础', 'JVM', '并发编程', '面试题', 'Spring面试', 
    '数据库面试', 'Redis面试', '算法面试', '系统设计面试'
);

SELECT CONCAT('Deleted ', ROW_COUNT(), ' interview-related tags') as message;

-- 从categories表中删除面试题相关分类（如果有的话）
DELETE FROM categories WHERE name IN (
    'Java面试题', '前端面试题', '后端面试题', '算法面试题',
    '系统设计面试', '数据库面试题'
);

SELECT CONCAT('Deleted ', ROW_COUNT(), ' interview-related categories') as message;

-- ================================================
-- 更新统计数据
-- ================================================

-- 更新标签使用统计
UPDATE tags SET 
    use_count = (SELECT COUNT(*) FROM article_tags WHERE tag_id = tags.id)
WHERE deleted = 0;

SELECT 'Updated tags use_count statistics' as message;

-- 更新分类文章统计
UPDATE categories SET 
    article_count = (SELECT COUNT(*) FROM articles 
                    WHERE category_id = categories.id 
                    AND status = 1 AND deleted = 0)
WHERE deleted = 0;

SELECT 'Updated categories article_count statistics' as message;

-- ================================================
-- 验证清理结果
-- ================================================

-- 显示清理后的表列表
SELECT 
    '=== 清理后剩余的表 ===' as info;

SELECT 
    table_name as '表名',
    table_comment as '表说明',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) as '大小(MB)'
FROM information_schema.tables 
WHERE table_schema = 'blog_system'
ORDER BY table_name;

-- 显示各表的记录数统计
SELECT 
    '=== 各表记录数统计 ===' as info;

SELECT 
    'users' as table_name, 
    COUNT(*) as record_count 
FROM users
UNION ALL
SELECT 
    'categories' as table_name, 
    COUNT(*) as record_count 
FROM categories
UNION ALL
SELECT 
    'tags' as table_name, 
    COUNT(*) as record_count 
FROM tags
UNION ALL
SELECT 
    'articles' as table_name, 
    COUNT(*) as record_count 
FROM articles
UNION ALL
SELECT 
    'article_tags' as table_name, 
    COUNT(*) as record_count 
FROM article_tags
UNION ALL
SELECT 
    'comments' as table_name, 
    COUNT(*) as record_count 
FROM comments
UNION ALL
SELECT 
    'article_likes' as table_name, 
    COUNT(*) as record_count 
FROM article_likes
UNION ALL
SELECT 
    'article_collections' as table_name, 
    COUNT(*) as record_count 
FROM article_collections
UNION ALL
SELECT 
    'system_configs' as table_name, 
    COUNT(*) as record_count 
FROM system_configs;

-- ================================================
-- 检查外键约束
-- ================================================

-- 显示当前数据库的外键约束情况
SELECT 
    '=== 外键约束检查 ===' as info;

SELECT 
    CONSTRAINT_NAME as '约束名',
    TABLE_NAME as '表名', 
    COLUMN_NAME as '列名',
    REFERENCED_TABLE_NAME as '引用表',
    REFERENCED_COLUMN_NAME as '引用列'
FROM information_schema.KEY_COLUMN_USAGE 
WHERE table_schema = 'blog_system' 
AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME;

-- ================================================
-- 优化数据库
-- ================================================

-- 优化表，回收删除表后的空间
OPTIMIZE TABLE users;
OPTIMIZE TABLE categories;
OPTIMIZE TABLE tags;
OPTIMIZE TABLE articles;
OPTIMIZE TABLE article_tags;
OPTIMIZE TABLE comments;
OPTIMIZE TABLE article_likes;
OPTIMIZE TABLE article_collections;

SELECT 'Database tables optimized' as message;

-- ================================================
-- 完成总结
-- ================================================

SELECT 
    '=== 清理完成总结 ===' as info;

SELECT 
    '✅ 已删除面试题相关表:' as summary
UNION ALL
SELECT 
    '   - user_answers (用户答题记录表)'
UNION ALL
SELECT 
    '   - interview_question_tags (面试题标签关联表)'
UNION ALL
SELECT 
    '   - interview_questions (面试题表)'
UNION ALL
SELECT 
    '   - interview_categories (面试题分类表)'
UNION ALL
SELECT 
    '✅ 已删除相关视图:'
UNION ALL
SELECT 
    '   - v_hot_interview_questions (热门面试题视图)'
UNION ALL
SELECT 
    '✅ 已清理相关数据并更新统计信息'
UNION ALL
SELECT 
    '✅ 数据库空间已优化'
UNION ALL
SELECT 
    '🎉 博客系统数据库清理完成！';

-- ================================================
-- 安全检查
-- ================================================

-- 确保核心表都存在
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'blog_system' AND table_name = 'users') > 0
        AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'blog_system' AND table_name = 'categories') > 0
        AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'blog_system' AND table_name = 'tags') > 0
        AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'blog_system' AND table_name = 'articles') > 0
        AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'blog_system' AND table_name = 'comments') > 0
        THEN '✅ 所有核心表完整存在'
        ELSE '❌ 警告：核心表可能缺失，请检查！'
    END as core_tables_check;
