import type {Metadata} from 'next';
import { Bodoni_Moda, Sora, Fira_Code } from 'next/font/google';
import './globals.css';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
});

export const metadata: Metadata = {
  title: 'CELESTE - Certified Celebrity News Scraper',
  description: 'Real-time analysis of elite cultural impact. Certified celebrity news scraper.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${bodoni.variable} ${sora.variable} ${firaCode.variable}`}>
      <body className="antialiased selection:bg-primary-fixed selection:text-on-primary-fixed" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
