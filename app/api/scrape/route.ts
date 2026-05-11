import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:group', 'enclosure', 'content:encoded', 'dc:creator', 'pubDate', 'description'],
  }
});

const FEEDS = [
  { url: 'https://pagesix.com/feed/', source: 'Page Six' },
  { url: 'https://www.usmagazine.com/feed/', source: 'US Weekly' },
  { url: 'https://hollywoodlife.com/feed/', source: 'Hollywood Life' },
  { url: 'https://www.tmz.com/rss.xml', source: 'TMZ' },
  { url: 'https://variety.com/feed/', source: 'Variety' },
];

function extractImageFromHtml(html: string | undefined): string | null {
  if (!html) return null;
  const $ = cheerio.load(html);
  // Try to find the first image with a valid src
  const imgSrc = $('img').first().attr('src');
  if (imgSrc && imgSrc.startsWith('http')) {
    return imgSrc;
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    const allArticles: any[] = [];
    const logs: string[] = [];
    logs.push(`[SYS_TIME: ${new Date().toISOString()}] Connection established to global fashion syndicate nodes...`);

    let feedsToScrape = FEEDS;

    let wikipediaImageUrl = null;

    if (q) {
      logs.push(`[OVERRIDE] Executing targeted scrape protocol for entity: "${q}"...`);
      feedsToScrape = [
        { url: `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`, source: `Global News Node: ${q}` },
        { url: `https://news.google.com/rss/search?q=${encodeURIComponent(q)}+entertainment&hl=en-US&gl=US&ceid=US:en`, source: `Entertainment Node: ${q}` }
      ];

      try {
        const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(q)}&prop=pageimages&format=json&pithumbsize=800`);
        const wikiData = await wikiRes.json();
        const pages = wikiData?.query?.pages;
        if (pages) {
          const firstPage = Object.values(pages)[0] as any;
          if (firstPage?.thumbnail?.source) {
            wikipediaImageUrl = firstPage.thumbnail.source;
            logs.push(`[SYSTEM] Acquired subject visual profile from primary nodes.`);
          }
        }
      } catch (e) {
        logs.push(`[WARNING] Failed to acquire subject visual profile.`);
      }
    }

    for (const feed of feedsToScrape) {
      try {
        logs.push(`[DATA] Ingesting stream from ${feed.source}...`);
        const parsed = await parser.parseURL(feed.url);
        
        parsed.items.forEach(item => {
          try {
            let imageUrl = null;
            
            if (item['media:content'] && item['media:content']['$'] && item['media:content']['$']['url']) {
              imageUrl = item['media:content']['$']['url'];
            } else if (item['media:group'] && item['media:group']['media:content'] && item['media:group']['media:content'][0] && item['media:group']['media:content'][0]['$']) {
              imageUrl = item['media:group']['media:content'][0]['$']['url'];
            } else if (item.enclosure && item.enclosure.url) {
              imageUrl = item.enclosure.url;
            } else {
               // Fallback to HTML content parsing
               imageUrl = extractImageFromHtml(item['content:encoded'] || item.content || item.description);
            }

            if (!imageUrl && q) {
              if (wikipediaImageUrl) {
                // Determine deterministically whether to use wikipedia image or seed image
                // so the grid looks somewhat varied instead of repeating the same image 100 times.
                const randomId = (item.guid || item.link || "").length;
                if (randomId % 3 !== 0) {
                  imageUrl = wikipediaImageUrl;
                } else {
                  const seed = item.guid || item.link || Math.random().toString();
                  imageUrl = `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;
                }
              } else {
                const seed = item.guid || item.link || Math.random().toString();
                imageUrl = `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;
              }
            }

            if (item.title && item.link) {
              // strip html tags from content snippet if any exist
              let snippet = item.contentSnippet || item.content || item.description || "";
              snippet = cheerio.load(snippet).text().substring(0, 150) + "...";
              
              allArticles.push({
                 id: item.guid || item.link,
                 title: item.title,
                 link: item.link,
                 pubDate: item.pubDate || new Date().toISOString(),
                 creator: item.creator || item['dc:creator'] || feed.source,
                 source: feed.source,
                 contentSnippet: snippet,
                 imageUrl: imageUrl,
              });
            }
          } catch(err: any) {
             console.error(`Failed to parse item from ${feed.url}: `, err);
          }
        });
        logs.push(`[ANALYSIS] Successfully parsed ${parsed.items.length} records from ${feed.source}.`);
      } catch(e: any) {
        logs.push(`[WARN] Failed handshake at ${feed.source} relay. Attempting bypass... Error: ${e.message}`);
        console.error(`Failed to parse feed ${feed.url}`, e);
      }
    }

    const uniqueArticlesMap = new Map();
    allArticles.forEach(a => {
      if (!uniqueArticlesMap.has(a.id)) {
        uniqueArticlesMap.set(a.id, a);
      }
    });
    
    const uniqueArticles = Array.from(uniqueArticlesMap.values());
    uniqueArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    logs.push(`> Awaiting further packets...`);
    logs.push(`[TRADEMARK] © ALL SCRAPING BELONGS TO MONT`);

    return NextResponse.json({ 
      articles: q ? uniqueArticles.slice(0, 100) : uniqueArticles.filter(a => a.imageUrl).slice(0, 100), // Filter out articles without images only for general view to keep UI nice.
      logs 
    });
  } catch (error) {
    console.error('Fatal scrape error:', error);
    return NextResponse.json({ 
      articles: [],
      logs: [`[CRITICAL_FAILURE] Scrape operation aborted: ${String(error)}`]
    });
  }
}
