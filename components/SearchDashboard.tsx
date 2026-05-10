'use client';
import { useNewsStore } from '@/store/newsStore';
import { NeuralExtraction } from './NeuralExtraction';
import { formatDistanceToNow } from 'date-fns';
import { Search, Clock, Trash2, ArrowRight } from 'lucide-react';

export function SearchDashboard() {
  const { 
    searchQuery, searchHistory, searchResults, 
    isScraping, searchNews, clearSearchHistory 
  } = useNewsStore();

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full pt-40 md:pt-32 pb-32 px-6 md:px-12 lg:px-16 space-y-8 relative z-10 min-h-screen flex flex-col">
      <div className="mb-8 border-b border-white/10 pb-8">
        <h1 className="font-display-hero text-3xl md:text-5xl text-primary mb-2">
          {searchQuery ? `Target: "${searchQuery}"` : 'Targeted Intel Search'}
        </h1>
        <p className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">
          {searchQuery ? 'Analyzing historical archives and live feeds...' : 'Access global network queries'}
        </p>
      </div>

      {!searchQuery && (
        <div className="glass-panel p-8 rounded-xl max-w-3xl flex-1 flex flex-col self-center w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-label-caps text-xs text-on-surface uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} /> Previous Targets
            </h2>
            {searchHistory.length > 0 && (
              <button 
                onClick={clearSearchHistory}
                className="text-xs text-on-surface-variant hover:text-error transition-colors flex items-center gap-1"
              >
                <Trash2 size={14} /> Clear History
              </button>
            )}
          </div>
          
          {searchHistory.length === 0 ? (
            <div className="text-on-surface-variant font-body-main text-sm italic flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-lg min-h-[200px]">
              No previous targets logged in current session.
            </div>
          ) : (
            <ul className="space-y-2">
              {searchHistory.map((historyItem, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => searchNews(historyItem)}
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-surface-container/30 hover:bg-surface-container border border-white/5 hover:border-primary-fixed-dim/30 transition-all group"
                  >
                    <span className="font-body-main text-sm text-on-surface flex items-center gap-3">
                      <Search size={14} className="text-on-surface-variant group-hover:text-primary-fixed-dim transition-colors" />
                      {historyItem}
                    </span>
                    <ArrowRight size={14} className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {searchQuery && isScraping && (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-2 border-primary-fixed-dim/30 border-t-primary-fixed-dim rounded-full animate-spin mb-4"></div>
          <p className="font-label-caps text-xs text-primary-fixed-dim uppercase tracking-widest animate-pulse">Running targeted scrape protocol...</p>
        </div>
      )}

      {searchQuery && !isScraping && searchResults.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center glass-panel rounded-xl min-h-[400px]">
          <Search size={32} className="mx-auto text-on-surface-variant mb-4 opacity-50" />
          <p className="font-body-main text-lg text-on-surface">No intelligence found for &quot;{searchQuery}&quot;.</p>
          <p className="font-body-main text-sm text-on-surface-variant mt-2">The targeted entity might not be trending or lacks digital presence in monitored nodes.</p>
        </div>
      )}

      {searchQuery && !isScraping && searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((article) => (
            <a 
              key={article.id} 
              href={article.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-panel rounded-xl overflow-hidden group hover:border-primary-fixed-dim/40 transition-colors flex flex-col relative"
            >
              <div className="h-48 relative overflow-hidden bg-surface-container">
                {article.imageUrl ? (
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity group-hover:scale-105 duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">No Visual Data</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <span className="font-label-caps text-[10px] text-primary-fixed-dim uppercase tracking-widest mb-2 border border-primary-fixed-dim/30 px-2 py-0.5 rounded inline-block w-fit">{article.source}</span>
                <h3 className="font-display-hero text-xl text-on-surface mb-3 line-clamp-3 leading-snug group-hover:text-primary-fixed transition-colors">{article.title}</h3>
                <p className="font-body-main text-sm text-on-surface-variant line-clamp-3 flex-1" dangerouslySetInnerHTML={{__html: article.contentSnippet}} />
                
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant opacity-70 font-label-caps">
                    {formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="mt-3">
                   <NeuralExtraction article={article} />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
