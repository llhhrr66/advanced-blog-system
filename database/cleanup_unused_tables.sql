-- ================================================
-- 博客系统数据库清理脚本
-- ================================================
-- 用途: 删除不再使用的面试题相关表和数据
-- 执行前建议备份数据库
-- ================================================

USE blog_system;

-- 检查当前数据库表
SELECT 
    table_name as '当前数据库表',
    table_comment as '表注释',
    table_rows as '记录数'
FROM information_schema.tables 
WHERE table_schema = 'blog_system' 
ORDER BY table_name;

-- ================================================
-- 删除面试题相关表（按依赖关系顺序）
-- ================================================

-- 1. 删除面试题标签关联表
DROP TABLE IF EXISTS interview_question_tags;
SELECT '已删除表: interview_question_tags' as status;

-- 2. 删除用户答题记录表
DROP TABLE IF EXISTS user_answers;
SELECT '已删除表: user_answers' as status;

-- 3. 删除面试题表
DROP TABLE IF EXISTS interview_questions;
SELECT '已删除表: interview_questions' as status;

-- 4. 删除面试题分类表
DROP TABLE IF EXISTS interview_categories;
SELECT '已删除表: interview_categories' as status;

-- ================================================
-- 删除相关视图
-- ================================================

-- 删除热门面试题视图
DROP VIEW IF EXISTS v_hot_interview_questions;
SELECT '已删除视图: v_hot_interview_questions' as status;

-- ================================================
-- 验证清理结果
-- ================================================

-- 显示清理后的表列表
SELECT 
    '========== 清理后的数据库表 ==========' as info;

SELECT 
    table_name as '保留的表',
    table_comment as '表注释',
    table_rows as '记录数'
FROM information_schema.tables 
WHERE table_schema = 'blog_system' 
ORDER BY table_name;

-- 统计信息
SELECT 
    COUNT(*) as '当前表数量',
    'blog_system' as '数据库名'
FROM information_schema.tables 
WHERE table_schema = 'blog_system';

SELECT 
    '数据库清理完成！' as status,
    '已删除所有面试题相关表和视图' as message,
    NOW() as cleanup_time;
