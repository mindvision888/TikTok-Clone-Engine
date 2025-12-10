export interface TikTokVideoData {
  videoId: string;
  title: string;
  author: string;
  authorId?: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  playCount?: number;
  diggCount?: number;
  description?: string;
  isDemo?: boolean;
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

export type VideoToolId = 'zeroscope' | 'runway' | 'pika' | 'stability' | 'luma';

export interface VideoTool {
  id: VideoToolId;
  name: string;
  url: string;
  description: string;
  isFree?: boolean;
}

export interface GeminiAnalysisResult {
  prompt: string;
  technicalDetails: string;
  viralFactors: string[];
}