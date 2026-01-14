/**
 * Gemini API 配置
 */

export interface GeminiConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * 获取 Gemini 配置
 */
export function getGeminiConfig(): GeminiConfig {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required');
  }

  return {
    apiKey,
    // 优先使用 Gemini 3 Flash（更快）
    model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
    temperature: 0.7,
    maxTokens: 8192,
  };
}

/**
 * 获取备用模型（如果主模型不可用）
 */
export function getFallbackModel(): string {
  return 'gemini-1.5-flash';
}
