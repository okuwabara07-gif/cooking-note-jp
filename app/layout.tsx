import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: '料理ノート',
  description: '料理・レシピの情報メディア',
  keywords: '料理ノート,料理・レシピの情報メディア',
  openGraph: {
    title: '料理ノート',
    description: '料理・レシピの情報メディア',
    type: 'website',
    locale: 'ja_JP',
    siteName: '料理ノート',
  },
  twitter: {
    card: 'summary_large_image',
    title: '料理ノート',
    description: '料理・レシピの情報メディア',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-SVQXY5C3PW"></script>
      <script dangerouslySetInnerHTML={{__html:`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-SVQXY5C3PW');`}} />
      <body>{children}</body>
    </html>
  )
}
