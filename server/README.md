# Hat Generator Backend Server

这是帽子美学选题生成器的后端服务器，提供 RESTful API 来生成选题方案和图片需求。

## 功能特性

- ✅ 生成选题方案 (Generate Topic)
- ✅ 生成图片需求卡片 (Generate Image Demands)
- ✅ 健康检查端点
- ✅ CORS 支持
- ✅ 错误处理
- ✅ TypeScript 支持

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

创建 `.env` 文件（参考 `.env.example`）：

```bash
# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. 运行服务器

开发模式（使用 tsx watch）：
```bash
npm run dev
```

生产模式：
```bash
npm run build
npm start
```

服务器将在 `http://localhost:3001` 启动。

## API 端点

### POST /api/generate-topic

生成选题方案。

**请求体：**
```json
{
  "selectedPoints": [
    {
      "id": "s1-1",
      "name": "视觉重心上移",
      "description": "提升面部视觉中心"
    }
  ],
  "selectedHats": [
    {
      "id": "h1",
      "name": "硬顶棒球帽",
      "enName": "Structured Cap",
      "structure": "高挺冠部，大弧度硬檐",
      "logic": "通过强有力的硬质廓形强制拉高颅顶。",
      "suitableFor": ["圆脸", "阔面脸"],
      "avoidFor": ["极瘦削小脸"],
      "aestheticTags": ["利落", "高颅顶", "骨性增强"]
    }
  ],
  "context": {
    "painPoint": "脸大显胖",
    "gender": "通用人群",
    "faceType": "圆脸 (Round)",
    "scenario": "都市通勤 (Commute)"
  }
}
```

**响应：**
```json
{
  "title": "选题标题",
  "intro": "选题介绍",
  "logic": "搭配逻辑",
  "tags": ["标签1", "标签2"]
}
```

### POST /api/generate-image-demands

生成图片需求卡片。

**请求体：**
```json
{
  "topic": {
    "title": "选题标题",
    "intro": "选题介绍",
    "logic": "搭配逻辑",
    "tags": ["标签1", "标签2"]
  },
  "count": 12
}
```

**响应：**
```json
[
  {
    "id": 1,
    "mainCopy": "主文案",
    "modelDescription": "视觉策略描述",
    "hatDetails": "帽子细节",
    "angle": "拍摄角度",
    "aestheticGoal": "美学目标"
  }
]
```

### GET /api/health

健康检查端点。

**响应：**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "hasApiKey": true
}
```

## 项目结构

```
server/
├── src/
│   ├── index.ts           # 服务器入口
│   ├── routes/
│   │   └── api.ts        # API 路由
│   ├── services/
│   │   └── geminiService.ts  # Gemini API 服务
│   └── types.ts          # TypeScript 类型定义
├── package.json
├── tsconfig.json
└── README.md
```

## 技术栈

- **Node.js** + **Express** - Web 框架
- **TypeScript** - 类型安全
- **@google/genai** - Gemini API 客户端
- **CORS** - 跨域支持
- **dotenv** - 环境变量管理

## 注意事项

1. 确保 `GEMINI_API_KEY` 已正确配置
2. 确保 `CORS_ORIGIN` 与前端地址匹配
3. 生产环境建议使用环境变量管理工具（如 AWS Secrets Manager）
