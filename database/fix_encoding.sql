-- 修复数据库编码问题
ALTER DATABASE blog_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 修复表编码
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE articles CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE comments CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE tags CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE article_tags CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE article_likes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE article_collections CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE interview_questions CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE interview_categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE interview_question_tags CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE user_answers CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 更新现有数据
UPDATE users SET nickname = '系统管理员' WHERE id = 1;

UPDATE categories SET 
  name = CASE id
    WHEN 1 THEN '后端开发'
    WHEN 2 THEN '前端开发'
    WHEN 3 THEN '架构设计'
    WHEN 4 THEN '数据库'
    WHEN 5 THEN 'DevOps'
    WHEN 6 THEN '算法与数据结构'
  END,
  description = CASE id
    WHEN 1 THEN 'Java, Spring Boot, 微服务等后端技术'
    WHEN 2 THEN 'React, Vue, Next.js等前端技术'
    WHEN 3 THEN '系统架构设计与最佳实践'
    WHEN 4 THEN 'MySQL, Redis, MongoDB等数据库技术'
    WHEN 5 THEN 'Docker, K8s, CI/CD等运维技术'
    WHEN 6 THEN '经典算法与数据结构'
  END
WHERE id IN (1,2,3,4,5,6);
