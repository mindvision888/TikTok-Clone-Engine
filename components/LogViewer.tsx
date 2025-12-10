import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface LogViewerProps {
  logs: LogEntry[];
  isProcessing: boolean;
}

const LogViewer: React.FC<LogViewerProps> = ({ logs, isProcessing }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <div className="w-full bg-black/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl mt-6">
      <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Terminal size={14} />
          <span>SYSTEM_LOG</span>
        </div>
        {isProcessing && (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin text-cyan-400" size={14} />
            <span className="text-xs text-cyan-400 font-mono">PROCESSING...</span>
          </div>
        )}
      </div>
      
      <div 
        ref={scrollRef}
        className="p-4 h-48 overflow-y-auto scrollbar-thin font-mono text-sm space-y-2"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-slate-600 shrink-0 text-xs mt-0.5">[{log.timestamp}]</span>
            <div className="flex items-start gap-2">
              {log.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />}
              {log.type === 'error' && <AlertCircle size={16} className="text-rose-400 mt-0.5 shrink-0" />}
              {log.type === 'warning' && <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />}
              {log.type === 'info' && <div className="w-4 h-4 mt-0.5 shrink-0" />} {/* Spacer */}
              
              <span className={`
                ${log.type === 'success' ? 'text-emerald-300' : ''}
                ${log.type === 'error' ? 'text-rose-300' : ''}
                ${log.type === 'warning' ? 'text-amber-300' : ''}
                ${log.type === 'info' ? 'text-slate-300' : ''}
              `}>
                {log.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogViewer;
