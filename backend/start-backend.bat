@echo off
echo ===============================================
echo 启动博客系统后端服务
echo ===============================================

:: 检查 MySQL 容器是否运行
echo 检查 MySQL 服务...
docker ps | findstr mysql-blog >nul
if errorlevel 1 (
    echo MySQL 容器未运行，请先启动 MySQL!
    echo 运行命令: docker start mysql-blog
    pause
    exit /b 1
)

:: 检查 Redis 容器是否运行
echo 检查 Redis 服务...
docker ps | findstr redis-blog >nul
if errorlevel 1 (
    echo Redis 容器未运行，请先启动 Redis!
    echo 运行命令: docker start redis-blog
    pause
    exit /b 1
)

echo.
echo 所有依赖服务已就绪，启动 Spring Boot 应用...
echo.

:: 启动 Spring Boot 应用
mvn spring-boot:run

pause
