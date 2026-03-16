#!/bin/bash

# 光之契约·精灵森境 - 快速部署脚本

echo "🚀 光之契约·精灵森境 - 部署脚本"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js 18+"
    echo "   下载地址：https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本：$(node -v)"
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
    echo ""
fi

# 启动服务
echo "🎮 正在启动服务..."
echo ""
echo "服务启动后，访问："
echo "  👨‍ 学生端：http://localhost:3000"
echo "  👩‍ 教师端：http://localhost:3001"
echo "  📡 后端 API: http://localhost:4000"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

npm run dev
