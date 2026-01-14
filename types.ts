
export interface SecondaryPoint {
  id: string;
  name: string;
  description: string;
}

export interface PrimaryPoint {
  id: string;
  name: string;
  points: SecondaryPoint[];
}

export interface GeneratedTopic {
  title: string;
  intro: string;
  logic: string;
  tags: string[];
}

export interface ImageDemand {
  id: number;
  mainCopy: string; // 增加主文案字段
  modelDescription: string;
  hatDetails: string;
  angle: string;
  aestheticGoal: string;
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
