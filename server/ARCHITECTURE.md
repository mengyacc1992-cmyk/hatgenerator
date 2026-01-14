# 🏗️ 后端架构设计文档

## 设计目标

1. **简洁可靠**：减少依赖，简化配置
2. **适配 Cursor 环境**：充分利用 Cursor 的网络和 API 能力
3. **使用 Gemini 3 Flash**：更快的响应速度
4. **优雅降级**：支持多种网络环境

## 架构概览

```
┌─────────────┐
│   前端      │
│  (React)    │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────────────────────┐
│        后端 API 层               │
│  ┌───────────────────────────┐  │
│  │   Express Server          │  │
│  │   - 路由处理              │  │
│  │   - 请求验证              │  │
│  │   - 错误处理              │  │
│  └───────────┬───────────────┘  │
│              │                   │
│  ┌───────────▼───────────────┐  │
│  │   Gemini Service          │  │
│  │   - 使用 Gemini 3 Flash   │  │
│  │   - 智能重试              │  │
│  │   - 网络适配              │  │
│  └───────────┬───────────────┘  │
└──────────────┼──────────────────┘
               │
               ▼
        ┌─────────────┐
        │ Gemini API  │
        │ (Google)    │
        └─────────────┘
```

## 核心设计原则

### 1. 网络层设计
- **优先使用系统代理**：自动检测并使用系统代理设置
- **支持环境变量配置**：通过 .env 配置代理
- **优雅降级**：如果代理失败，尝试直接连接
- **智能重试**：网络错误时自动重试

### 2. 模型选择
- **主要使用**：`gemini-3-flash-preview`（快速响应）
- **备用方案**：`gemini-1.5-flash`（如果 3 Flash 不可用）

### 3. 错误处理
- **分层错误处理**：网络层、API 层、业务层
- **友好错误消息**：中文错误提示
- **详细日志**：便于调试

### 4. 性能优化
- **请求缓存**：相同请求缓存结果
- **并发控制**：限制并发请求数
- **超时控制**：设置合理的超时时间

## 技术栈

- **运行时**：Node.js 18+
- **框架**：Express
- **语言**：TypeScript
- **AI SDK**：@google/genai
- **网络**：原生 fetch（支持代理）

## 目录结构

```
server/
├── src/
│   ├── index.ts              # 服务器入口
│   ├── config/
│   │   ├── network.ts        # 网络配置（代理、超时等）
│   │   └── gemini.ts         # Gemini API 配置
│   ├── services/
│   │   ├── geminiService.ts  # Gemini API 服务（核心）
│   │   └── cacheService.ts   # 缓存服务（可选）
│   ├── routes/
│   │   └── api.ts            # API 路由
│   ├── middleware/
│   │   ├── errorHandler.ts   # 错误处理中间件
│   │   └── validator.ts      # 请求验证中间件
│   └── types/
│       └── index.ts           # 类型定义
├── package.json
├── tsconfig.json
└── .env
```

## API 设计

### POST /api/generate-topic
生成选题方案

**请求体：**
```typescript
{
  selectedPoints: SecondaryPoint[];  // 修饰逻辑点
  selectedHats: HatType[];           // 选择的帽型
  context: {
    painPoint?: string;              // 痛点
    gender: string;                  // 性别
    faceType?: string;               // 脸型
    scenario?: string;                // 场景
  }
}
```

**响应：**
```typescript
{
  title: string;
  intro: string;
  logic: string;
  tags: string[];
}
```

### POST /api/generate-image-demands
生成图片需求卡片

**请求体：**
```typescript
{
  topic: GeneratedTopic;
  count: number;  // 卡片数量
}
```

**响应：**
```typescript
ImageDemand[]
```

### GET /api/health
健康检查

**响应：**
```typescript
{
  status: 'ok';
  timestamp: string;
  hasApiKey: boolean;
  model: string;  // 使用的模型
}
```

## 网络配置策略

### 优先级顺序：
1. **系统代理**（如果 VPN 启用了 Tun 模式）
2. **环境变量代理**（HTTP_PROXY/HTTPS_PROXY）
3. **直接连接**（如果代理不可用）

### 实现方式：
- 使用 `undici` 或配置 fetch 的代理
- 或者使用 `https-proxy-agent` 等库
- 支持 SOCKS 和 HTTP 代理

## 错误处理策略

### 网络错误：
- 自动重试（最多 3 次）
- 指数退避
- 清晰的错误消息

### API 错误：
- 区分不同类型的错误（权限、配额、网络等）
- 提供解决建议

## 性能优化

1. **请求去重**：相同参数的请求只发送一次
2. **结果缓存**：短期缓存（5 分钟）
3. **并发限制**：最多 3 个并发请求
4. **超时设置**：30 秒超时

## 部署考虑

- **环境变量**：所有配置通过环境变量
- **日志**：结构化日志输出
- **监控**：健康检查端点
- **扩展性**：易于添加新功能
