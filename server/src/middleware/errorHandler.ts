import { Request, Response, NextFunction } from 'express';

/**
 * 错误处理中间件
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // 处理特定的错误类型
  if (err.message?.includes('网络连接失败')) {
    return res.status(503).json({
      error: '网络连接失败',
      message: err.message,
      suggestion: '请检查 VPN 连接或网络设置'
    });
  }

  if (err.message?.includes('API Key')) {
    return res.status(403).json({
      error: 'API Key 错误',
      message: err.message,
      suggestion: '请检查 server/.env 中的 GEMINI_API_KEY 配置'
    });
  }

  if (err.message?.includes('配额')) {
    return res.status(429).json({
      error: 'API 配额已用完',
      message: err.message,
      suggestion: '请检查 Google Cloud 项目的账单设置'
    });
  }

  // 默认错误
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    message: err.message || '服务器内部错误'
  });
}
