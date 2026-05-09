'use client';
import { useNewsStore } from '@/store/newsStore';
import { Terminal, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function ScraperTerminal() {
  const showTerminal = useNewsStore(state => state.showTerminal);
  const setShowTerminal = useNewsStore(state => state.setShowTerminal);
  const terminalLogs = useNewsStore(state => state.terminalLogs);
  const isScraping = useNewsStore(state => state.isScraping);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  if (!showTerminal) return null;

  return (
    <div className={`fixed bottom-0 left-0 w-full md:bottom-auto md:top-24 md:left-auto md:right-12 md:w-[450px] md:rounded-xl bg-surface-container-lowest/90 backdrop-blur-xl border border-white/10 z-[60] flex flex-col shadow-2xl transition-all duration-300 ${showTerminal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'} h-[40vh] md:h-[500px] mb-16 md:mb-0`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/40 md:rounded-t-xl">
        <div className="flex items-center gap-3">
          <Terminal size={14} className="text-primary-fixed-dim" />
          <span className="font-mono text-[11px] text-primary-fixed-dim uppercase tracking-widest">Neural Sync Stream</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <div className={`w-2 h-2 rounded-full ${isScraping ? 'bg-secondary animate-pulse' : 'bg-surface-variant'}`}></div>
            <div className={`w-2 h-2 rounded-full ${isScraping ? 'bg-primary-fixed-dim animate-pulse delay-75' : 'bg-surface-variant'}`}></div>
          </div>
          <button onClick={() => setShowTerminal(false)} className="text-on-surface-variant hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="p-4 flex-grow overflow-y-auto terminal-scroll font-mono text-[12px] leading-relaxed text-on-surface-variant/80 space-y-2">
        {terminalLogs.map((log, i) => {
          let color = 'text-on-surface-variant/80';
          if (log.includes('[SYS_TIME')) color = 'text-primary-fixed-dim';
          if (log.includes('[WARN]')) color = 'text-secondary-fixed-dim';
          if (log.includes('[DATA]')) color = 'text-primary-fixed-dim';
          if (log.includes('[ANALYSIS]')) color = 'text-tertiary-fixed-dim';

          return <div key={i} className={color}>{log}</div>;
        })}
        {isScraping && <div className="text-on-surface opacity-50 animate-pulse">&gt; Awaiting further packets... _</div>}
      </div>
    </div>
  );
}
