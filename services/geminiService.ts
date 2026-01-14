
import { GeneratedTopic, SecondaryPoint, HatType, ImageDemand } from "../types";
import { GoogleGenAI, Type } from "@google/genai";

// 检查是否在 Cursor 环境中，可以使用 Cursor 的 API Key
const isCursorEnv = typeof window !== 'undefined' && (window as any).aistudio;

// 后端API基础URL（如果使用后端方案）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * 获取 API Key（优先使用 Cursor 注入的）
 */
async function getApiKey(): Promise<string | null> {
  // 方案1: 尝试从 Cursor 获取 API Key
  if (isCursorEnv && (window as any).aistudio) {
    try {
      // 检查 Cursor 是否提供了 API Key 访问方式
      const aistudio = (window as any).aistudio;
      if (aistudio.getApiKey) {
        return await aistudio.getApiKey();
      }
      // 或者从环境变量获取（Cursor 可能已经注入）
      if (process.env.API_KEY || process.env.GEMINI_API_KEY) {
        return process.env.API_KEY || process.env.GEMINI_API_KEY || null;
      }
    } catch (e) {
      console.warn('无法从 Cursor 获取 API Key:', e);
    }
  }
  return null;
}

/**
 * 调用 Gemini API 生成选题方案
 * 优先使用前端直接调用（如果 Cursor 提供了 API Key），否则使用后端
 */
export const generateTopicLogic = async (
  selectedPoints: SecondaryPoint[], 
  selectedHats: HatType[], 
  context: { 
    painPoint?: string, 
    gender: string, 
    faceType?: string, 
    scenario?: string 
  }
): Promise<GeneratedTopic> => {
  // 尝试使用前端直接调用（如果 Cursor 提供了 API Key）
  const apiKey = await getApiKey();
  
  if (apiKey) {
    try {
      console.log('使用前端直接调用 Gemini API');
      const ai = new GoogleGenAI({ apiKey });
      
      const pointsDesc = selectedPoints.map(p => `${p.name}(${p.description})`).join(', ');
      const hatsDesc = selectedHats.map(h => `${h.name}(逻辑:${h.logic})`).join(', ');
      
      const prompt = `你是一位懂审美、亲和力强的资深帽子搭配顾问。
请基于以下参数，生成一个专业但"说人话"的选题方案。

【目标人群】：${context.gender}
【基础脸型】：${context.faceType || '通用脸型/未指定'}
【生活场景】：${context.scenario || '通用场景/未指定'}
${context.painPoint ? `【用户困扰】：${context.painPoint}` : ''}
【搭配逻辑】：${pointsDesc || '根据参数自动匹配'}
【推荐帽型】：${hatsDesc || '自动推荐最优解'}

文案准则：
1. 风格：日常、平实。像是设计师在手把手教朋友，而不是写教科书。
2. 禁用词：禁用"破译、拯救、绝美、YYDS、宝藏"等浮夸词。
3. 语言：用"显脸小"、"修饰头型"、"重心稳"替代"几何补偿"。
4. 标题：直击要点，建议使用疑问或痛点拆解式标题。

输出格式为 JSON (title, intro, logic, tags)。`;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              intro: { type: Type.STRING },
              logic: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "intro", "logic", "tags"]
          }
        }
      });

      const text = response.text || '{}';
      const cleaned = text.replace(/```json\n?|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (error: any) {
      console.warn('前端直接调用失败，尝试使用后端:', error);
      // 如果前端调用失败，fallback 到后端
    }
  }
  
  // 使用后端 API（fallback）
  try {
    console.log('使用后端 API');
    const response = await fetch(`${API_BASE_URL}/api/generate-topic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selectedPoints,
        selectedHats,
        context
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Generate Topic Error:", error);
    throw error;
  }
};

/**
 * 调用 Gemini API 生成图片需求
 * 优先使用前端直接调用（如果 Cursor 提供了 API Key），否则使用后端
 */
export const generateImageDemands = async (topic: GeneratedTopic, count: number): Promise<ImageDemand[]> => {
  // 尝试使用前端直接调用（如果 Cursor 提供了 API Key）
  const apiKey = await getApiKey();
  
  if (apiKey) {
    try {
      console.log('使用前端直接调用 Gemini API');
      const ai = new GoogleGenAI({ apiKey });
      
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

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
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
        }
      });

      const text = response.text || '[]';
      const cleaned = text.replace(/```json\n?|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (error: any) {
      console.warn('前端直接调用失败，尝试使用后端:', error);
      // 如果前端调用失败，fallback 到后端
    }
  }
  
  // 使用后端 API（fallback）
  try {
    console.log('使用后端 API');
    const response = await fetch(`${API_BASE_URL}/api/generate-image-demands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        count
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Generate Image Demands Error:", error);
    throw error;
  }
};
