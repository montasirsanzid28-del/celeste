import { create } from 'zustand';

export type TabType = 'latest' | 'exclusives' | 'runway' | 'archives';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface NeuralData {
  tldr: string[];
  hypeScore: number;
  entities: {
    celebrities: string[];
    brands: string[];
    locations: string[];
  };
}

export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  source: string;
  contentSnippet: string;
  imageUrl: string | null;
  neuralData?: NeuralData;
  isAnalyzing?: boolean;
}

interface NewsState {
  articles: Article[];
  logs: string[];
  isScraping: boolean;
  lastSync: Date | null;
  scrapeNews: () => Promise<void>;
  analyzeArticle: (id: string) => Promise<void>;
  showTerminal: boolean;
  setShowTerminal: (show: boolean) => void;
  terminalLogs: string[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  toasts: Toast[];
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  articles: [],
  logs: [],
  isScraping: false,
  lastSync: null,
  showTerminal: false,
  terminalLogs: [],
  activeTab: 'latest',
  toasts: [],
  setActiveTab: (tab) => set({ activeTab: tab }),
  setShowTerminal: (show) => set({ showTerminal: show }),
  addToast: (message, type) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 5000);
  },
  analyzeArticle: async (id) => {
    const state = get();
    const article = state.articles.find(a => a.id === id);
    if (!article || article.neuralData || article.isAnalyzing) return;

    set(state => ({
      articles: state.articles.map(a => a.id === id ? { ...a, isAnalyzing: true } : a)
    }));

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
         throw new Error("Neural Engine offline: Missing Gemini API Key");
      }

      // Dynamic import to avoid next.js ssr issues with genai
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Analyze the following gossip article snippet.
Title: ${article.title}
Source: ${article.source}
Content: ${article.contentSnippet}

Extract the requested neural data:
1. TL;DR: 3 snarky, short bullet points summarizing the article.
2. Hype Score: A number from 1 to 100 representing how exaggerated, sensational, or "clickbaity" the text is.
3. Entities: Key celebrities, brands/designers, and locations mentioned.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite", // As requested by user
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tldr: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 short, snarky bullet points summarizing the gossip"
              },
              hypeScore: {
                type: Type.INTEGER,
                description: "A score from 1 to 100 for how sensational the text is"
              },
              entities: {
                type: Type.OBJECT,
                properties: {
                  celebrities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  brands: { type: Type.ARRAY, items: { type: Type.STRING } },
                  locations: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            required: ["tldr", "hypeScore", "entities"]
          }
        }
      });

      const jsonStr = response.text?.trim() || "{}";
      const neuralData = JSON.parse(jsonStr) as NeuralData;

      set(state => ({
        articles: state.articles.map(a => a.id === id ? { ...a, isAnalyzing: false, neuralData } : a)
      }));
      
      get().addToast(`Neural extraction complete for "${article.title.substring(0, 20)}..."`, 'success');

    } catch (err: any) {
      set(state => ({
        articles: state.articles.map(a => a.id === id ? { ...a, isAnalyzing: false } : a)
      }));
      get().addToast(err.message || 'Neural Extraction failed', 'error');
    }
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  scrapeNews: async () => {
    set({ isScraping: true, showTerminal: true, terminalLogs: ['[SYSTEM] Initializing neural scrape protocol...'] });
    try {
      const res = await fetch('/api/scrape');
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sync with syndicate nodes');
      }
      
      if (data.articles && data.articles.length > 0) {
        set({ 
          articles: data.articles, 
          lastSync: new Date(),
        });
        get().addToast(`Synced ${data.articles.length} new intercepts.`, 'success');
      } else {
        get().addToast('No new intercepts found.', 'info');
      }
      
      if (data.logs) {
         let currentLogs = ['[SYSTEM] Initializing neural scrape protocol...'];
         for(let i = 0; i < data.logs.length; i++) {
            await new Promise(r => setTimeout(r, 100)); // faster staggered effect
            currentLogs.push(data.logs[i]);
            set({ terminalLogs: [...currentLogs] });
         }
      }

    } catch (e: any) {
      set((state) => ({ 
        terminalLogs: [...state.terminalLogs, `[ERROR] Scrape protocol encountered a fatal error: ${e.message}`] 
      }));
      get().addToast(e.message || 'Scrape operation failed.', 'error');
    } finally {
      set({ isScraping: false });
    }
  }
}));
