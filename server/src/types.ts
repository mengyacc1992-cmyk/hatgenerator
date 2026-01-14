// 共享类型定义，与前端保持一致
export interface SecondaryPoint {
  id: string;
  name: string;
  description: string;
}

export interface HatType {
  id: string;
  name: string;
  enName: string;
  structure: string;
  logic: string;
  suitableFor: string[];
  avoidFor: string[];
  aestheticTags: string[];
}

export interface GeneratedTopic {
  title: string;
  intro: string;
  logic: string;
  tags: string[];
}

export interface ImageDemand {
  id: number;
  mainCopy: string;
  modelDescription: string;
  hatDetails: string;
  angle: string;
  aestheticGoal: string;
}

export interface GenerateTopicRequest {
  selectedPoints: SecondaryPoint[];
  selectedHats: HatType[];
  context: {
    painPoint?: string;
    gender: string;
    faceType?: string;
    scenario?: string;
  };
}

export interface GenerateImageDemandsRequest {
  topic: GeneratedTopic;
  count: number;
}
