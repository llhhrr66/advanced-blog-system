---
title: MySQL数据库优化面试题
tags: 
  - MySQL
  - 数据库优化
  - 索引
  - 面试题
date: 2025-09-22
updated: 2025-09-25
---

# MySQL数据库优化面试题

## 1. ✅ MySQL索引原理是什么？

### 索引类型
- **B+树索引**：最常用，适合范围查询
- **Hash索引**：等值查询快，不支持范围查询
- **全文索引**：用于全文搜索

### B+树特点
```sql
-- 创建索引
CREATE INDEX idx_user_age ON users(age);
CREATE UNIQUE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_name_age ON users(name, age); -- 组合索引

-- 查看索引使用情况
EXPLAIN SELECT * FROM users WHERE age > 25;
```

## 2. ✅ 如何优化慢查询？

### 优化步骤
1. **开启慢查询日志**
```sql
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

2. **使用EXPLAIN分析**
```sql
EXPLAIN SELECT * FROM orders o 
JOIN users u ON o.user_id = u.id 
WHERE o.status = 'completed';
```

3. **优化策略**
- 添加合适索引
- 优化查询语句
- 避免SELECT *
- 使用LIMIT限制结果集
- 合理使用JOIN

## 3. 数据库事务隔离级别

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
|---------|-----|-----------|------|
| READ UNCOMMITTED | 可能 | 可能 | 可能 |
| READ COMMITTED | 不可能 | 可能 | 可能 |
| REPEATABLE READ | 不可能 | 不可能 | 可能 |
| SERIALIZABLE | 不可能 | 不可能 | 不可能 |

### 设置隔离级别
```sql
-- 查看当前隔离级别
SELECT @@transaction_isolation;

-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

## 4. ⭐️ 分库分表策略

### 垂直分库
- 按业务模块拆分
- 用户库、订单库、商品库

### 水平分表
- 按数据量拆分
- 按ID取模：user_0, user_1, user_2
- 按时间范围：order_202501, order_202502

### 分片策略
```java
// 简单取模
int tableIndex = userId % tableCount;
String tableName = "user_" + tableIndex;

// 一致性Hash
int hash = consistentHash(userId);
String tableName = getTableByHash(hash);
```

#数据库 #MySQL #优化
