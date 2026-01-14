#!/bin/bash

# 启动脚本 - 同时启动前端和后端

echo "🚀 启动帽子美学选题生成器..."

# 检查后端 .env 文件
if [ ! -f "server/.env" ]; then
    echo "⚠️  警告: server/.env 文件不存在"
    echo "请复制 server/.env.example 到 server/.env 并配置 GEMINI_API_KEY"
    exit 1
fi

# 启动后端服务器
echo "📡 启动后端服务器 (端口 3001)..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 启动前端
echo "🎨 启动前端应用 (端口 3000)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ 服务已启动!"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait
