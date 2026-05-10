'use client';
import { useNewsStore } from '@/store/newsStore';
import { useMemo, useState } from 'react';

type Segment = 'viral' | 'sentiment' | 'entities' | 'logs';

export function NeuralAnalytics() {
  const articles = useNewsStore(state => state.articles);
  const terminalLogs = useNewsStore(state => state.terminalLogs);
  const [activeSegment, setActiveSegment] = useState<Segment>('viral');

  const anomalyArticle = articles[4] || articles[0];

  const analysis = useMemo(() => {
    let opulence = 0;
    let scandal = 0;
    let philanthropy = 0;
    
    const opulenceWords = ['million', 'billion', 'mansion', 'yacht', 'luxury', 'diamond', 'designer', 'exclusive', 'car', 'jet'];
    const scandalWords = ['lawsuit', 'arrest', 'scandal', 'cheating', 'affair', 'slam', 'feud', 'court', 'police', 'split', 'divorce'];
    const philanthropyWords = ['donate', 'charity', 'foundation', 'hospital', 'help', 'support', 'giving', 'gala', 'fundraiser'];
    
    articles.forEach(a => {
      const text = (a.title + " " + a.contentSnippet).toLowerCase();
      opulenceWords.forEach(w => { if(text.includes(w)) opulence++ });
      scandalWords.forEach(w => { if(text.includes(w)) scandal++ });
      philanthropyWords.forEach(w => { if(text.includes(w)) philanthropy++ });
    });
    
    function toPerc(val: number) {
      return Math.min(100, Math.round((val / (articles.length || 1)) * 100 * 2)); // *2 multiplier to show more visual bar diffs
    }
    
    const opulencePerc = toPerc(opulence) || 15;
    const scandalPerc = toPerc(scandal) || 20;
    const philanthropyPerc = toPerc(philanthropy) || 5;
    
    const systemHealth = articles.length > 0 ? 99.8 : 0;
    const peakVelocity = articles.length > 0 ? ((articles.length * 1.5) > 1000 ? ((articles.length * 1.5)/1000).toFixed(1) + 'M/hr' : (articles.length * 1.5).toFixed(1) + 'k/hr')  : '0/hr';
    const saturationPoint = articles.length > 50 ? 'Projected 2h' : 'Projected ' + Math.max(1, Math.round(100 / (articles.length || 1))) + 'h';
    const viralIndex = Math.min(100, Math.max(10, Math.round((articles.length / 50) * 100)));

    return { opulencePerc, scandalPerc, philanthropyPerc, systemHealth, peakVelocity, saturationPoint, viralIndex };
  }, [articles]);

  const extractedEntities = useMemo(() => {
    const celebs = new Map<string, number>();
    const brands = new Map<string, number>();
    const locations = new Map<string, number>();

    articles.forEach(a => {
       if (a.neuralData?.entities) {
         a.neuralData.entities.celebrities?.forEach(c => celebs.set(c, (celebs.get(c) || 0) + 1));
         a.neuralData.entities.brands?.forEach(b => brands.set(b, (brands.get(b) || 0) + 1));
         a.neuralData.entities.locations?.forEach(l => locations.set(l, (locations.get(l) || 0) + 1));
       }
    });

    const sortMap = (m: Map<string, number>) => Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);

    return {
      celebrities: sortMap(celebs),
      brands: sortMap(brands),
      locations: sortMap(locations)
    };
  }, [articles]);

  if (articles.length === 0) return null;

  return (
    <div className="flex-1 w-full pt-40 md:pt-32 pb-32 px-6 md:px-12 lg:px-16 space-y-8 relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 glass-panel rounded-xl p-6 h-fit sticky top-32 space-y-8">
        <div>
          <h3 className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-6">Neural Segments</h3>
          <ul className="space-y-5">
            <li>
              <button onClick={() => setActiveSegment('viral')} className={`flex items-center gap-3 transition-colors ${activeSegment === 'viral' ? 'text-primary-fixed-dim' : 'text-on-surface-variant/60 hover:text-on-surface-variant'}`}>
                <span className="font-label-caps text-xs uppercase tracking-widest">Viral Index</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSegment('sentiment')} className={`flex items-center gap-3 transition-colors ${activeSegment === 'sentiment' ? 'text-primary-fixed-dim' : 'text-on-surface-variant/60 hover:text-on-surface-variant'}`}>
                <span className="font-label-caps text-xs uppercase tracking-widest">Sentiment Maps</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSegment('entities')} className={`flex items-center gap-3 transition-colors ${activeSegment === 'entities' ? 'text-primary-fixed-dim' : 'text-on-surface-variant/60 hover:text-on-surface-variant'}`}>
                <span className="font-label-caps text-xs uppercase tracking-widest">Entity Clusters</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSegment('logs')} className={`flex items-center gap-3 transition-colors ${activeSegment === 'logs' ? 'text-primary-fixed-dim' : 'text-on-surface-variant/60 hover:text-on-surface-variant'}`}>
                <span className="font-label-caps text-xs uppercase tracking-widest">Process Logs</span>
              </button>
            </li>
          </ul>
        </div>
        <div className="pt-6 border-t border-white/5">
          <div className="bg-surface-container-low rounded-lg p-5 text-center shadow-inner">
            <span className="block font-display-hero text-3xl text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary-fixed-dim mb-2">{analysis.systemHealth}%</span>
            <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">System Optimal</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-8">
        <header className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-display-hero text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary-fixed-dim pb-1">Neural Analytics Core</h1>
            <p className="font-body-main text-sm text-on-surface-variant">Real-time processing of high-society digital propagation via scraped intercepts.</p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-primary-fixed-dim/20 shadow-[0_0_15px_rgba(226,195,130,0.1)] shrink-0">
            <div className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse"></div>
            <span className="font-label-caps text-[10px] text-primary-fixed-dim uppercase tracking-widest">Live Sync Active</span>
          </div>
        </header>

        {/* Mobile Segments Nav */}
        <div className="lg:hidden flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
          <button onClick={() => setActiveSegment('viral')} className={`shrink-0 px-4 py-2 rounded-full border font-label-caps text-[10px] uppercase tracking-widest transition-colors ${activeSegment === 'viral' ? 'bg-primary-fixed-dim/20 border-primary-fixed-dim text-primary-fixed-dim' : 'border-white/10 text-on-surface-variant border-transparent bg-surface-container'}`}>
            Viral Index
          </button>
          <button onClick={() => setActiveSegment('sentiment')} className={`shrink-0 px-4 py-2 rounded-full border font-label-caps text-[10px] uppercase tracking-widest transition-colors ${activeSegment === 'sentiment' ? 'bg-primary-fixed-dim/20 border-primary-fixed-dim text-primary-fixed-dim' : 'border-white/10 text-on-surface-variant border-transparent bg-surface-container'}`}>
            Sentiment Maps
          </button>
          <button onClick={() => setActiveSegment('entities')} className={`shrink-0 px-4 py-2 rounded-full border font-label-caps text-[10px] uppercase tracking-widest transition-colors ${activeSegment === 'entities' ? 'bg-primary-fixed-dim/20 border-primary-fixed-dim text-primary-fixed-dim' : 'border-white/10 text-on-surface-variant border-transparent bg-surface-container'}`}>
            Entity Clusters
          </button>
          <button onClick={() => setActiveSegment('logs')} className={`shrink-0 px-4 py-2 rounded-full border font-label-caps text-[10px] uppercase tracking-widest transition-colors ${activeSegment === 'logs' ? 'bg-primary-fixed-dim/20 border-primary-fixed-dim text-primary-fixed-dim' : 'border-white/10 text-on-surface-variant border-transparent bg-surface-container'}`}>
            Process Logs
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {activeSegment === 'viral' && (
            <>
              {/* Viral Potential */}
              <article className="glass-panel rounded-xl p-8 xl:col-span-3 relative overflow-hidden group hover:border-primary-fixed-dim/30 transition-all duration-500">
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h2 className="font-display-hero text-2xl text-on-surface">Global Viral Potential</h2>
                    <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mt-2 tracking-widest">Aggregated across recent scraped entries</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-around gap-12 relative z-10 mt-8">
                  <div className="relative w-48 h-48 flex items-center justify-center scale-110">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
                      <circle cx="50" cy="50" fill="none" r="45" stroke="url(#gradient-primary)" strokeDasharray="283" strokeDashoffset={`${283 - (283 * analysis.viralIndex) / 100}`} strokeLinecap="round" strokeWidth="8" className="transition-all duration-1000"></circle>
                      <defs>
                        <linearGradient id="gradient-primary" x1="0%" x2="100%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#ffdf9c"></stop>
                          <stop offset="100%" stopColor="#ffb3b1"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute text-center flex flex-col items-center mt-2">
                      <span className="font-display-hero text-4xl text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary-fixed-dim font-bold drop-shadow">{analysis.viralIndex}</span>
                      <span className="font-label-caps text-[10px] text-primary-fixed-dim uppercase tracking-widest mt-1">Index</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-6 w-full md:w-auto">
                    <div className="bg-surface-container-low/80 p-5 rounded-lg border border-white/5 backdrop-blur-md">
                      <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2">Peak Velocity</span>
                      <span className="font-display-hero text-2xl text-on-surface">{analysis.peakVelocity}</span>
                      <div className="w-full bg-surface-container mt-3 h-1 rounded-full overflow-hidden">
                        <div className="bg-primary-fixed-dim h-full w-[80%] shadow-[0_0_10px_rgba(226,195,130,0.8)]"></div>
                      </div>
                    </div>
                    <div className="bg-surface-container-low/80 p-5 rounded-lg border border-white/5 backdrop-blur-md">
                      <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2">Saturation Point</span>
                      <span className="font-display-hero text-2xl text-secondary-fixed-dim">{analysis.saturationPoint}</span>
                      <div className="w-full bg-surface-container mt-3 h-1 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full w-[45%] shadow-[0_0_10px_rgba(255,179,177,0.8)]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              
              {/* Anomaly Spotlight */}
              {anomalyArticle && (
                 <article className="glass-panel rounded-xl overflow-hidden xl:col-span-3 relative min-h-[400px] group">
                  {anomalyArticle.imageUrl && (
                    <img src={anomalyArticle.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:opacity-50 group-hover:mix-blend-normal transition-all duration-[2s]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-surface via-surface/80 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="max-w-3xl">
                      <span className="inline-block bg-primary-fixed-dim text-on-primary-fixed font-label-caps text-[10px] px-3 py-1.5 rounded-sm uppercase tracking-widest mb-6">Anomaly Detected</span>
                      <h2 className="font-display-hero text-3xl md:text-5xl text-on-surface mb-4 leading-tight drop-shadow-lg">{anomalyArticle.title}</h2>
                      <p className="font-body-main text-sm md:text-base text-on-surface-variant max-w-xl line-clamp-3" dangerouslySetInnerHTML={{__html: anomalyArticle.contentSnippet}} />
                    </div>
                    <button className="shrink-0 px-8 py-4 bg-surface-container-high/80 border border-primary-fixed-dim/30 backdrop-blur-xl rounded-lg font-label-caps text-xs text-primary-fixed-dim uppercase tracking-widest hover:bg-primary-fixed-dim/10 transition-colors flex items-center gap-3 w-full md:w-auto justify-center group-hover:shadow-[0_0_20px_rgba(226,195,130,0.2)]">
                      <span>Isolate Data</span>
                    </button>
                  </div>
                </article>
              )}
            </>
          )}

          {activeSegment === 'sentiment' && (
            <article className="glass-panel rounded-xl p-8 xl:col-span-3 relative flex flex-col min-h-[500px]">
              <div className="mb-12">
                <h2 className="font-display-hero text-2xl text-on-surface">Sentiment Matrix</h2>
                <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mt-2 tracking-widest">Linguistic weight distribution in current data pool</p>
              </div>
              
              <div className="flex-grow flex flex-col justify-end space-y-8 relative">
                <div className="absolute inset-0 flex items-end justify-between px-4 pb-12 opacity-20 pointer-events-none">
                  <div className="w-1 bg-gradient-to-t from-transparent to-primary-fixed-dim h-1/3 rounded-t-full"></div>
                  <div className="w-1 bg-gradient-to-t from-transparent to-primary-fixed-dim h-1/2 rounded-t-full"></div>
                  <div className="w-1 bg-gradient-to-t from-transparent to-primary-fixed-dim h-3/4 rounded-t-full"></div>
                  <div className="w-1 bg-gradient-to-t from-transparent to-secondary h-full rounded-t-full"></div>
                </div>
                
                <div className="bg-surface-container-high/60 p-6 rounded-lg border border-white/5 backdrop-blur-xl relative z-10 transition-transform hover:scale-[1.02]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-body-main text-lg text-on-surface font-medium">Opulence Focus</span>
                    <span className="font-display-hero text-xl text-primary-fixed-dim tracking-widest">{analysis.opulencePerc}%</span>
                  </div>
                  <p className="font-body-main text-xs text-on-surface-variant mb-4">Focuses on luxury, wealth displays, and high-value transactions.</p>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden"><div className="h-full bg-primary-fixed-dim transition-all duration-1000" style={{width: `${analysis.opulencePerc}%`}}></div></div>
                </div>
                
                <div className="bg-surface-container-high/60 p-6 rounded-lg border border-white/5 backdrop-blur-xl relative z-10 transition-transform hover:scale-[1.02]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-body-main text-lg text-on-surface font-medium">Scandal Alerts</span>
                    <span className="font-display-hero text-xl text-secondary-fixed-dim tracking-widest">{analysis.scandalPerc}%</span>
                  </div>
                  <p className="font-body-main text-xs text-on-surface-variant mb-4">Analyzes conflict, law enforcement involvement, and relational breakdowns.</p>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden"><div className="h-full bg-secondary transition-all duration-1000" style={{width: `${analysis.scandalPerc}%`}}></div></div>
                </div>
                
                <div className="bg-surface-container-high/60 p-6 rounded-lg border border-white/5 backdrop-blur-xl relative z-10 transition-transform hover:scale-[1.02]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-body-main text-lg text-on-surface font-medium">Philanthropy</span>
                    <span className="font-display-hero text-xl text-outline tracking-widest">{analysis.philanthropyPerc}%</span>
                  </div>
                  <p className="font-body-main text-xs text-on-surface-variant mb-4">Tracks charitable donations, foundation building, and social good initiatives.</p>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden"><div className="h-full bg-outline transition-all duration-1000" style={{width: `${analysis.philanthropyPerc}%`}}></div></div>
                </div>
              </div>
            </article>
          )}

          {activeSegment === 'entities' && (
            <article className="glass-panel rounded-xl p-8 xl:col-span-3 relative flex flex-col min-h-[500px]">
              <div className="mb-12">
                <h2 className="font-display-hero text-2xl text-on-surface">Entity Clusters</h2>
                <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mt-2 tracking-widest">AI-extracted entity associations</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-label-caps text-[10px] text-primary-fixed-dim uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Top Celebrities</h3>
                  {extractedEntities.celebrities.length === 0 && <p className="text-xs text-on-surface-variant italic">No data yet. Run neural extraction on articles.</p>}
                  <ul className="space-y-3">
                    {extractedEntities.celebrities.map(([name, count], i) => (
                      <li key={i} className="flex justify-between items-center bg-surface-container/30 px-3 py-2 rounded">
                        <span className="font-body-main text-sm text-on-surface">{name}</span>
                        <span className="font-mono text-xs text-primary-fixed-dim bg-primary-fixed-dim/10 px-2 py-0.5 rounded-full">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-label-caps text-[10px] text-secondary-fixed-dim uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Top Brands</h3>
                  {extractedEntities.brands.length === 0 && <p className="text-xs text-on-surface-variant italic">No data yet. Run neural extraction on articles.</p>}
                  <ul className="space-y-3">
                    {extractedEntities.brands.map(([name, count], i) => (
                      <li key={i} className="flex justify-between items-center bg-surface-container/30 px-3 py-2 rounded">
                        <span className="font-body-main text-sm text-on-surface">{name}</span>
                        <span className="font-mono text-xs text-secondary-fixed-dim bg-secondary-fixed-dim/10 px-2 py-0.5 rounded-full">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-label-caps text-[10px] text-tertiary-fixed-dim uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Top Locations</h3>
                  {extractedEntities.locations.length === 0 && <p className="text-xs text-on-surface-variant italic">No data yet. Run neural extraction on articles.</p>}
                  <ul className="space-y-3">
                    {extractedEntities.locations.map(([name, count], i) => (
                      <li key={i} className="flex justify-between items-center bg-surface-container/30 px-3 py-2 rounded">
                        <span className="font-body-main text-sm text-on-surface">{name}</span>
                        <span className="font-mono text-xs text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-2 py-0.5 rounded-full">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          )}

          {activeSegment === 'logs' && (
            <article className="glass-panel rounded-xl p-8 xl:col-span-3 relative flex flex-col min-h-[500px]">
              <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                  <h2 className="font-display-hero text-2xl text-on-surface">Process Logs</h2>
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mt-2 tracking-widest">Network Operation Terminal Output</p>
                </div>
                <div className="animate-pulse w-3 h-3 bg-primary-fixed-dim rounded-full shadow-[0_0_10px_rgba(226,195,130,1)]"></div>
              </div>
              <div className="flex-1 bg-surface-container overflow-hidden rounded-lg border border-white/5 font-mono text-xs p-6 shadow-inner space-y-2 h-[400px] overflow-y-auto">
                {terminalLogs.length === 0 ? (
                   <div className="text-on-surface-variant/50 italic">Awaiting connection sequences...</div>
                ) : (
                  terminalLogs.map((log, i) => (
                    <div key={i} className={`${log.includes('[ERROR]') ? 'text-error' : log.includes('Awaiting') ? 'text-on-surface-variant' : 'text-primary-fixed-dim'}`}>
                      <span className="opacity-50 mr-3">[{new Date().toISOString().substring(11, 19)}]</span>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </article>
          )}

        </div>
      </div>
    </div>
  );
}
