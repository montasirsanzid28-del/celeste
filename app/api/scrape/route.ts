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
  { url: 'https://people.com/feed/', source: 'People' },
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

export async function GET() {
  try {
    const allArticles: any[] = [];
    const logs: string[] = [];
    logs.push(`[SYS_TIME: ${new Date().toISOString()}] Connection established to global fashion syndicate nodes...`);

    for (const feed of FEEDS) {
      try {
        logs.push(`[DATA] Ingesting stream from ${feed.source}...`);
        const parsed = await parser.parseURL(feed.url);
        
        parsed.items.forEach(item => {
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
        });
        logs.push(`[ANALYSIS] Successfully parsed ${parsed.items.length} records from ${feed.source}.`);
      } catch(e: any) {
        logs.push(`[WARN] Failed handshake at ${feed.source} relay. Attempting bypass... Error: ${e.message}`);
        console.error(`Failed to parse feed ${feed.url}`, e);
      }
    }

    allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    logs.push(`> Awaiting further packets...`);

    return NextResponse.json({ 
      articles: allArticles.filter(a => a.imageUrl).slice(0, 100), // Filter out articles without images to keep UI nice.
      logs 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to complete scrape operation', details: String(error) }, { status: 500 });
  }
}
