import React from 'react';
import { TikTokVideoData, GeminiAnalysisResult } from '../types';
import { Copy, ExternalLink, Play, Film, Wand2, Share2, AlertTriangle } from 'lucide-react';
import { AI_TOOLS } from '../constants';

interface ResultCardProps {
  videoData: TikTokVideoData;
  analysis: GeminiAnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ videoData, analysis }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Left: Original Video Info */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        <div className="relative aspect-[9/16] bg-black group max-h-[500px]">
           {/* Thumbnail / Video Preview */}
           <img 
            src={videoData.thumbnail} 
            alt="Original Video" 
            className="w-full h-full object-contain opacity-80 group-hover:opacity-40 transition-opacity duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <a 
              href={videoData.videoUrl} 
              target="_blank" 
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-4 rounded-full text-white transition-all transform hover:scale-110"
            >
              <Play fill="currentColor" size={32} />
            </a>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <h3 className="text-white font-bold truncate">{videoData.title}</h3>
            <p className="text-slate-300 text-sm">@{videoData.author}</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4 flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Film size={14} />
                <span>Source Metadata</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-slate-400 text-xs">Likes</div>
                    <div className="text-white font-mono">{videoData.diggCount?.toLocaleString() || 'N/A'}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-slate-400 text-xs">Duration</div>
                    <div className="text-white font-mono">{videoData.duration}s</div>
                </div>
            </div>
            
            {videoData.isDemo && (
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex items-start gap-2">
                <AlertTriangle className="text-amber-500 shrink-0" size={16} />
                <p className="text-xs text-amber-200">
                  Using demo data. Real extraction may be blocked by TikTok's anti-bot protection.
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Right: AI Analysis & Generation */}
      <div className="flex flex-col gap-6">
        
        {/* Generated Prompt Card */}
        <div className="bg-gradient-to-br from-violet-900/40 to-fuchsia-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wand2 size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-fuchsia-300 font-semibold">
                        <Wand2 size={20} />
                        <h2>AI Recreation Prompt</h2>
                    </div>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors text-white"
                    >
                        {copied ? 'Copied!' : 'Copy Text'}
                        <Copy size={12} />
                    </button>
                </div>

                <div className="bg-black/30 rounded-xl p-4 border border-white/5 font-mono text-sm text-slate-200 leading-relaxed max-h-[200px] overflow-y-auto scrollbar-thin">
                    {analysis.prompt}
                </div>

                <div className="mt-6 space-y-4">
                    <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Technical Insight</h4>
                        <p className="text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5">
                            {analysis.technicalDetails}
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Viral Factors</h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.viralFactors.map((factor, idx) => (
                                <span key={idx} className="text-xs bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/30 px-2 py-1 rounded-md">
                                    {factor}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Tools Links */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Share2 size={18} />
                <span>Generate Video With</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AI_TOOLS.map((tool) => (
                    <a 
                        key={tool.id}
                        href={tool.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/50 transition-all duration-200"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-slate-200 group-hover:text-violet-300">{tool.name}</span>
                            <ExternalLink size={14} className="text-slate-500 group-hover:text-violet-400" />
                        </div>
                        <span className="text-xs text-slate-500 line-clamp-1">{tool.description}</span>
                    </a>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ResultCard;
