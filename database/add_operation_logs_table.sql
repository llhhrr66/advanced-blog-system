-- ================================================
-- 操作日志表 - 新增脚本
-- ================================================
-- 创建时间: 2025-09-24
-- 说明: 添加系统操作日志表用于记录用户的各种操作行为
-- ================================================

USE blog_system;

-- ================================================
-- 操作日志模块
-- ================================================

-- 操作日志表
CREATE TABLE IF NOT EXISTS operation_logs (
    -- 主键ID
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '操作日志唯一标识符，自增主键',
    
    -- 操作信息
    operation_type VARCHAR(50) NOT NULL COMMENT '操作类型，如：BATCH_DELETE、BATCH_PUBLISH等',
    operation_desc VARCHAR(200) COMMENT '操作描述，如：批量删除文章、批量发布文章',
    
    -- 用户信息
    user_id BIGINT COMMENT '操作用户ID，关联users表，可为空（系统操作）',
    username VARCHAR(50) COMMENT '操作用户名，冗余字段，便于快速查询',
    user_role VARCHAR(20) COMMENT '用户角色：ADMIN、USER、AUTHOR等',
    
    -- 操作详情
    target_type VARCHAR(50) COMMENT '操作目标类型：ARTICLE、CATEGORY、TAG、USER等',
    target_ids TEXT COMMENT '操作目标ID列表，JSON格式存储，如：[1,2,3]',
    old_values JSON COMMENT '操作前的值，JSON格式存储',
    new_values JSON COMMENT '操作后的值，JSON格式存储',
    
    -- 请求信息
    method VARCHAR(10) COMMENT '请求方法：GET、POST、PUT、DELETE等',
    url VARCHAR(500) COMMENT '请求URL地址',
    ip_address VARCHAR(50) COMMENT '操作者IP地址',
    user_agent TEXT COMMENT '用户代理字符串，浏览器信息',
    
    -- 操作结果
    status TINYINT DEFAULT 1 COMMENT '操作状态：0-失败，1-成功',
    error_message TEXT COMMENT '错误信息，操作失败时记录',
    execution_time BIGINT COMMENT '执行耗时，单位毫秒',
    
    -- 额外信息
    reason VARCHAR(500) COMMENT '操作原因/备注',
    extra_data JSON COMMENT '额外数据，JSON格式',
    
    -- 时间戳
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    
    -- 索引定义
    INDEX idx_user_id (user_id) COMMENT '用户ID索引',
    INDEX idx_operation_type (operation_type) COMMENT '操作类型索引',
    INDEX idx_target_type (target_type) COMMENT '目标类型索引',
    INDEX idx_create_time (create_time DESC) COMMENT '创建时间索引，用于时间范围查询',
    INDEX idx_status (status) COMMENT '状态索引',
    INDEX idx_user_operation (user_id, operation_type, create_time DESC) COMMENT '用户操作复合索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统操作日志表，记录用户的各种操作行为和系统变更';

-- 插入一些测试数据（可选）
INSERT INTO operation_logs (operation_type, operation_desc, user_id, username, user_role, target_type, target_ids, reason, method, url, ip_address, status) 
VALUES 
('SYSTEM_INIT', '系统初始化', NULL, 'SYSTEM', 'SYSTEM', 'SYSTEM', '[]', '系统初始化操作日志表', 'POST', '/system/init', '127.0.0.1', 1);

-- 显示创建结果
SELECT 
    'Operation Logs Table Created Successfully!' as status,
    COUNT(*) as record_count
FROM operation_logs;
