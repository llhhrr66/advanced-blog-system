# 🚀 高级个人博客系统

一个展示技术深度的全栈博客系统，采用Spring Boot + Next.js构建，具备高并发处理能力和优雅的设计模式实现。

## ✨ 特性

- 📝 **博客管理**: 支持Markdown编辑、文章分类、标签管理
- 💯 **Java面试专题**: 完整的面试题库系统，包含热门大厂真题
- ⚡ **高并发架构**: Redis缓存、消息队列、数据库读写分离
- 🔍 **全文搜索**: 基于Elasticsearch的智能搜索
- 📊 **监控系统**: Prometheus + Grafana实时监控
- 🐳 **容器化部署**: Docker Compose一键部署

## 🛠 技术栈

### 后端
- Spring Boot 3.x
- MyBatis Plus
- MySQL 8.0
- Redis 7.x
- Elasticsearch 8.x
- RabbitMQ
- JWT认证

### 前端
- Next.js 14
- React 18
- TypeScript
- Ant Design 5
- Tailwind CSS
- Zustand

## 📦 项目结构

```
blog-system/
├── backend/          # Spring Boot后端
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/         # Next.js前端
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── database/         # 数据库脚本
│   └── init.sql
├── docker/          # Docker配置
└── docker-compose.yml
```

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Java 17+
- Docker & Docker Compose
- Maven 3.8+

### 本地开发

#### 1. 克隆项目
```bash
git clone https://github.com/llhhrr66/advanced-blog-system.git
cd advanced-blog-system
```

#### 2. 启动后端

```bash
# 进入后端目录
cd backend

# 安装依赖
mvn clean install

# 启动应用（需要先启动MySQL和Redis）
mvn spring-boot:run
```

后端将在 http://localhost:8080 启动

#### 3. 启动前端

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将在 http://localhost:3000 启动

### Docker部署

使用Docker Compose一键部署所有服务：

```bash
# 在项目根目录执行
docker-compose up -d
```

服务访问地址：
- 前端应用: http://localhost:3000
- 后端API: http://localhost:8080
- Swagger文档: http://localhost:8080/swagger-ui.html
- RabbitMQ管理界面: http://localhost:15672 (admin/admin123456)
- Elasticsearch: http://localhost:9200
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin123456)

## 📝 API文档

启动后端服务后，访问 http://localhost:8080/swagger-ui.html 查看完整API文档。

### 主要接口

#### 文章相关
- `GET /api/articles` - 获取文章列表
- `GET /api/articles/{id}` - 获取文章详情
- `POST /api/articles` - 创建文章
- `PUT /api/articles/{id}` - 更新文章
- `DELETE /api/articles/{id}` - 删除文章

#### 面试题相关
- `GET /api/interview/questions` - 获取面试题列表
- `GET /api/interview/questions/{id}` - 获取题目详情
- `POST /api/interview/answers` - 提交答案
- `GET /api/interview/statistics` - 获取答题统计

## 🔧 配置说明

### 后端配置

修改 `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog_system
    username: root
    password: your_password
  
  redis:
    host: localhost
    port: 6379
```

### 前端配置

修改 `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 环境变量配置

为保障安全性，请在部署前配置以下环境变量：

```bash
# 复制配置模板
cp backend/src/main/resources/application-template.yml backend/src/main/resources/application.yml

# 设置环境变量
export DB_PASSWORD="your_secure_password"
export JWT_SECRET="your_super_secure_jwt_secret_key_at_least_32_characters"
export REDIS_PASSWORD="your_redis_password"
```

详细配置请参考 [ENVIRONMENT.md](./ENVIRONMENT.md) 文档。

## 📊 性能优化

### 缓存策略
- 多级缓存：本地缓存(Caffeine) + Redis缓存
- 缓存预热：系统启动时自动加载热点数据
- 缓存更新：采用Cache Aside模式

### 数据库优化
- 读写分离：主从复制架构
- 索引优化：合理创建索引
- SQL优化：避免全表扫描

### 并发控制
- 限流：基于Redis的滑动窗口限流
- 熔断：Spring Cloud Circuit Breaker
- 异步处理：消息队列解耦

## 🧪 测试

### 单元测试
```bash
cd backend
mvn test
```

### 前端测试
```bash
cd frontend
npm run test
```

## 📈 监控

系统集成了Prometheus + Grafana监控方案：

1. 访问 Grafana: http://localhost:3001
2. 默认账号: admin/admin123456
3. 导入预设的Dashboard查看系统指标

## 🤝 贡献

欢迎提交Pull Request或Issue！

## 📄 许可证

MIT License

## 👥 联系方式

- 作者: Advanced Blog System
- GitHub: https://github.com/llhhrr66/advanced-blog-system
- Issues: https://github.com/llhhrr66/advanced-blog-system/issues

---

⭐ 如果这个项目对您有帮助，请给一个Star！
