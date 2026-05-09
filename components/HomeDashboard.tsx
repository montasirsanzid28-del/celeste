'use client';
import { useNewsStore } from '@/store/newsStore';
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

import { NeuralExtraction } from './NeuralExtraction';

export function HomeDashboard() {
  const articles = useNewsStore(state => state.articles);
  const scrapeNews = useNewsStore(state => state.scrapeNews);
  const lastSync = useNewsStore(state => state.lastSync);

  // Initialize data on first mount if empty
  useEffect(() => {
    if (articles.length === 0) {
      scrapeNews();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (articles.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-32 h-[50vh]">
        <div className="w-8 h-8 md:w-12 md:h-12 border-2 border-primary-fixed-dim border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-label-caps text-sm text-primary-fixed-dim uppercase tracking-widest animate-pulse">Initializing Neural Scrape...</p>
      </div>
    );
  }

  const coverStory = articles[0];
  const sideArticles = articles.slice(1, 3);
  const regularArticles = articles.slice(3, 11);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full pt-32 pb-32 px-6 md:px-12 lg:px-16 space-y-8 relative z-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display-hero text-3xl md:text-5xl text-primary mb-2">Latest Intercepts</h1>
          {lastSync && (
            <p className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-widest">
              Last Synced: {formatDistanceToNow(lastSync, { addSuffix: true })}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[300px] md:auto-rows-[400px]">
        
        {/* Cover Story (Spans 8 cols) */}
        {coverStory && (
          <a href={coverStory.link} target="_blank" rel="noopener noreferrer" className="md:col-span-8 md:row-span-2 relative overflow-hidden rounded-xl bg-surface-container/20 backdrop-blur-2xl border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] group cursor-pointer transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] flex flex-col">
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-1">
              {coverStory.imageUrl ? (
                <img src={coverStory.imageUrl} alt={coverStory.title} className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-80 transition-all duration-700" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container-lowest" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            </div>
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
              <div className="flex items-center gap-3 mb-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                <span className="font-label-caps text-[10px] text-primary-fixed tracking-widest uppercase border border-primary-fixed-dim/30 px-3 py-1 rounded-full">{coverStory.source}</span>
              </div>
              <h2 className="font-display-hero text-headline-lg-mobile md:text-5xl lg:text-6xl text-primary leading-tight mb-4 group-hover:text-primary-fixed transition-colors duration-500 drop-shadow-lg">
                {coverStory.title}
              </h2>
              <p className="font-body-main text-body-main text-on-surface-variant max-w-xl hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" dangerouslySetInnerHTML={{__html: coverStory.contentSnippet}} />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                <NeuralExtraction article={coverStory} />
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none"></div>
          </a>
        )}

        {/* Side Articles */}
        {sideArticles.map((article, idx) => (
          <a key={article.id} href={article.link} target="_blank" rel="noopener noreferrer" className="md:col-span-4 md:row-span-1 relative overflow-hidden rounded-xl glass-panel group cursor-pointer transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
              {article.imageUrl && (
                 <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"></div>
            </div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="font-label-caps text-[10px] text-outline mb-2 uppercase tracking-widest">{article.source}</span>
              <h3 className="font-display-hero text-2xl text-on-surface leading-snug group-hover:text-primary-fixed transition-colors line-clamp-3">{article.title}</h3>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <NeuralExtraction article={article} />
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl border border-white/5 pointer-events-none"></div>
          </a>
        ))}

        {/* Horizontal Highlight */}
        {regularArticles[0] && (
          <a href={regularArticles[0].link} target="_blank" rel="noopener noreferrer" className="md:col-span-12 md:row-span-1 relative overflow-hidden rounded-xl bg-surface-container/30 backdrop-blur-3xl border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] group cursor-pointer flex flex-col md:flex-row min-h-[300px]">
            <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center z-10 order-2 md:order-1">
              <span className="font-label-caps text-[10px] text-primary-fixed mb-4 uppercase tracking-widest">{regularArticles[0].source}</span>
              <h2 className="font-display-hero text-3xl lg:text-4xl text-primary mb-4 leading-tight group-hover:text-primary-fixed transition-colors">
                {regularArticles[0].title}
              </h2>
              <p className="font-body-main text-sm text-on-surface-variant line-clamp-3 max-w-md" dangerouslySetInnerHTML={{__html: regularArticles[0].contentSnippet}} />
              <div className="mt-4">
                <NeuralExtraction article={regularArticles[0]} />
              </div>
            </div>
            <div className="md:w-1/2 relative min-h-[200px] order-1 md:order-2 overflow-hidden">
               <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  {regularArticles[0].imageUrl && <img src={regularArticles[0].imageUrl} alt={regularArticles[0].title} className="w-full h-full object-cover opacity-70 mix-blend-overlay group-hover:opacity-90 transition-opacity" />}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background via-background/40 md:via-transparent to-transparent"></div>
               </div>
            </div>
            <div className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none z-20"></div>
          </a>
        )}
      </div>

      {/* Grid of smaller articles */}
      <h2 className="font-display-hero text-3xl md:text-4xl text-on-surface mt-16 mb-8">Archived Radar</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {regularArticles.slice(1).map(article => (
          <a key={article.id} href={article.link} target="_blank" rel="noopener noreferrer" className="glass-panel rounded-xl overflow-hidden group hover:border-primary-fixed-dim/30 hover:-translate-y-1 transition-all duration-300">
            {article.imageUrl && (
              <div className="aspect-video relative overflow-hidden">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                <span className="absolute bottom-2 left-3 font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed-dim bg-background/50 px-2 py-1 rounded backdrop-blur-md">
                   {article.source}
                </span>
              </div>
            )}
            <div className={`p-5 ${!article.imageUrl && 'pt-8'}`}>
              {!article.imageUrl && (
                 <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed-dim border border-primary-fixed-dim/20 px-2 py-1 rounded mb-3 inline-block">
                   {article.source}
                 </span>
              )}
              <h3 className="font-display-hero text-xl text-on-surface line-clamp-3 leading-snug group-hover:text-primary-fixed transition-colors">
                {article.title}
              </h3>
              <p className="mt-3 text-xs text-on-surface-variant font-body-main opacity-60">
                {formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })}
              </p>
              <div className="mt-2">
                 <NeuralExtraction article={article} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
