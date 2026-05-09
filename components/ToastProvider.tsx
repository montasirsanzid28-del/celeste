'use client';
import { useNewsStore } from '@/store/newsStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastProvider() {
  const toasts = useNewsStore(state => state.toasts);
  const removeToast = useNewsStore(state => state.removeToast);

  return (
    <div className="fixed bottom-24 md:bottom-auto md:top-24 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className="pointer-events-auto flex items-center gap-3 p-4 glass-panel rounded-lg shadow-2xl border border-white/10 animate-in slide-in-from-right-8 fade-in duration-300 w-80"
        >
          {toast.type === 'success' && <CheckCircle2 className="text-secondary-fixed-dim" size={20} />}
          {toast.type === 'error' && <AlertCircle className="text-error" size={20} />}
          {toast.type === 'info' && <Info className="text-primary-fixed-dim" size={20} />}
          
          <p className="flex-1 font-body-main text-sm text-on-surface">{toast.message}</p>
          
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-on-surface-variant hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
