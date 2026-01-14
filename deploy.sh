#!/bin/bash

# 部署脚本
# 用于快速部署到生产环境

set -e

echo "🚀 开始部署..."

# 检查环境变量
if [ ! -f "server/.env" ]; then
    echo "❌ 错误: server/.env 文件不存在"
    echo "请复制 server/.env.example 到 server/.env 并配置"
    exit 1
fi

# 构建后端
echo "📦 构建后端..."
cd server
npm install
npm run build
cd ..

# 构建前端
echo "📦 构建前端..."
npm install
npm run build

echo "✅ 构建完成！"
echo ""
echo "📝 下一步："
echo "1. 检查 dist/ 和 server/dist/ 目录"
echo "2. 配置生产环境变量"
echo "3. 启动服务："
echo "   - 后端: cd server && npm start"
echo "   - 前端: npm run preview"
echo ""
echo "或使用 Docker:"
echo "   docker-compose up -d"
