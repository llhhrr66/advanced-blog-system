@echo off
echo 正在初始化数据库...
docker exec -i blog-mysql mysql -uroot -proot123456 < init.sql
echo 数据库初始化完成！
pause
