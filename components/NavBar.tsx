'use client';
import { useState } from 'react';
import { useNewsStore, TabType } from '@/store/newsStore';
import { Sparkles, Terminal, BookOpen, Clock, ScanEye, Search } from 'lucide-react';

export function NavBar() {
  const scrapeNews = useNewsStore(state => state.scrapeNews);
  const searchNews = useNewsStore(state => state.searchNews);
  const isScraping = useNewsStore(state => state.isScraping);
  const activeTab = useNewsStore(state => state.activeTab);
  const setActiveTab = useNewsStore(state => state.setActiveTab);
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchNews(query.trim());
      setQuery('');
    }
  };

  const getNavClass = (tab: TabType) => 
    activeTab === tab 
      ? 'text-primary-fixed-dim border-b border-primary-fixed-dim pb-1' 
      : 'text-on-surface-variant/80 hover:text-primary-fixed transition-colors';

  const getMobileNavClass = (tab: TabType) => 
    activeTab === tab
      ? 'flex flex-col items-center justify-center text-primary-fixed bg-white/5 rounded-lg p-2 active:scale-95 transition-transform'
      : 'flex flex-col items-center justify-center text-on-surface-variant/60 p-2 hover:text-primary-fixed-dim hover:bg-white/10 transition-all';

  return (
    <>
      <nav className="hidden md:flex bg-surface/60 backdrop-blur-2xl text-primary-fixed-dim fixed top-0 w-full z-50 border-b border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] justify-between items-center px-8 lg:px-12 py-6 hover:backdrop-blur-3xl hover:bg-white/5 transition-all duration-300">
        <div className="font-display-hero text-2xl lg:text-3xl tracking-tighter text-primary-fixed-dim uppercase">CELESTE</div>
        <div className="flex gap-8 font-label-caps text-sm uppercase font-bold tracking-widest items-center">
          <button onClick={() => setActiveTab('latest')} className={getNavClass('latest')}>Latest</button>
          <button onClick={() => setActiveTab('exclusives')} className={getNavClass('exclusives')}>Exclusives</button>
          <button onClick={() => setActiveTab('runway')} className={getNavClass('runway')}>Runway</button>
          <button onClick={() => setActiveTab('archives')} className={getNavClass('archives')}>Archives</button>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden lg:flex items-center px-3 py-1 rounded-full border border-primary-fixed-dim/30 bg-primary-fixed-dim/5 shadow-[0_0_10px_rgba(202,196,208,0.2)]">
            <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed-dim">Developed by Mont</span>
          </div>
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder="TARGET OVERRIDE..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-surface-container/50 border border-primary-fixed-dim/20 rounded-full px-4 py-2 font-label-caps text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-fixed-dim/60 transition-colors w-48 focus:w-64"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-fixed-dim hover:text-primary-fixed">
              <Search size={14} />
            </button>
          </form>
          <button 
            onClick={scrapeNews}
            disabled={isScraping}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isScraping ? 'border-secondary-fixed-dim text-secondary-fixed-dim' : 'border-primary-fixed-dim/30 text-primary-fixed-dim hover:bg-primary-fixed-dim/10'} transition-all cursor-pointer`}
          >
            <ScanEye size={18} className={isScraping ? 'animate-pulse' : ''} />
            <span className="font-label-caps text-xs uppercase tracking-widest">{isScraping ? 'Syncing...' : 'Force Sync'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <nav className="md:hidden bg-surface-container-lowest/80 backdrop-blur-md text-primary-fixed-dim fixed bottom-0 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl rounded-t-xl mb-0 border-t border-l border-r border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.4)] flex justify-around items-center px-6 py-3 z-50">
        <button onClick={() => setActiveTab('latest')} className={getMobileNavClass('latest')}>
          <Sparkles size={20} className="mb-1" />
          <span className="font-label-caps uppercase text-[10px]">Latest</span>
        </button>
        <button onClick={() => setActiveTab('exclusives')} className={getMobileNavClass('exclusives')}>
          <BookOpen size={20} className="mb-1" />
          <span className="font-label-caps uppercase text-[10px]">Excls</span>
        </button>
        <button onClick={() => setActiveTab('runway')} className={getMobileNavClass('runway')}>
          <Clock size={20} className="mb-1" />
          <span className="font-label-caps uppercase text-[10px]">Runway</span>
        </button>
        <button onClick={() => setActiveTab('archives')} className={getMobileNavClass('archives')}>
          <Terminal size={20} className="mb-1" />
          <span className="font-label-caps uppercase text-[10px]">Archive</span>
        </button>
      </nav>

      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 w-full z-40 flex flex-col gap-4 items-center px-6 py-6 bg-surface/90 backdrop-blur-md border-b border-white/5">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <div className="font-display-hero text-3xl tracking-tighter text-primary-fixed-dim uppercase leading-none">CELESTE</div>
            <div className="font-label-caps text-[8px] uppercase tracking-widest text-primary-fixed-dim/80 mt-1 drop-shadow-[0_0_5px_rgba(202,196,208,0.5)]">Developed by Mont</div>
          </div>
          <button 
              onClick={scrapeNews}
              disabled={isScraping}
              className={`w-10 h-10 flex items-center justify-center rounded-full border ${isScraping ? 'border-secondary-fixed-dim text-secondary-fixed-dim' : 'border-primary-fixed-dim/30 text-primary-fixed-dim'} transition-all`}
            >
              <ScanEye size={18} className={isScraping ? 'animate-pulse' : ''} />
          </button>
        </div>
        <form onSubmit={handleSearch} className="relative w-full">
          <input 
            type="text" 
            placeholder="TARGET OVERRIDE (e.g. jenna ortega)..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface-container/50 border border-primary-fixed-dim/20 rounded-full px-4 py-2 font-label-caps text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-fixed-dim/60 transition-colors"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-fixed-dim hover:text-primary-fixed">
            <Search size={14} />
          </button>
        </form>
      </header>
    </>
  );
}
