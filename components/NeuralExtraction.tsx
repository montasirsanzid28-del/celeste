'use client';
import { Article, useNewsStore } from '@/store/newsStore';
import { Cpu, Tag, Flame, CheckCircle2 } from 'lucide-react';

export function NeuralExtraction({ article }: { article: Article }) {
  const analyzeArticle = useNewsStore(state => state.analyzeArticle);

  const handleAnalyze = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    analyzeArticle(article.id);
  };

  if (article.isAnalyzing) {
    return (
      <div className="mt-4 p-4 rounded-lg bg-surface-container/50 border border-primary-fixed-dim/20 backdrop-blur-sm animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="text-primary-fixed-dim animate-spin" size={16} />
          <span className="font-label-caps text-[10px] text-primary-fixed-dim uppercase tracking-widest">Neural extraction in progress...</span>
        </div>
        <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-3 relative">
          <div className="bg-primary-fixed-dim h-full w-[30%] absolute left-0 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
    );
  }

  if (article.neuralData) {
    const { tldr, hypeScore, entities } = article.neuralData;
    
    let hypeColor = "text-primary-fixed-dim";
    if (hypeScore > 75) hypeColor = "text-error";
    else if (hypeScore < 40) hypeColor = "text-secondary-fixed-dim";

    return (
      <div className="mt-4 p-4 rounded-lg bg-surface-container/80 border border-white/10 backdrop-blur-md relative z-20 pointer-events-auto" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
           <div className="flex items-center gap-2">
             <Cpu className="text-tertiary-fixed border border-tertiary-fixed/30 rounded p-1" size={20} />
             <span className="font-label-caps text-[10px] text-tertiary-fixed uppercase tracking-widest">Neural Intel Active</span>
           </div>
           <div className="flex items-center gap-2 bg-surface p-1.5 rounded border border-white/5">
              <Flame className={hypeColor} size={14} />
              <span className={`font-mono text-xs ${hypeColor}`}>Hype: {hypeScore}%</span>
           </div>
        </div>

        <ul className="space-y-1 mb-3">
          {tldr.map((point, idx) => (
            <li key={idx} className="font-body-main text-xs text-on-surface-variant flex items-start gap-2">
              <span className="text-tertiary-fixed mt-0.5">•</span>
              <span dangerouslySetInnerHTML={{__html: point}} />
            </li>
          ))}
        </ul>

        {((entities.celebrities?.length || 0) > 0 || (entities.brands?.length || 0) > 0) && (
           <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
             {entities.celebrities.slice(0, 3).map((celeb, idx) => (
               <span key={`celeb-${idx}`} className="font-label-caps text-[9px] text-primary-fixed-dim bg-primary-fixed-dim/10 px-2 py-0.5 rounded border border-primary-fixed-dim/20 flex items-center gap-1">
                 <Tag size={8} /> {celeb}
               </span>
             ))}
             {entities.brands.slice(0, 3).map((brand, idx) => (
               <span key={`brand-${idx}`} className="font-label-caps text-[9px] text-secondary-fixed-dim bg-secondary-fixed-dim/10 px-2 py-0.5 rounded border border-secondary-fixed-dim/20 flex items-center gap-1">
                 <Tag size={8} /> {brand}
               </span>
             ))}
           </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 relative z-20">
      <button 
        onClick={handleAnalyze}
        className="flex items-center gap-2 font-label-caps text-[10px] uppercase tracking-widest text-primary-fixed-dim hover:text-primary-fixed border border-primary-fixed-dim/30 hover:border-primary-fixed/60 px-3 py-1.5 rounded transition-all bg-surface-container/50 hover:bg-surface-container pointer-events-auto"
      >
        <Cpu size={14} />
        Extract Neural Intel
      </button>
    </div>
  );
}
