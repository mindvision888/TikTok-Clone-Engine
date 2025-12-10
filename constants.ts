import { VideoTool } from './types';

export const AI_TOOLS: VideoTool[] = [
  {
    id: 'zeroscope',
    name: 'Zeroscope V2',
    url: 'https://replicate.com/cerspense/zeroscope_v2_576w',
    description: 'Open-source model, great for surreal/abstract clips. Free via Replicate trial.',
    isFree: true
  },
  {
    id: 'runway',
    name: 'Runway Gen-2/3',
    url: 'https://runwayml.com',
    description: 'Industry standard for high-quality video generation.',
    isFree: false
  },
  {
    id: 'pika',
    name: 'Pika Labs',
    url: 'https://pika.art',
    description: 'Excellent for animation and style transfer.',
    isFree: true
  },
  {
    id: 'luma',
    name: 'Luma Dream Machine',
    url: 'https://lumalabs.ai/dream-machine',
    description: 'High fidelity, realistic motion generation.',
    isFree: true
  }
];

// Proxies to bypass CORS when fetching TikTok metadata
export const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
];
