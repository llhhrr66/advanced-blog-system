-- 修复 tags 表，添加缺失的 use_count 字段
-- 执行前请确保已连接到正确的数据库

-- 1. 检查 tags 表是否存在
-- 如果表不存在，请先创建完整的表结构
CREATE TABLE IF NOT EXISTS tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '标签ID',
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '标签名称',
    description VARCHAR(255) COMMENT '标签描述',
    use_count INT DEFAULT 0 COMMENT '使用次数',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除标志'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

-- 2. 如果表已存在，尝试添加缺失的字段
-- 注意：如果字段已存在，ALTER TABLE会报错，但这是预期的
ALTER TABLE tags ADD COLUMN use_count INT DEFAULT 0 COMMENT '使用次数' AFTER description;

-- 3. 初始化现有数据的 use_count 值
-- 基于 article_tags 表统计每个标签的实际使用次数
UPDATE tags t
LEFT JOIN (
    SELECT tag_id, COUNT(*) as count
    FROM article_tags
    GROUP BY tag_id
) at ON t.id = at.tag_id
SET t.use_count = COALESCE(at.count, 0)
WHERE t.deleted = 0;

-- 4. 查看更新后的表结构
DESC tags;

-- 5. 显示每个标签的使用次数
SELECT id, name, use_count FROM tags WHERE deleted = 0 ORDER BY use_count DESC;
