# Docker Desktop 配置指南

## 1. 确保Docker Desktop正确运行

### 步骤1：启动Docker Desktop
1. 从Windows开始菜单搜索"Docker Desktop"
2. 点击启动Docker Desktop应用
3. 等待Docker图标在系统托盘显示为运行状态（通常是一个鲸鱼图标）
4. 确保Docker Engine状态为"Running"（绿色）

### 步骤2：验证Docker安装
打开新的PowerShell或命令提示符窗口，运行：
```bash
docker --version
```

如果还是无法识别，请尝试：
1. 重启计算机
2. 重新打开PowerShell/命令提示符

## 2. 使用Docker Compose的两种方式

在新版Docker Desktop中，有两种方式使用docker-compose：

### 方式1：使用集成的docker compose（推荐）
```bash
# 注意：是 docker compose 而不是 docker-compose
cd D:\111GRBK\blog-system
docker compose up -d
```

### 方式2：安装独立的docker-compose
如果您想使用传统的 `docker-compose` 命令：

1. 下载docker-compose.exe：
   - 访问: https://github.com/docker/compose/releases
   - 下载最新版本的 `docker-compose-Windows-x86_64.exe`
   - 重命名为 `docker-compose.exe`
   - 放到 `C:\Windows\System32\` 或添加到PATH

2. 或者使用Python pip安装：
```bash
pip install docker-compose
```

## 3. 针对您的项目的启动步骤

### 选项A：使用Docker Desktop界面
从您的截图来看，您可以：
1. 在Docker Desktop中点击"Add New Container"
2. 或者使用命令行

### 选项B：分步启动服务（适合调试）

由于您是初次配置，建议先分步启动各个服务：

#### 1. 首先只启动MySQL和Redis
创建一个简化的配置文件 `docker-compose-dev.yml`：

```yaml
version: '3.8'

services:
  # MySQL数据库
  mysql:
    image: mysql:8.0
    container_name: blog-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root123456
      MYSQL_DATABASE: blog_system
      TZ: Asia/Shanghai
    ports:
      - "3306:3306"
    volumes:
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql

  # Redis缓存
  redis:
    image: redis:7-alpine
    container_name: blog-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
```

然后运行：
```bash
docker compose -f docker-compose-dev.yml up -d
```

#### 2. 验证服务状态
```bash
docker ps
```

#### 3. 本地启动前后端应用
```bash
# 启动后端（新窗口）
cd D:\111GRBK\blog-system\backend
mvn spring-boot:run

# 启动前端（新窗口）
cd D:\111GRBK\blog-system\frontend
npm install
npm run dev
```

## 4. 常见问题解决

### 问题1：端口被占用
如果遇到端口冲突（如3306、6379已被占用），修改docker-compose.yml中的端口映射：
```yaml
ports:
  - "3307:3306"  # 使用3307代替3306
```

### 问题2：Docker未运行
确保Docker Desktop在系统托盘中显示为运行状态

### 问题3：权限问题
以管理员身份运行PowerShell

## 5. Docker Desktop 快速操作

您可以直接在Docker Desktop界面中：
1. 搜索需要的镜像（mysql、redis等）
2. 点击"Run"创建容器
3. 配置环境变量和端口映射
4. 启动容器

## 6. 最简单的启动方式

如果Docker命令可用后，在项目根目录执行：
```bash
# 新版Docker Desktop
docker compose up -d

# 或者指定文件
docker compose -f docker-compose.yml up -d

# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f

# 停止所有服务
docker compose down
```

## 注意事项
- 确保Docker Desktop已分配足够的内存（建议至少4GB）
- Windows防火墙可能会提示允许Docker访问网络
- 首次拉取镜像可能需要较长时间
