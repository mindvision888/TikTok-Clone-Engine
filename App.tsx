import React, { useState, useCallback } from 'react';
import { extractTikTokData } from './services/tiktokService';
import { analyzeVideoWithGemini } from './services/geminiService';
import { TikTokVideoData, GeminiAnalysisResult, LogEntry } from './types';
import LogViewer from './components/LogViewer';
import ResultCard from './components/ResultCard';
import { Sparkles, Play, Search, Github } from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [videoData, setVideoData] = useState<TikTokVideoData | null>(null);
  const [analysis, setAnalysis] = useState<GeminiAnalysisResult | null>(null);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }),
      message,
      type
    }]);
  }, []);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsProcessing(true);
    setLogs([]); // Clear previous logs
    setVideoData(null);
    setAnalysis(null);
    addLog('Starting TikTok Clone Engine v1.0...', 'info');

    try {
      // Step 1: Extraction
      const data = await extractTikTokData(url, addLog);
      setVideoData(data);
      
      // Step 2: Analysis
      addLog(`Sending video "${data.title}" to Gemini...`, 'info');
      const result = await analyzeVideoWithGemini(data, addLog);
      
      setAnalysis(result);
      addLog('Process completed successfully!', 'success');

    } catch (error: any) {
      addLog(error.message || 'An unexpected error occurred', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExample = () => {
    setUrl('https://www.tiktok.com/@tiktok/video/7294458392095313184'); // Just a random example URL
  };

  return (
    <div className="min-h-screen text-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black selection:bg-fuchsia-500/30">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-white/5 rounded-full ring-1 ring-white/10 mb-4 animate-in fade-in zoom-in duration-700">
             <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full p-2">
               <Sparkles className="text-white" size={24} />
             </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            TikTok Clone Engine
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Extract viral DNA from any TikTok and generate precise AI prompts to recreate it using <span className="text-violet-400 font-semibold">Gemini 2.5 Flash</span>.
          </p>
        </header>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto w-full relative z-10">
          <form onSubmit={handleProcess} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-xl p-2 shadow-2xl">
              <div className="pl-4 text-slate-500">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste TikTok URL here..."
                className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 px-4 py-3 outline-none"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !url}
                className="bg-white text-slate-900 hover:bg-slate-200 disabled:bg-slate-700 disabled:text-slate-500 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                {isProcessing ? 'Analyzing...' : (
                  <>
                    <span>Generate</span>
                    <Play size={16} fill="currentColor" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <button 
              onClick={handleExample} 
              className="text-xs text-slate-500 hover:text-violet-400 transition-colors underline decoration-dotted"
            >
              Try an example URL
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="max-w-3xl mx-auto w-full">
           <LogViewer logs={logs} isProcessing={isProcessing} />
        </div>

        {/* Results */}
        {videoData && analysis && (
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Results</span>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
            </div>
            <ResultCard videoData={videoData} analysis={analysis} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-24 text-center text-slate-600 text-sm">
          <p className="flex items-center justify-center gap-4">
            <span>Powered by Gemini 2.5 Flash</span>
            <span>•</span>
            <a href="#" className="hover:text-slate-400 transition-colors flex items-center gap-1">
              <Github size={14} />
              Open Source
            </a>
          </p>
        </footer>

      </div>
    </div>
  );
}
