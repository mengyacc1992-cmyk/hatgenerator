
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedTopic, SecondaryPoint, HatType, ImageDemand } from "../types";

// 辅助函数：清理模型可能返回的 Markdown JSON 块
const parseJsonHelper = (text: string) => {
  try {
    const cleaned = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error:", e, "Original text:", text);
    throw new Error("模型返回数据格式错误");
  }
};

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
  // 关键：在函数内部初始化，确保获取注入后的 API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const pointsDesc = selectedPoints.map(p => `${p.name}(${p.description})`).join(', ');
  const hatsDesc = selectedHats.map(h => `${h.name}(逻辑:${h.logic})`).join(', ');
  
  const prompt = `你是一位懂审美、亲和力强的资深帽子搭配顾问。
  请基于以下参数，生成一个专业但“说人话”的选题方案。
  
  【目标人群】：${context.gender}
  【基础脸型】：${context.faceType || '通用脸型/未指定'}
  【生活场景】：${context.scenario || '通用场景/未指定'}
  ${context.painPoint ? `【用户困扰】：${context.painPoint}` : ''}
  【搭配逻辑】：${pointsDesc || '根据参数自动匹配'}
  【推荐帽型】：${hatsDesc || '自动推荐最优解'}
  
  文案准则：
  1. 风格：日常、平实。像是设计师在手把手教朋友，而不是写教科书。
  2. 禁用词：禁用“破译、拯救、绝美、YYDS、宝藏”等浮夸词。
  3. 语言：用“显脸小”、“修饰头型”、“重心稳”替代“几何补偿”。
  4. 标题：直击要点，建议使用疑问或痛点拆解式标题。
  
  输出格式为 JSON (title, intro, logic, tags)。`;

  const response = await ai.models.generateContent({
    // Use gemini-3-pro-preview for complex text generation tasks
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

  return parseJsonHelper(response.text || '{}');
};

export const generateImageDemands = async (topic: GeneratedTopic, count: number): Promise<ImageDemand[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `你是一位专业的内容策划专家。请为选题方案《${topic.title}》规划一套完整的小红书“内容资产流”看板（共 ${count} 张卡片）。
  
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
    // Use gemini-3-pro-preview for complex reasoning tasks
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

  return parseJsonHelper(response.text || '[]');
};
