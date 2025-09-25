# Next.js 开发环境启动脚本
Write-Host "正在启动 Next.js 开发服务器..." -ForegroundColor Green

# 确保端口可用
$port = 3000
$processUsingPort = netstat -ano | Select-String ":$port " | Select-Object -First 1

if ($processUsingPort) {
    Write-Host "端口 $port 已被占用，将使用下一个可用端口" -ForegroundColor Yellow
}

# 启动开发服务器
Write-Host "启动命令: npm run dev" -ForegroundColor Cyan
npm run dev
