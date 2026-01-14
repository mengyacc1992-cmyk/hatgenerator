<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 帽子美学选题生成器

这是一个专业的帽子美学选题生成应用，帮助用户根据面部特征、生活场景和痛点生成个性化的帽子搭配方案。

View your app in AI Studio: https://ai.studio/apps/drive/1UXASVQNXUBRvC1biIz4ujkT9BFUwF4XX

## 项目结构

```
hatgenerator/
├── server/          # 后端服务器 (Node.js + Express)
├── services/        # 前端服务层
├── App.tsx          # 主应用组件
└── ...
```

## 快速开始

### 前置要求

- Node.js (v18+)
- npm 或 yarn

### 1. 安装依赖

**前端：**
```bash
npm install
```

**后端：**
```bash
cd server
npm install
cd ..
```

### 2. 配置环境变量

**后端配置** (`server/.env`):
```bash
# 复制示例文件
cp server/.env.example server/.env

# 编辑 .env 文件，设置你的 Gemini API Key
GEMINI_API_KEY=AIzaSyDLlYQiiLFKHHISU6Dy9fMA96qknEywlOc
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**前端配置** (可选，`.env.local`):
```bash
# 如果后端不在 localhost:3001，可以设置自定义API地址
VITE_API_BASE_URL=http://localhost:3001
```

### 3. 运行应用

**启动后端服务器** (在 `server/` 目录):
```bash
cd server
npm run dev
```

后端将在 `http://localhost:3001` 启动。

**启动前端应用** (在项目根目录):
```bash
npm run dev
```

前端将在 `http://localhost:3000` 启动。

### 4. 访问应用

打开浏览器访问 `http://localhost:3000`

## 开发说明

### 后端 API

后端提供以下 API 端点：

- `POST /api/generate-topic` - 生成选题方案
- `POST /api/generate-image-demands` - 生成图片需求卡片
- `GET /api/health` - 健康检查

详细文档请查看 [server/README.md](server/README.md)

### 技术栈

**前端：**
- React 19
- TypeScript
- Vite

**后端：**
- Node.js + Express
- TypeScript
- Google Gemini API

## 部署

### 构建生产版本

**前端：**
```bash
npm run build
```

**后端：**
```bash
cd server
npm run build
npm start
```

## 注意事项

1. 确保后端服务器在运行，前端才能正常工作
2. Gemini API Key 需要配置在后端，前端不再直接访问 API
3. 生产环境请确保 CORS 配置正确
