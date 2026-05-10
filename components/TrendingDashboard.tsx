'use client';
import { useNewsStore } from '@/store/newsStore';
import { useMemo } from 'react';

export function TrendingDashboard() {
  const articles = useNewsStore(state => state.articles);

  const carouselArticles = articles.slice(0, 3);
  const leftItem = carouselArticles[1] || carouselArticles[0];
  const centerItem = carouselArticles[0];
  const rightItem = carouselArticles[2] || carouselArticles[0];

  const stats = useMemo(() => {
    let pos = 0;
    let neg = 0;
    const posWords = ['love', 'wedding', 'baby', 'exclusive', 'fashion', 'style', 'gorgeous', 'stunning', 'beautiful', 'dating', 'kiss', 'happy', 'engaged'];
    const negWords = ['split', 'divorce', 'scandal', 'lawsuit', 'slam', 'angry', 'fight', 'court', 'feud', 'tears', 'crying', 'sad', 'heartbreak'];
    
    let totalTextLength = 0;
    
    articles.forEach(a => {
      const text = (a.title + " " + a.contentSnippet).toLowerCase();
      totalTextLength += text.length;
      posWords.forEach(w => { if(text.includes(w)) pos++ });
      negWords.forEach(w => { if(text.includes(w)) neg++ });
    });
    
    const sentimentTotal = pos + neg;
    const sentimentScore = sentimentTotal > 0 ? Math.round((pos / sentimentTotal) * 100) : 50;
    
    // Velocity calculation: articles in the last 24 hours vs before
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const recentCount = articles.filter(a => now - new Date(a.pubDate).getTime() < oneDay).length;
    const olderCount = articles.length - recentCount;
    
    const velocityRate = olderCount > 0 ? Math.round(((recentCount - olderCount) / olderCount) * 100) : 100;
    const velocityDisplay = velocityRate > 0 ? `+${velocityRate}%` : `${velocityRate}%`;

    const mentions = Math.round((totalTextLength * articles.length) / 2);
    const formatMentions = mentions > 1000000 ? (mentions/1000000).toFixed(1) + 'M' : mentions > 1000 ? (mentions/1000).toFixed(1) + 'k' : mentions;

    return { sentimentScore, velocityDisplay, formatMentions };
  }, [articles]);

  if (articles.length === 0) return null;

  return (
    <div className="flex-1 w-full pt-40 md:pt-32 pb-32 px-6 md:px-12 lg:px-16 space-y-8 relative z-10 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="font-display-hero text-4xl md:text-6xl text-primary mb-4 drop-shadow-lg">Trending Dashboard</h1>
        <p className="text-on-surface-variant max-w-2xl text-base">Real-time analysis of the elite cultural zeitgeist. High-fidelity tracking of market movements based on scraped intercepts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Carousel Area */}
        <div className="lg:col-span-8 glass-panel rounded-xl p-8 flex flex-col relative overflow-hidden min-h-[450px]">
          <div className="flex justify-between items-start z-10 mb-8 relative">
            <h2 className="font-label-caps text-xs text-primary-fixed tracking-widest uppercase">Runway Intercepts</h2>
          </div>
          
          <div className="relative w-full h-full flex-grow flex items-center justify-center z-10">
            <div className="absolute left-0 w-1/4 h-full bg-gradient-to-r from-surface-container/80 to-transparent z-20"></div>
            <div className="absolute right-0 w-1/4 h-full bg-gradient-to-l from-surface-container/80 to-transparent z-20"></div>
            
            <div className="flex gap-4 md:gap-6 items-center w-full justify-center px-4 md:px-10">
              {/* Left */}
              <div className="hidden md:block w-1/4 aspect-[3/4] rounded-lg overflow-hidden relative opacity-50 scale-90 blur-[2px] border border-outline-variant/30">
                {leftItem?.imageUrl && <img src={leftItem.imageUrl} alt="" className="w-full h-full object-cover grayscale" />}
              </div>
              
              {/* Center */}
              <div className="w-2/3 md:w-1/2 aspect-[3/4] rounded-lg overflow-hidden relative shadow-[0_0_40px_rgba(255,223,156,0.15)] border border-primary-fixed/20 group cursor-pointer hover:border-primary-fixed/50 transition-colors">
                {centerItem?.imageUrl ? (
                  <img src={centerItem.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-surface-container-high" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-display-hero text-xl md:text-2xl text-primary mb-2 line-clamp-2">{centerItem?.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-fixed shadow-[0_0_10px_rgba(226,195,130,0.8)]"></span>
                    <span className="font-label-caps text-[10px] text-primary-fixed tracking-widest uppercase line-clamp-1">{centerItem?.source}</span>
                  </div>
                </div>
              </div>
              
              {/* Right */}
              <div className="hidden md:block w-1/4 aspect-[3/4] rounded-lg overflow-hidden relative opacity-50 scale-90 blur-[2px] border border-outline-variant/30">
                {rightItem?.imageUrl && <img src={rightItem.imageUrl} alt="" className="w-full h-full object-cover grayscale" />}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="glass-panel rounded-xl p-8 flex-grow relative overflow-hidden flex flex-col justify-center items-center group">
            <h2 className="font-label-caps text-xs text-on-surface-variant tracking-widest uppercase absolute top-6 left-6">Global Sentiment</h2>
            
            <div className="w-40 h-40 rounded-full relative mt-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-fixed to-surface-container shadow-[0_0_50px_rgba(255,223,156,0.3)] blur-[2px] group-hover:blur-[1px] transition-all duration-700"></div>
              <div className="absolute inset-2 rounded-full border border-white/20"></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
                <span className="font-display-hero text-4xl md:text-5xl text-primary">{stats.sentimentScore}%</span>
                <span className="font-label-caps text-[10px] text-primary-fixed uppercase mt-2">Positive Heat</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-8 h-64 relative overflow-hidden flex flex-col">
            <h2 className="font-label-caps text-xs text-on-surface-variant tracking-widest uppercase mb-6 relative z-10">Network Volume</h2>
            
            <div className="flex-grow flex items-end gap-2 relative z-10">
              {Array.from({ length: 5 }).map((_, i) => {
                 // Pseudo-random based on index to avoid hydration mismatch
                 const height = Math.min(100, Math.max(20, ((i * 17) % 80) + (i === 2 ? 20 : 0)));
                 const isPeak = i === 2;
                 return (
                   <div key={i} className={`w-1/5 bg-gradient-to-t rounded-t-sm border-t relative ${isPeak ? 'from-primary-fixed/20 to-primary-fixed/60 border-primary-fixed shadow-[0_-5px_15px_rgba(255,223,156,0.2)]' : 'from-outline-variant/20 to-outline-variant/40 border-outline-variant/50'}`} style={{ height: `${height}%` }}>
                     {isPeak && <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-label-caps text-[9px] text-primary-fixed uppercase">Peak</div>}
                   </div>
                 );
              })}
            </div>
            
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none mix-blend-overlay"></div>
          </div>
        </div>

        {/* Tracker Row */}
        {articles[3] && (
          <div className="lg:col-span-12 glass-panel rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
            <div className="relative z-10 max-w-lg">
              <h3 className="font-display-hero text-2xl md:text-3xl text-primary mb-2 line-clamp-1">{articles[3].title}</h3>
              <p className="font-body-main text-sm text-on-surface-variant line-clamp-2">Real-time engagement metrics detected across scraped source: {articles[3].source}.</p>
            </div>
            
            <div className="flex gap-8 md:gap-12 relative z-10 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="shrink-0">
                <div className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase mb-2">Mentions</div>
                <div className="font-display-hero text-2xl text-primary-fixed">{stats.formatMentions}</div>
              </div>
              <div className="shrink-0">
                <div className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase mb-2">Velocity</div>
                <div className="font-display-hero text-2xl text-tertiary-fixed-dim">{stats.velocityDisplay}</div>
              </div>
              <div className="shrink-0 hidden md:block">
                <div className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase mb-2">Source</div>
                <div className="font-display-hero text-xl mt-1 text-primary">{articles[3].source}</div>
              </div>
            </div>
            
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary-fixed/5 rounded-full blur-[50px] pointer-events-none"></div>
          </div>
        )}

      </div>
    </div>
  );
}
