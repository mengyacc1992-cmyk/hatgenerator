#!/bin/bash

echo "🔍 检查配置状态..."
echo ""

# 检查后端 .env 文件
echo "📋 后端配置检查:"
if [ ! -f "server/.env" ]; then
    echo "  ❌ server/.env 文件不存在"
    echo "  💡 运行: cp server/.env.example server/.env"
else
    echo "  ✅ server/.env 文件存在"
    
    # 检查 API Key
    if grep -q "GEMINI_API_KEY=your_gemini_api_key_here" server/.env; then
        echo "  ❌ API Key 未配置（仍是示例值）"
        echo "  💡 请编辑 server/.env，设置你的 GEMINI_API_KEY"
    elif grep -q "GEMINI_API_KEY=" server/.env; then
        API_KEY=$(grep "GEMINI_API_KEY=" server/.env | cut -d'=' -f2)
        if [ ${#API_KEY} -gt 20 ]; then
            echo "  ✅ API Key 已配置 (${#API_KEY} 字符)"
        else
            echo "  ⚠️  API Key 长度异常，请检查"
        fi
    else
        echo "  ❌ 未找到 GEMINI_API_KEY 配置"
    fi
    
    # 检查端口配置
    if grep -q "PORT=" server/.env; then
        PORT=$(grep "PORT=" server/.env | cut -d'=' -f2)
        echo "  ✅ 端口: $PORT"
    else
        echo "  ✅ 端口: 3001 (默认)"
    fi
fi

echo ""

# 检查依赖
echo "📦 依赖检查:"
if [ -d "node_modules" ]; then
    echo "  ✅ 前端依赖已安装"
else
    echo "  ❌ 前端依赖未安装"
    echo "  💡 运行: npm install"
fi

if [ -d "server/node_modules" ]; then
    echo "  ✅ 后端依赖已安装"
else
    echo "  ❌ 后端依赖未安装"
    echo "  💡 运行: cd server && npm install"
fi

echo ""

# 检查前端服务配置
echo "🌐 前端服务配置:"
if [ -f ".env.local" ] && grep -q "VITE_API_BASE_URL" .env.local; then
    API_URL=$(grep "VITE_API_BASE_URL" .env.local | cut -d'=' -f2)
    echo "  ✅ API 地址: $API_URL"
else
    echo "  ✅ API 地址: http://localhost:3001 (默认)"
fi

echo ""

# 总结
echo "📊 配置状态总结:"
ALL_OK=true

if [ ! -f "server/.env" ]; then
    ALL_OK=false
elif grep -q "GEMINI_API_KEY=your_gemini_api_key_here" server/.env; then
    ALL_OK=false
fi

if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ]; then
    ALL_OK=false
fi

if [ "$ALL_OK" = true ]; then
    echo "  ✅ 所有配置检查通过！"
    echo ""
    echo "🚀 可以启动服务了:"
    echo "   ./start.sh"
    echo "   或"
    echo "   终端1: cd server && npm run dev"
    echo "   终端2: npm run dev"
else
    echo "  ⚠️  还有配置需要完成，请根据上面的提示修复"
fi
