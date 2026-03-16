#!/bin/bash

# 光之契约·精灵森境 - 快速启动脚本

echo "🌟 光之契约·精灵森境 - 启动向导"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js >= 18.0.0"
    exit 1
fi

echo "✅ Node.js 版本：$(node -v)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未检测到 npm，请先安装 npm >= 9.0.0"
    exit 1
fi

echo "✅ npm 版本：$(npm -v)"
echo ""

# 检查 MongoDB
echo "📦 检查 MongoDB 连接..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        echo "✅ MongoDB 已连接"
    else
        echo "⚠️  MongoDB 未运行，请先启动 MongoDB 服务"
        echo "   macOS: brew services start mongodb-community"
        echo "   Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
        exit 1
    fi
else
    echo "⚠️  未找到 mongosh，请确保 MongoDB 已安装并运行"
fi

echo ""

# 检查依赖
echo "📦 检查项目依赖..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  依赖未安装，开始安装..."
    npm run install:all
else
    echo "✅ 依赖已安装"
fi

echo ""

# 检查环境变量
if [ ! -f "server/.env" ]; then
    echo "⚠️  服务器环境变量未配置，从模板复制..."
    cp server/.env.example server/.env
    echo "✅ 已创建 server/.env，请根据实际情况修改配置"
fi

echo ""
echo "🚀 准备启动开发服务器..."
echo ""
echo "学生端：http://localhost:3000"
echo "教师端：http://localhost:3001"
echo "后端：http://localhost:4000"
echo ""

# 启动服务
npm run dev
