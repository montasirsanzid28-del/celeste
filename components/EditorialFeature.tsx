'use client';
import { useNewsStore } from '@/store/newsStore';

export function EditorialFeature() {
  const articles = useNewsStore(state => state.articles);
  
  if (articles.length === 0) return null;
  
  const feature = articles[0]; // Use the most recent full article

  return (
    <div className="flex-1 w-full relative z-10">
      <header className="relative h-[60vh] md:h-[800px] w-full overflow-hidden flex items-end pb-24 md:pb-48">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity" 
          style={{ backgroundImage: `url('${feature.imageUrl}')`, backgroundAttachment: 'fixed' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div className="relative z-10 px-6 md:px-12 lg:px-16 w-full max-w-7xl mx-auto">
          <p className="font-label-caps text-xs text-primary-fixed mb-4 tracking-widest uppercase">Exclusive Feature</p>
          <h1 className="font-display-hero text-4xl md:text-6xl lg:text-7xl text-primary drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] max-w-5xl leading-tight">
            {feature.title}
          </h1>
        </div>
      </header>
      
      <main className="relative z-20 px-6 md:px-12 lg:px-16 -mt-16 pb-32">
        <div className="max-w-7xl mx-auto">
          <article className="glass-panel rounded-2xl p-8 md:p-16 lg:p-24 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            <header className="mb-16 max-w-3xl">
              <h2 className="font-display-hero text-2xl md:text-4xl text-primary-fixed mb-8 leading-snug">
                Analysis of the cultural impact and propagation metrics across the network.
              </h2>
              <div className="flex items-center gap-4 border-t border-outline-variant/30 pt-6">
                <div>
                  <p className="font-label-caps text-xs text-primary uppercase tracking-widest">BY {feature.source.toUpperCase()}</p>
                  <p className="font-body-main text-sm text-on-surface-variant mt-1">{new Date(feature.pubDate).toLocaleDateString()}</p>
                </div>
              </div>
            </header>
            
            <div className="font-body-main text-base text-on-surface-variant space-y-8 max-w-4xl columns-1 lg:columns-2 gap-16 leading-relaxed">
              <p className="first-letter:text-5xl first-letter:font-display-hero first-letter:text-primary-fixed first-letter:mr-3 first-letter:float-left" dangerouslySetInnerHTML={{__html: feature.contentSnippet}} />
              
              <p>
                As detected by our metadata extraction protocols, this intercept highlights significant structural changes in the elite zeitgeist. The neural network identified key velocity patterns surrounding this release. 
              </p>
              
              <p>
                &quot;The data is undeniable,&quot; states the internal analytic node. &quot;Engagement metrics surged precisely when this dropped. We are seeing a complete re-alignment of influence parameters.&quot;
              </p>

              <p>
                This aligns perfectly with broader tracking movements across our other scraping targets. The enduring impact demands closer monitoring of the involved entities.
              </p>
            </div>
            
            {articles[1] && articles[1].imageUrl && (
              <figure className="my-24 w-full group">
                <div className="relative overflow-hidden rounded-xl bg-surface-container-high h-[400px] md:h-[600px]">
                  <img src={articles[1].imageUrl} alt={articles[1].title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                </div>
                <figcaption className="mt-4 font-label-caps text-[10px] text-on-surface-variant text-right uppercase tracking-widest">
                  RELATED INTERCEPT: {articles[1].title}
                </figcaption>
              </figure>
            )}
            
          </article>
        </div>
      </main>
    </div>
  );
}
