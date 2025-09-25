# 面试题管理API使用指南

本文档描述了面试题管理系统的后端API接口，包括面试题CRUD、分类管理、批量导入等功能。

## API基础信息

- **基础URL**: `http://localhost:8080/api`
- **数据格式**: JSON
- **响应格式**: 统一的Result包装格式

### 统一响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}, 
  "success": true,
  "timestamp": "2024-01-01T12:00:00"
}
```

## 面试题管理 API

### 1. 分页查询面试题

**请求方式**: `GET /interview/questions`

**请求参数**:
- `pageNum` (可选): 页码，默认1
- `pageSize` (可选): 每页大小，默认10
- `categoryId` (可选): 分类ID
- `difficulty` (可选): 难度等级（1-简单，2-中等，3-困难）
- `status` (可选): 状态（0-禁用，1-启用）
- `keyword` (可选): 关键词搜索

**示例**:
```bash
GET /api/interview/questions?pageNum=1&pageSize=10&categoryId=1&difficulty=2
```

### 2. 查询面试题详情

**请求方式**: `GET /interview/questions/{id}`

**路径参数**:
- `id`: 面试题ID

**示例**:
```bash
GET /api/interview/questions/1
```

### 3. 创建面试题

**请求方式**: `POST /interview/questions`

**请求体**:
```json
{
  "categoryId": 1,
  "title": "Java中的多态性是什么？",
  "content": "## 问题描述\n请解释Java中的多态性...",
  "difficulty": 2,
  "source": "经典面试题",
  "sourceUrl": "https://example.com",
  "sortOrder": 0
}
```

### 4. 更新面试题

**请求方式**: `PUT /interview/questions/{id}`

**路径参数**:
- `id`: 面试题ID

**请求体**: (所有字段都是可选的)
```json
{
  "categoryId": 2,
  "title": "更新后的标题",
  "content": "更新后的内容",
  "difficulty": 3,
  "status": 1,
  "sortOrder": 10
}
```

### 5. 删除面试题

**请求方式**: `DELETE /interview/questions/{id}`

**路径参数**:
- `id`: 面试题ID

### 6. 批量删除面试题

**请求方式**: `DELETE /interview/questions/batch`

**请求体**:
```json
{
  "ids": [1, 2, 3]
}
```

### 7. 更新面试题状态

**请求方式**: `PATCH /interview/questions/{id}/status`

**路径参数**:
- `id`: 面试题ID

**请求体**:
```json
{
  "status": 1
}
```

### 8. 批量更新面试题状态

**请求方式**: `PATCH /interview/questions/batch/status`

**请求体**:
```json
{
  "ids": [1, 2, 3],
  "status": 1
}
```

### 9. 批量更新面试题分类

**请求方式**: `POST /interview/questions/batch-category`

**请求参数**:
- `categoryId`: 新的分类ID

**请求体**:
```json
[1, 2, 3]
```

### 10. 随机获取面试题

**请求方式**: `GET /interview/questions/random`

**请求参数**:
- `count` (可选): 获取数量，默认5
- `categoryId` (可选): 分类ID
- `difficulty` (可选): 难度等级

**示例**:
```bash
GET /api/interview/questions/random?count=10&categoryId=1
```

### 11. 根据分类获取面试题

**请求方式**: `GET /interview/questions/category/{categoryId}`

**路径参数**:
- `categoryId`: 分类ID

## 面试题分类管理 API

### 1. 获取所有分类

**请求方式**: `GET /interview/categories`

### 2. 获取启用的分类

**请求方式**: `GET /interview/categories/enabled`

### 3. 查询分类详情

**请求方式**: `GET /interview/categories/{id}`

**路径参数**:
- `id`: 分类ID

### 4. 创建分类

**请求方式**: `POST /interview/categories`

**请求体**:
```json
{
  "categoryName": "新分类",
  "description": "分类描述",
  "sortOrder": 0
}
```

### 5. 更新分类

**请求方式**: `PUT /interview/categories/{id}`

**路径参数**:
- `id`: 分类ID

**请求体**: (所有字段都是可选的)
```json
{
  "categoryName": "更新后的分类名",
  "description": "更新后的描述",
  "status": 1,
  "sortOrder": 10
}
```

### 6. 删除分类

**请求方式**: `DELETE /interview/categories/{id}`

**路径参数**:
- `id`: 分类ID

### 7. 更新分类状态

**请求方式**: `PATCH /interview/categories/{id}/status`

**路径参数**:
- `id`: 分类ID

**请求体**:
```json
{
  "status": 1
}
```

### 8. 批量删除分类

**请求方式**: `POST /interview/categories/batch-delete`

**请求体**:
```json
[1, 2, 3]
```

### 9. 批量更新分类状态

**请求方式**: `POST /interview/categories/batch-status`

**请求体**:
```json
{
  "ids": [1, 2, 3],
  "status": 1
}
```

### 10. 搜索分类

**请求方式**: `GET /interview/categories/search`

**请求参数**:
- `keyword`: 搜索关键词

### 11. 检查分类名称是否存在

**请求方式**: `GET /interview/categories/check-name`

**请求参数**:
- `name`: 分类名称
- `excludeId` (可选): 排除的分类ID

## 批量导入 API

### 1. 扫描目录

**请求方式**: `POST /import/scan`

**请求体**:
```json
{
  "directory": "/path/to/markdown/files"
}
```

### 2. 批量导入

**请求方式**: `POST /import/batch`

**请求体**:
```json
{
  "files": [...],
  "config": {
    "mode": "skip",
    "createCategories": true,
    "createTags": true,
    "preserveTime": false,
    "defaultStatus": 1,
    "batchSize": 100
  }
}
```

### 3. 获取导入进度

**请求方式**: `GET /import/progress/{taskId}`

**路径参数**:
- `taskId`: 任务ID

### 4. 取消导入

**请求方式**: `POST /import/cancel/{taskId}`

**路径参数**:
- `taskId`: 任务ID

### 5. 验证文件

**请求方式**: `POST /import/validate`

**请求体**: 文件信息对象

## 数据库表结构

系统使用以下两个主要数据库表：

### interview_category (面试题分类表)
- `id`: 分类ID (主键)
- `name`: 分类名称 (唯一)
- `description`: 分类描述
- `status`: 状态 (0-禁用，1-启用)
- `sort_order`: 排序
- `create_time`: 创建时间
- `update_time`: 更新时间
- `deleted`: 逻辑删除标记

### interview_question (面试题表)
- `id`: 题目ID (主键)
- `category_id`: 分类ID (外键)
- `title`: 题目标题
- `content`: 题目内容 (Markdown格式)
- `difficulty`: 难度等级 (1-简单，2-中等，3-困难)
- `status`: 状态 (0-禁用，1-启用)
- `source`: 来源
- `source_url`: 来源URL
- `sort_order`: 排序
- `view_count`: 查看次数
- `favorite_count`: 收藏次数
- `create_time`: 创建时间
- `update_time`: 更新时间
- `deleted`: 逻辑删除标记

## 启动和部署

1. **环境要求**:
   - Java 8+
   - MySQL 5.7+
   - Maven 3.6+

2. **数据库初始化**:
   ```sql
   -- 执行 src/main/resources/sql/interview_tables.sql
   ```

3. **配置文件**:
   - 修改 `application.yml` 中的数据库连接信息

4. **启动应用**:
   ```bash
   mvn spring-boot:run
   ```

5. **访问文档**:
   - Swagger UI: http://localhost:8080/api/doc.html

## 测试API

可以使用以下测试接口验证服务是否正常启动：

```bash
# 健康检查
GET http://localhost:8080/api/test/ping

# 时间测试
GET http://localhost:8080/api/test/time
```

## 错误码说明

- `200`: 操作成功
- `400`: 参数错误
- `404`: 资源不存在
- `500`: 服务器内部错误

## 注意事项

1. 所有的删除操作都是逻辑删除，不会物理删除数据
2. 分类下有面试题时无法删除分类
3. 面试题内容支持Markdown格式
4. 批量操作有数量限制，建议单次不超过1000条
5. 搜索功能支持标题和内容的模糊匹配
