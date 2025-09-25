# 📋 博客系统 - 文章管理接口文档

> **版本**: v1.0.0  
> **更新时间**: 2024-09-24  
> **基础路径**: `/api/articles`

## 🎯 页面原型设计

```
┌─────────────────────────────────────────────────────────────────────┐
│                        文章管理系统                                    │
├─────────────────────────────────────────────────────────────────────┤
│  [搜索框: 请输入文章标题或内容]  [🔍搜索]  [+ 新建文章]              │
│                                                                     │
│  状态：[全部▼] 分类：[全部▼] 作者：[全部▼] [高级筛选]                │
├─────────────────────────────────────────────────────────────────────┤
│  [批量操作▼] [☑] ID    标题         作者    分类   状态   发布时间   操作│
│           ☐  1   Spring Boot实战   张三   后端   已发布 2024-09-20  [编辑][删除]│
│           ☑  2   React入门指南     李四   前端   草稿   2024-09-19  [编辑][发布]│
│           ☐  3   MySQL优化技巧     王五   数据库 已发布 2024-09-18  [编辑][下架]│
│           ☐  4   Docker容器化      赵六   运维   已发布 2024-09-17  [编辑][删除]│
├─────────────────────────────────────────────────────────────────────┤
│                    [< 上一页] 1 2 3 ... 10 [下一页 >]                │
│                         共 95 条记录，每页显示 20 条                    │
└─────────────────────────────────────────────────────────────────────┘
```

## 📊 接口列表总览

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/articles` | 分页查询文章列表 | 登录用户 |
| GET | `/api/articles/{id}` | 获取文章详情 | 登录用户 |
| POST | `/api/articles` | 创建文章 | 作者权限 |
| PUT | `/api/articles/{id}` | 更新文章 | 作者本人/管理员 |
| DELETE | `/api/articles/{id}` | 删除文章 | 作者本人/管理员 |
| PATCH | `/api/articles/{id}/status` | 修改文章状态 | 作者本人/管理员 |
| POST | `/api/articles/batch` | 批量操作 | 管理员 |
| GET | `/api/articles/statistics` | 获取统计信息 | 登录用户 |
| GET | `/api/articles/options` | 获取筛选选项 | 登录用户 |

## 🔍 1. 分页查询文章列表

### 请求信息
```http
GET /api/articles?keyword=Spring&categoryId=1&status=1&authorId=2&pageNo=1&pageSize=10&sortBy=createTime&isAsc=false
```

### 请求参数（Query Parameters）
```typescript
interface ArticleQueryParams extends PageQuery {
  keyword?: string;        // 关键字搜索（标题+内容）
  categoryId?: number;     // 分类ID
  status?: number;         // 文章状态：0-草稿，1-已发布，2-已下架
  authorId?: number;       // 作者ID
  startTime?: string;      // 开始时间 YYYY-MM-DD
  endTime?: string;        // 结束时间 YYYY-MM-DD
  isTop?: boolean;         // 是否置顶
  isFeatured?: boolean;    // 是否精选
  // 继承分页参数
  pageNo: number;          // 页码，默认1
  pageSize: number;        // 每页大小，默认20
  sortBy?: string;         // 排序字段：createTime, publishTime, viewCount, likeCount
  isAsc?: boolean;         // 是否升序，默认false
}
```

### 响应数据
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "records": [
      {
        "id": 1,
        "title": "Spring Boot 3.0 新特性详解",
        "slug": "spring-boot-3-new-features",
        "summary": "Spring Boot 3.0带来了革命性的更新...",
        "coverImage": "https://example.com/cover1.jpg",
        "author": {
          "id": 2,
          "nickname": "技术小哥",
          "avatar": "https://example.com/avatar2.jpg"
        },
        "category": {
          "id": 1,
          "name": "后端开发",
          "slug": "backend"
        },
        "tags": [
          { "id": 1, "name": "Java", "color": "#f50" },
          { "id": 2, "name": "Spring Boot", "color": "#2db7f5" }
        ],
        "status": 1,
        "statusText": "已发布",
        "isTop": false,
        "isFeatured": true,
        "viewCount": 5234,
        "likeCount": 128,
        "commentCount": 32,
        "collectCount": 89,
        "publishTime": "2024-09-20T14:30:00",
        "createTime": "2024-09-20T10:00:00",
        "updateTime": "2024-09-20T14:30:00"
      }
    ],
    "total": 95,
    "current": 1,
    "size": 10,
    "pages": 10,
    "hasPrevious": false,
    "hasNext": true
  },
  "timestamp": 1727164800000
}
```

## 📖 2. 获取文章详情

### 请求信息
```http
GET /api/articles/1
```

### 路径参数
- `id`: 文章ID（必填）

### 响应数据
```json
{
  "code": 200,
  "message": "获取成功", 
  "data": {
    "id": 1,
    "title": "Spring Boot 3.0 新特性详解",
    "slug": "spring-boot-3-new-features",
    "content": "# Spring Boot 3.0 新特性详解\n\n## 1. Native Image支持...",
    "summary": "Spring Boot 3.0带来了革命性的更新...",
    "coverImage": "https://example.com/cover1.jpg",
    "author": {
      "id": 2,
      "nickname": "技术小哥",
      "avatar": "https://example.com/avatar2.jpg",
      "bio": "Java后端开发工程师"
    },
    "category": {
      "id": 1,
      "name": "后端开发",
      "slug": "backend",
      "description": "Java, Spring Boot, 微服务等后端技术"
    },
    "tags": [
      { "id": 1, "name": "Java", "slug": "java", "color": "#f50" },
      { "id": 2, "name": "Spring Boot", "slug": "spring-boot", "color": "#2db7f5" }
    ],
    "status": 1,
    "statusText": "已发布",
    "isTop": false,
    "isFeatured": true,
    "allowComment": true,
    "viewCount": 5234,
    "likeCount": 128,
    "commentCount": 32,
    "collectCount": 89,
    "shareCount": 15,
    "articleType": 1,
    "originalUrl": null,
    "readTime": 8,
    "wordCount": 3500,
    "keywords": "Spring Boot,Java,后端开发,Native Image,Jakarta EE",
    "metaDescription": "Spring Boot 3.0新特性详解，包含Native Image支持、自动配置优化等核心更新",
    "publishTime": "2024-09-20T14:30:00",
    "createTime": "2024-09-20T10:00:00",
    "updateTime": "2024-09-20T14:30:00"
  },
  "timestamp": 1727164800000
}
```

## ➕ 3. 创建文章

### 请求信息
```http
POST /api/articles
Content-Type: application/json
```

### 请求体
```json
{
  "title": "新文章标题",
  "slug": "new-article-slug",
  "content": "# 文章内容\n\n这是文章正文...",
  "summary": "文章摘要，可选，为空时自动提取",
  "coverImage": "https://example.com/cover.jpg",
  "categoryId": 1,
  "tagIds": [1, 2, 3],
  "status": 0,
  "isTop": false,
  "isFeatured": false,
  "allowComment": true,
  "articleType": 1,
  "originalUrl": null,
  "keywords": "关键词1,关键词2,关键词3",
  "metaDescription": "SEO描述",
  "publishTime": "2024-09-25T14:00:00"
}
```

### 字段说明
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | ✅ | 文章标题，5-200字符 |
| slug | string | ❌ | URL别名，为空时自动生成 |
| content | string | ❌ | 文章内容，Markdown格式 |
| summary | string | ❌ | 文章摘要，为空时自动提取前200字 |
| coverImage | string | ❌ | 封面图URL |
| categoryId | number | ❌ | 分类ID |
| tagIds | number[] | ❌ | 标签ID数组 |
| status | number | ❌ | 状态：0-草稿，1-发布，默认0 |
| isTop | boolean | ❌ | 是否置顶，默认false |
| isFeatured | boolean | ❌ | 是否精选，默认false |
| allowComment | boolean | ❌ | 是否允许评论，默认true |
| articleType | number | ❌ | 文章类型：1-原创，2-转载，3-翻译，默认1 |
| originalUrl | string | ❌ | 原文链接（转载/翻译时填写） |
| keywords | string | ❌ | SEO关键词，逗号分隔，最多10个 |
| metaDescription | string | ❌ | SEO描述，最大160字符 |
| publishTime | string | ❌ | 发布时间，支持定时发布 |

### 响应数据
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 123,
    "title": "新文章标题",
    "status": 0,
    "createTime": "2024-09-24T15:30:00"
  },
  "timestamp": 1727164800000
}
```

## ✏️ 4. 更新文章

### 请求信息
```http
PUT /api/articles/123
Content-Type: application/json
```

### 路径参数
- `id`: 文章ID（必填）

### 请求体
```json
{
  "title": "更新后的文章标题",
  "content": "# 更新后的内容...",
  "summary": "更新后的摘要",
  "coverImage": "https://example.com/new-cover.jpg",
  "categoryId": 2,
  "tagIds": [2, 3, 4],
  "status": 1,
  "isTop": true,
  "isFeatured": true,
  "allowComment": true,
  "keywords": "新关键词1,新关键词2",
  "metaDescription": "更新的SEO描述"
}
```

### 响应数据
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 123,
    "title": "更新后的文章标题",
    "status": 1,
    "updateTime": "2024-09-24T16:00:00"
  },
  "timestamp": 1727164800000
}
```

## 🗑️ 5. 删除文章

### 请求信息
```http
DELETE /api/articles/123
```

### 路径参数
- `id`: 文章ID（必填）

### 响应数据
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null,
  "timestamp": 1727164800000
}
```

## 🔄 6. 修改文章状态

### 请求信息
```http
PATCH /api/articles/123/status
Content-Type: application/json
```

### 请求体
```json
{
  "status": 1,
  "publishTime": "2024-09-25T09:00:00"
}
```

### 字段说明
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | number | ✅ | 目标状态：0-草稿，1-已发布，2-已下架 |
| publishTime | string | ❌ | 发布时间（发布时可指定） |

### 响应数据
```json
{
  "code": 200,
  "message": "状态修改成功",
  "data": {
    "id": 123,
    "status": 1,
    "statusText": "已发布",
    "publishTime": "2024-09-25T09:00:00"
  },
  "timestamp": 1727164800000
}
```

## 📦 7. 批量操作

### 请求信息
```http
POST /api/articles/batch
Content-Type: application/json
```

### 请求体
```json
{
  "operation": "publish",
  "articleIds": [1, 2, 3, 4, 5],
  "params": {
    "status": 1,
    "publishTime": "2024-09-25T10:00:00"
  }
}
```

### 操作类型说明
| 操作类型 | 说明 | params参数 |
|---------|------|------------|
| publish | 批量发布 | `{ "status": 1, "publishTime": "时间" }` |
| unpublish | 批量下架 | `{ "status": 2 }` |
| delete | 批量删除 | `{}` |
| setTop | 批量置顶 | `{ "isTop": true }` |
| setFeatured | 批量设为精选 | `{ "isFeatured": true }` |
| changeCategory | 批量更改分类 | `{ "categoryId": 数字 }` |

### 响应数据
```json
{
  "code": 200,
  "message": "批量操作完成",
  "data": {
    "successCount": 4,
    "failCount": 1,
    "failedIds": [3],
    "failReasons": {
      "3": "文章不存在或无权限操作"
    }
  },
  "timestamp": 1727164800000
}
```

## 📊 8. 获取统计信息

### 请求信息
```http
GET /api/articles/statistics
```

### 响应数据
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "totalCount": 156,
    "publishedCount": 89,
    "draftCount": 67,
    "unpublishedCount": 0,
    "todayCount": 5,
    "thisWeekCount": 23,
    "thisMonthCount": 78,
    "topCount": 8,
    "featuredCount": 15,
    "totalViews": 125678,
    "totalLikes": 5432,
    "totalComments": 1897,
    "totalCollects": 2341
  },
  "timestamp": 1727164800000
}
```

## 🎛️ 9. 获取筛选选项

### 请求信息
```http
GET /api/articles/options
```

### 响应数据
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "categories": [
      { "id": 1, "name": "后端开发", "articleCount": 45 },
      { "id": 2, "name": "前端开发", "articleCount": 32 },
      { "id": 3, "name": "架构设计", "articleCount": 18 }
    ],
    "authors": [
      { "id": 1, "nickname": "系统管理员", "articleCount": 12 },
      { "id": 2, "nickname": "技术小哥", "articleCount": 67 },
      { "id": 3, "nickname": "前端达人", "articleCount": 34 }
    ],
    "tags": [
      { "id": 1, "name": "Java", "useCount": 23 },
      { "id": 2, "name": "Spring Boot", "useCount": 18 },
      { "id": 3, "name": "React", "useCount": 15 }
    ],
    "statusOptions": [
      { "value": 0, "label": "草稿", "count": 67 },
      { "value": 1, "label": "已发布", "count": 89 },
      { "value": 2, "label": "已下架", "count": 0 }
    ]
  },
  "timestamp": 1727164800000
}
```

## ❌ 错误响应

### 通用错误格式
```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": null,
  "timestamp": 1727164800000
}
```

### 常见错误码
| 错误码 | 说明 | 解决方案 |
|-------|------|----------|
| 400 | 请求参数错误 | 检查请求参数格式和必填字段 |
| 401 | 未登录 | 请先登录 |
| 403 | 权限不足 | 检查用户权限 |
| 404 | 文章不存在 | 确认文章ID是否正确 |
| 409 | 文章标题或slug重复 | 修改标题或slug |
| 500 | 服务器内部错误 | 联系技术支持 |

## 🔧 前端集成示例

### React/JavaScript 调用示例
```typescript
// 文章查询
const fetchArticles = async (params: ArticleQueryParams) => {
  const response = await fetch(`/api/articles?${new URLSearchParams(params)}`);
  return response.json();
};

// 创建文章
const createArticle = async (article: ArticleCreateRequest) => {
  const response = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article)
  });
  return response.json();
};

// 批量操作
const batchOperation = async (operation: string, ids: number[], params?: any) => {
  const response = await fetch('/api/articles/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation, articleIds: ids, params })
  });
  return response.json();
};
```

## 📝 开发者备注

### 后端开发者需要创建的DTO/VO类：

1. **查询相关**：
   - `ArticleQueryDTO extends PageQuery`
   - `ArticlePageVO<ArticleListItemVO>`
   - `ArticleListItemVO`
   - `ArticleDetailVO`

2. **操作相关**：
   - `ArticleCreateDTO`
   - `ArticleUpdateDTO`
   - `ArticleStatusUpdateDTO`
   - `ArticleBatchOperationDTO`

3. **响应相关**：
   - `ArticleStatsVO`
   - `ArticleOptionsVO`
   - `CategoryOptionVO`
   - `AuthorOptionVO`

### 前端开发者需要关注的点：

1. **分页组件**：集成分页参数和响应
2. **搜索筛选**：实现关键字搜索和条件筛选
3. **批量操作**：实现批量选择和操作
4. **状态管理**：管理文章的各种状态
5. **权限控制**：根据用户权限显示不同操作

---

**🎯 下一步**：请根据此接口文档编写对应的DTO/VO类，我可以为你提供具体的Java代码实现！
