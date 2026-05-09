'use client';
import { NavBar } from '@/components/NavBar';
import { HomeDashboard } from '@/components/HomeDashboard';
import { EditorialFeature } from '@/components/EditorialFeature';
import { TrendingDashboard } from '@/components/TrendingDashboard';
import { NeuralAnalytics } from '@/components/NeuralAnalytics';
import { ScraperTerminal } from '@/components/ScraperTerminal';
import { ToastProvider } from '@/components/ToastProvider';
import { useNewsStore } from '@/store/newsStore';

export default function Page() {
  const activeTab = useNewsStore(state => state.activeTab);
  
  return (
    <div className="min-h-screen flex flex-col relative text-on-surface">
      <NavBar />
      
      {activeTab === 'latest' && <HomeDashboard />}
      {activeTab === 'exclusives' && <EditorialFeature />}
      {activeTab === 'runway' && <TrendingDashboard />}
      {activeTab === 'archives' && <NeuralAnalytics />}
      
      {activeTab === 'latest' && <ScraperTerminal />}
      <ToastProvider />
      
      {/* Decorative Aurora Elements (Global) */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden mix-blend-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-surface-tint/5 rounded-full blur-[120px] opacity-50 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-on-tertiary-fixed-variant/5 rounded-full blur-[150px] opacity-40"></div>
      </div>
    </div>
  );
}
