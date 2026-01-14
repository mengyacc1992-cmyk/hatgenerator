import { Request, Response, NextFunction } from 'express';
import { GenerateTopicRequest, GenerateImageDemandsRequest } from '../types.js';

/**
 * 验证生成选题请求
 */
export function validateGenerateTopic(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { selectedPoints, selectedHats, context } = req.body as GenerateTopicRequest;

  if (!context) {
    return res.status(400).json({
      error: 'Missing required field: context'
    });
  }

  if (!context.gender) {
    return res.status(400).json({
      error: 'Missing required field: context.gender'
    });
  }

  if (!Array.isArray(selectedPoints)) {
    return res.status(400).json({
      error: 'selectedPoints must be an array'
    });
  }

  if (!Array.isArray(selectedHats)) {
    return res.status(400).json({
      error: 'selectedHats must be an array'
    });
  }

  next();
}

/**
 * 验证生成图片需求请求
 */
export function validateGenerateImageDemands(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { topic, count } = req.body as GenerateImageDemandsRequest;

  if (!topic) {
    return res.status(400).json({
      error: 'Missing required field: topic'
    });
  }

  if (!topic.title || !topic.intro || !topic.logic || !topic.tags) {
    return res.status(400).json({
      error: 'Invalid topic format'
    });
  }

  if (!count || typeof count !== 'number' || count < 1 || count > 50) {
    return res.status(400).json({
      error: 'count must be a number between 1 and 50'
    });
  }

  next();
}
