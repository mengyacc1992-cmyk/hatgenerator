import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedTopic, SecondaryPoint, HatType, ImageDemand } from "../types.js";
import { getGeminiConfig, getFallbackModel } from "../config/gemini.js";

/**
 * Gemini API 服务
 * 使用 Gemini 3 Flash 进行快速生成和分析
 */
export class GeminiService {
  private ai: GoogleGenAI;
  private config: ReturnType<typeof getGeminiConfig>;
  private fallbackModel: string;

  constructor() {
    this.config = getGeminiConfig();
    this.fallbackModel = getFallbackModel();
    this.ai = new GoogleGenAI({ apiKey: this.config.apiKey });
  }

  /**
   * 生成内容（带错误处理和重试）
   */
  private async generateContentWithRetry(
    prompt: string,
    schema: any,
    useFallback: boolean = false
  ): Promise<string> {
    const model = useFallback ? this.fallbackModel : this.config.model;
    
    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        }
      });

      return response.text || '';
    } catch (error: any) {
      // 如果主模型失败且未使用备用模型，尝试备用模型
      if (!useFallback && (
        error.message?.includes('not found') ||
        error.message?.includes('not available')
      )) {
        console.warn(`⚠️  Model ${model} not available, trying fallback: ${this.fallbackModel}`);
        return this.generateContentWithRetry(prompt, schema, true);
      }
      
      throw error;
    }
  }

  /**
   * 解析 JSON 响应
   */
  private parseJsonResponse(text: string): any {
    try {
      const cleaned = text.replace(/```json\n?|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON Parse Error:", e, "Original text:", text);
      throw new Error("模型返回数据格式错误");
    }
  }

  /**
   * 生成选题方案
   */
  async generateTopic(
    selectedPoints: SecondaryPoint[],
    selectedHats: HatType[],
    context: {
      painPoint?: string;
      gender: string;
      faceType?: string;
      scenario?: string;
    }
  ): Promise<GeneratedTopic> {
    const pointsDesc = selectedPoints.length > 0
      ? selectedPoints.map(p => `${p.name}(${p.description})`).join(', ')
      : '根据参数自动匹配';
    
    const hatsDesc = selectedHats.length > 0
      ? selectedHats.map(h => `${h.name}(逻辑:${h.logic})`).join(', ')
      : '自动推荐最优解';

    const prompt = `你是一位懂审美、亲和力强的资深帽子搭配顾问。
请基于以下参数，生成一个专业但"说人话"的选题方案。

【目标人群】：${context.gender}
【基础脸型】：${context.faceType || '通用脸型/未指定'}
【生活场景】：${context.scenario || '通用场景/未指定'}
${context.painPoint ? `【用户困扰】：${context.painPoint}` : ''}
【搭配逻辑】：${pointsDesc}
【推荐帽型】：${hatsDesc}

文案准则：
1. 风格：日常、平实。像是设计师在手把手教朋友，而不是写教科书。
2. 禁用词：禁用"破译、拯救、绝美、YYDS、宝藏"等浮夸词。
3. 语言：用"显脸小"、"修饰头型"、"重心稳"替代"几何补偿"。
4. 标题：直击要点，建议使用疑问或痛点拆解式标题。

输出格式为 JSON (title, intro, logic, tags)。`;

    try {
      const responseText = await this.generateContentWithRetry(
        prompt,
        {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            intro: { type: Type.STRING },
            logic: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "intro", "logic", "tags"]
        }
      );

      return this.parseJsonResponse(responseText);
    } catch (error: any) {
      console.error("Generate Topic Error:", error);
      
      // 提供更详细的错误信息
      if (error.message?.includes('fetch failed') || error.message?.includes('network')) {
        throw new Error("网络连接失败，无法访问 Gemini API。请检查网络连接、VPN 设置或防火墙配置。");
      }
      if (error.message?.includes('PERMISSION_DENIED') || error.message?.includes('API_KEY_INVALID')) {
        throw new Error("API Key 无效或已过期，请检查 server/.env 中的 GEMINI_API_KEY 配置");
      }
      if (error.message?.includes('QUOTA_EXCEEDED')) {
        throw new Error("API 配额已用完，请检查 Google Cloud 项目的账单设置");
      }
      
      throw new Error(error.message || "生成选题失败");
    }
  }

  /**
   * 生成图片需求卡片
   */
  async generateImageDemands(topic: GeneratedTopic, count: number): Promise<ImageDemand[]> {
    const prompt = `你是一位专业的内容策划专家。请为选题方案《${topic.title}》规划一套完整的小红书"内容资产流"看板（共 ${count} 张卡片）。

请严格遵循以下视觉叙事逻辑进行卡片内容的线性规划，覆盖总计 ${count} 张：
1. **封面 (P1)**：锁定痛点，对比鲜明的标题。
2. **现状/错误示范 (P2-P3)**：揭示常见审美误区与比例失败的原因。
3. **结构深度拆解 (P4-P5)**：面部几何特征分析。
4. **核心原理/方法论 (P6)**：重心移动、比例拉伸的底层逻辑。
5. **最优解亮相 (P7)**：核心帽型展示。
6. **关键参数详解 (P8-P10)**：量化的细节（如帽檐、帽冠精确厘米数）。
7. **总结页 (最后一张)**：逻辑闭环。

输出格式为 JSON 数组，包含 id, mainCopy, modelDescription, hatDetails, angle, aestheticGoal。`;

    try {
      const responseText = await this.generateContentWithRetry(
        prompt,
        {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              mainCopy: { type: Type.STRING },
              modelDescription: { type: Type.STRING },
              hatDetails: { type: Type.STRING },
              angle: { type: Type.STRING },
              aestheticGoal: { type: Type.STRING }
            },
            required: ["id", "mainCopy", "modelDescription", "hatDetails", "angle", "aestheticGoal"]
          }
        }
      );

      return this.parseJsonResponse(responseText);
    } catch (error: any) {
      console.error("Generate Image Demands Error:", error);
      
      // 提供更详细的错误信息
      if (error.message?.includes('fetch failed') || error.message?.includes('network')) {
        throw new Error("网络连接失败，无法访问 Gemini API。请检查网络连接、VPN 设置或防火墙配置。");
      }
      if (error.message?.includes('PERMISSION_DENIED') || error.message?.includes('API_KEY_INVALID')) {
        throw new Error("API Key 无效或已过期，请检查 server/.env 中的 GEMINI_API_KEY 配置");
      }
      if (error.message?.includes('QUOTA_EXCEEDED')) {
        throw new Error("API 配额已用完，请检查 Google Cloud 项目的账单设置");
      }
      
      throw new Error(error.message || "生成图片需求失败");
    }
  }
}
