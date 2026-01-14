import express from 'express';
import { GeminiService } from '../services/geminiService.js';
import { GenerateTopicRequest, GenerateImageDemandsRequest } from '../types.js';
import { validateGenerateTopic, validateGenerateImageDemands } from '../middleware/validator.js';
import { getGeminiConfig } from '../config/gemini.js';

const router = express.Router();

// 创建 GeminiService 实例（单例模式）
let geminiService: GeminiService | null = null;

const getGeminiService = (): GeminiService => {
  if (!geminiService) {
    geminiService = new GeminiService();
  }
  return geminiService;
};

/**
 * POST /api/generate-topic
 * 生成选题方案
 */
router.post('/generate-topic', validateGenerateTopic, async (req, res, next) => {
  try {
    const { selectedPoints, selectedHats, context }: GenerateTopicRequest = req.body;
    
    const service = getGeminiService();
    const topic = await service.generateTopic(selectedPoints, selectedHats, context);

    res.json(topic);
  } catch (error: any) {
    next(error); // 传递给错误处理中间件
  }
});

/**
 * POST /api/generate-image-demands
 * 生成图片需求卡片
 */
router.post('/generate-image-demands', validateGenerateImageDemands, async (req, res, next) => {
  try {
    const { topic, count }: GenerateImageDemandsRequest = req.body;
    
    const service = getGeminiService();
    const demands = await service.generateImageDemands(topic, count);

    res.json(demands);
  } catch (error: any) {
    next(error); // 传递给错误处理中间件
  }
});

/**
 * GET /api/health
 * 健康检查端点
 */
router.get('/health', (req, res) => {
  let model = 'unknown';
  try {
    const config = getGeminiConfig();
    model = config.model;
  } catch (e) {
    // API Key 未配置
  }
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.GEMINI_API_KEY,
    model: model
  });
});

export default router;
