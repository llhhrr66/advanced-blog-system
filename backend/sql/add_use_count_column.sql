-- 为 tags 表添加 use_count 字段
-- 如果字段已存在，命令会失败，但这是正常的

ALTER TABLE tags ADD COLUMN use_count INT DEFAULT 0 COMMENT '使用次数' AFTER description;

-- 更新现有数据的 use_count 值（基于 article_tags 关联表）
UPDATE tags t
LEFT JOIN (
    SELECT tag_id, COUNT(*) as count
    FROM article_tags
    GROUP BY tag_id
) at ON t.id = at.tag_id
SET t.use_count = COALESCE(at.count, 0)
WHERE t.deleted = 0;

-- 显示更新结果
SELECT id, name, use_count FROM tags WHERE deleted = 0;
