import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '料理NOTE | K-Beauty Portal',
  description: '調理器具・キッチン用品の最新情報',
  openGraph: {
    title: '料理NOTE',
    description: '調理器具・キッチン用品の最新情報',
    url: 'https://cooking-note-jp.vercel.app',
    siteName: 'K-Beauty Portal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '料理NOTE',
    description: '調理器具・キッチン用品の最新情報',
    site: '@beauty_note_j',
    creator: '@beauty_note_j',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
