// 必须在其他导入之前加载环境变量和代理配置
import dotenv from 'dotenv';
dotenv.config();

// 配置网络（代理等）
import { setupGlobalProxy } from './config/network.js';
await setupGlobalProxy();

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// 中间件
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API 路由
app.use('/api', apiRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'Hat Generator API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      generateTopic: 'POST /api/generate-topic',
      generateImageDemands: 'POST /api/generate-image-demands'
    }
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// 错误处理中间件（必须在最后）
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for origin: ${CORS_ORIGIN}`);
  console.log(`🔑 API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // 生产环境提示
  if (process.env.NODE_ENV === 'production') {
    console.log(`✅ Production mode enabled`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  }
});
