// 使用 Cursor 内置 API 访问 Gemini（不需要后端和 VPN）
import { GeneratedTopic, SecondaryPoint, HatType, ImageDemand } from "../types";

// 检查是否在 Cursor 环境中
const isCursorEnv = typeof window !== 'undefined' && window.aistudio;

/**
 * 通过 Cursor 的 API 调用 Gemini
 * 这需要 Cursor 提供 API 访问接口
 */
async function callCursorGeminiAPI(prompt: string, model: string = 'gemini-3-pro-preview'): Promise<string> {
  // 方案1: 如果 Cursor 提供了 API 调用接口
  if (window.aistudio && (window.aistudio as any).generateContent) {
    const response = await (window.aistudio as any).generateContent({
      model,
      prompt,
      responseFormat: 'json'
    });
    return response.text || response.content;
  }
  
  // 方案2: 使用 fetch 调用 Cursor 的内部 API（如果存在）
  // 这需要知道 Cursor 的内部 API 端点
  throw new Error('Cursor API 接口未找到，请使用后端方案');
}

/**
 * 生成选题方案（使用 Cursor API）
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
  if (!isCursorEnv) {
    throw new Error('此功能需要在 Cursor 环境中运行');
  }

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

  try {
    const responseText = await callCursorGeminiAPI(prompt);
    const cleaned = responseText.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error: any) {
    console.error("Generate Topic Error:", error);
    throw new Error(error.message || "生成选题失败");
  }
};

/**
 * 生成图片需求（使用 Cursor API）
 */
export const generateImageDemands = async (topic: GeneratedTopic, count: number): Promise<ImageDemand[]> => {
  if (!isCursorEnv) {
    throw new Error('此功能需要在 Cursor 环境中运行');
  }

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
    const responseText = await callCursorGeminiAPI(prompt);
    const cleaned = responseText.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error: any) {
    console.error("Generate Image Demands Error:", error);
    throw new Error(error.message || "生成图片需求失败");
  }
};
