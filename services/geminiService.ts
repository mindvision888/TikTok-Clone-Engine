import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysisResult, TikTokVideoData } from "../types";
import { fetchImageAsBase64 } from "./tiktokService";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert viral video consultant and AI prompt engineer.
Your goal is to analyze TikTok video metadata (and visual thumbnails if provided) to create highly effective image/video generation prompts.
These prompts will be used in tools like Runway Gen-3, Pika, or Sora to recreate the *style*, *composition*, and *vibe* of the original viral video.

Output must be JSON.
`;

export const analyzeVideoWithGemini = async (
  videoData: TikTokVideoData,
  onLog: (msg: string, type?: 'info' | 'success') => void
): Promise<GeminiAnalysisResult> => {

  onLog('Initializing Gemini 2.5 Flash...', 'info');

  const model = 'gemini-2.5-flash';
  
  // Prepare content parts
  const parts: any[] = [];
  
  // Add metadata text
  let textPrompt = `Analyze this TikTok video to create a generation prompt.
  
  Metadata:
  - Author: ${videoData.author}
  - Description/Caption: ${videoData.description}
  - Duration: ${videoData.duration}s
  - Engagement: ${videoData.diggCount || 'Unknown'} likes
  
  Task:
  1. Identify the core visual aesthetics (lighting, camera angle, color palette).
  2. Identify the subject and action.
  3. Create a highly detailed prompt (max 400 chars) for an AI video generator.
  4. List 3 key factors that likely made this video viral.
  `;

  if (videoData.isDemo) {
    textPrompt += "\nNOTE: This is a demo placeholder. Invent a plausible viral video scenario based on the description 'Future Tech AI Workflow'.";
  }

  parts.push({ text: textPrompt });

  // Try to add image if available
  if (!videoData.isDemo && videoData.thumbnail) {
    onLog('Fetching thumbnail for multimodal analysis...', 'info');
    const base64Image = await fetchImageAsBase64(videoData.thumbnail);
    if (base64Image) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', // Assuming jpeg from TikTok, mostly true
          data: base64Image
        }
      });
      onLog('Thumbnail attached successfully.', 'success');
    } else {
      onLog('Could not fetch thumbnail (CORS). Proceeding with text-only analysis.', 'info');
    }
  }

  onLog('Sending data to Gemini...', 'info');

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING, description: "The optimized prompt for video generation tools." },
            technicalDetails: { type: Type.STRING, description: "Camera settings, lighting, and style notes." },
            viralFactors: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Three reasons why this style is viral."
            }
          },
          required: ["prompt", "technicalDetails", "viralFactors"]
        }
      }
    });

    onLog('Analysis received!', 'success');
    
    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    return JSON.parse(text) as GeminiAnalysisResult;

  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(`Gemini Analysis Failed: ${error.message || 'Unknown error'}`);
  }
};
