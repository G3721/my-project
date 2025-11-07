#!/bin/bash

echo "🕉️  启动瑜伽经学习网站..."
echo "================================"

# 检查是否有 Python
if command -v python3 &> /dev/null; then
    echo "✅ 发现 Python 3"
    echo "🌐 启动本地服务器在 http://localhost:8000"
    echo "📖 按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ 发现 Python 2"
    echo "🌐 启动本地服务器在 http://localhost:8000"
    echo "📖 按 Ctrl+C 停止服务器"
    echo ""
    python -m SimpleHTTPServer 8000
elif command -v node &> /dev/null; then
    echo "✅ 发现 Node.js"
    echo "🌐 启动本地服务器在 http://localhost:8080"
    echo "📖 按 Ctrl+C 停止服务器"
    echo ""
    npx http-server -p 8080
else
    echo "❌ 未找到 Python 或 Node.js"
    echo ""
    echo "请安装以下任一工具："
    echo "  • Python: https://www.python.org/downloads/"
    echo "  • Node.js: https://nodejs.org/"
    echo ""
    echo "或者直接在浏览器中打开 index.html 文件"
fi
