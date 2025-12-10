import { TikTokVideoData } from '../types';
import { CORS_PROXIES } from '../constants';

const DEMO_VIDEO: TikTokVideoData = {
  videoId: 'demo-123',
  title: 'POV: You found the best AI workflow 🤖✨',
  author: 'future_tech_creator',
  thumbnail: 'https://picsum.photos/720/1280', // Vertical placeholder
  videoUrl: '#',
  duration: 15,
  description: 'How to use AI to clone videos #ai #tech #tutorial',
  playCount: 1500000,
  diggCount: 342000,
  isDemo: true
};

export const extractTikTokData = async (
  url: string, 
  onLog: (msg: string, type?: 'info' | 'warning' | 'error' | 'success') => void
): Promise<TikTokVideoData> => {
  
  // Basic validation
  if (!url.includes('tiktok.com')) {
    throw new Error('Invalid TikTok URL');
  }

  onLog('Resolving video ID...', 'info');
  
  // Extract Video ID (basic regex, covers most short/long links after redirect logic which we can't fully do client-side easily without a heavy proxy)
  // For client-side, we rely on the TIKWM public API which handles resolving.
  
  let result: TikTokVideoData | null = null;
  let lastError: unknown;

  // Try fetching via TIKWM API through different CORS proxies
  for (const proxy of CORS_PROXIES) {
    try {
      const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
      onLog(`Attempting extraction via ${new URL(proxy).hostname}...`, 'info');
      
      const response = await fetch(proxy + encodeURIComponent(apiUrl));
      if (!response.ok) continue;

      const data = await response.json();
      
      if (data && data.code === 0 && data.data) {
        const d = data.data;
        result = {
          videoId: d.id,
          title: d.title || 'No Title',
          author: d.author?.nickname || d.author?.unique_id || 'Unknown',
          authorId: d.author?.id,
          thumbnail: d.cover, // Use origin cover, we might proxy it later for Gemini
          videoUrl: d.hdplay || d.play,
          duration: d.duration,
          playCount: d.play_count,
          diggCount: d.digg_count,
          description: d.title, // TikTok API often puts caption in title
          isDemo: false
        };
        onLog('Video metadata extracted successfully!', 'success');
        break;
      } else {
         // API returned error code
         throw new Error(data.msg || 'API returned invalid code');
      }
    } catch (err) {
      console.warn(`Proxy ${proxy} failed:`, err);
      lastError = err;
    }
  }

  if (result) return result;

  onLog('Automatic extraction failed due to CORS/API limits. Falling back to Demo Mode for visualization.', 'warning');
  // In a real production app, we would have a backend server do this.
  // For this frontend-only demo, we return mock data so the user can see the AI flow.
  return { ...DEMO_VIDEO, title: `Demo Clone: ${url.slice(0, 20)}...` };
};

export const fetchImageAsBase64 = async (imageUrl: string): Promise<string | null> => {
  try {
    // Try to fetch through proxy to avoid CORS on images
    const proxy = CORS_PROXIES[0];
    const response = await fetch(proxy + encodeURIComponent(imageUrl));
    if (!response.ok) return null;
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix if present, Gemini often needs just the base64 data for inlineData (but SDK handles it?)
        // The @google/genai SDK usually expects base64 data string for inlineData.
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Failed to convert image to base64", e);
    return null;
  }
};
