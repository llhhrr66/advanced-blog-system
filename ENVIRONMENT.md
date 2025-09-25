# 🔧 环境配置指南

## 📋 环境变量配置

在生产环境或本地开发中，请配置以下环境变量：

### 数据库配置
```env
DB_USERNAME=root
DB_PASSWORD=your_secure_password
```

### Redis配置
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### RabbitMQ配置（可选）
```env
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=admin
RABBITMQ_PASSWORD=your_rabbitmq_password
```

### Elasticsearch配置（可选）
```env
ELASTICSEARCH_URIS=http://localhost:9200
```

### JWT安全配置
```env
JWT_SECRET=your_super_secure_jwt_secret_key_at_least_32_characters
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000
```

### 其他配置
```env
UPLOAD_PATH=./uploads/
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
PROMETHEUS_ENABLED=true
RABBITMQ_HEALTH_CHECK=true
ELASTICSEARCH_HEALTH_CHECK=true
```

## 🚀 快速开始

### 1. 复制配置文件
```bash
# 复制配置模板
cp backend/src/main/resources/application-template.yml backend/src/main/resources/application.yml

# 编辑配置文件，替换相应的配置值
vim backend/src/main/resources/application.yml
```

### 2. Windows环境变量设置
```powershell
# 设置环境变量（PowerShell）
$env:DB_PASSWORD="your_password"
$env:JWT_SECRET="your_super_secure_jwt_secret_key_at_least_32_characters"
```

### 3. Linux/macOS环境变量设置
```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export DB_PASSWORD="your_password"
export JWT_SECRET="your_super_secure_jwt_secret_key_at_least_32_characters"

# 重新加载配置
source ~/.bashrc  # 或 source ~/.zshrc
```

### 4. Docker环境变量设置
在 `docker-compose.yml` 中已经包含了环境变量配置，您也可以创建 `.env` 文件：

```env
# .env文件（放在项目根目录）
DB_PASSWORD=your_password
JWT_SECRET=your_super_secure_jwt_secret_key_at_least_32_characters
REDIS_PASSWORD=your_redis_password
```

## 🔐 安全建议

1. **生产环境密码**：使用强密码，至少包含大小写字母、数字和特殊字符
2. **JWT密钥**：使用至少32字符的随机字符串
3. **数据库访问**：不要使用root用户，创建专用的数据库用户
4. **Redis认证**：在生产环境中启用Redis密码认证
5. **环境隔离**：开发、测试、生产环境使用不同的配置

## 🐳 Docker快速部署

```bash
# 使用Docker Compose快速启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
```

## 📊 监控配置

### Prometheus + Grafana
访问以下地址查看监控信息：
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin123456)

### API文档
- Swagger UI: http://localhost:8080/api/doc.html
- API文档: http://localhost:8080/api/swagger-ui/index.html

## 🔧 故障排查

### 常见问题
1. **数据库连接失败**：检查数据库服务是否启动，用户名密码是否正确
2. **Redis连接失败**：检查Redis服务状态和连接配置
3. **端口占用**：确保8080、3000等端口未被占用
4. **日志查看**：查看 `logs/blog-system.log` 文件获取详细错误信息

### 健康检查
访问 http://localhost:8080/api/actuator/health 查看服务健康状态

## 📞 技术支持

如果遇到配置问题，请查看：
1. 项目README.md文档
2. Spring Boot官方文档
3. 提交Issue到GitHub仓库
