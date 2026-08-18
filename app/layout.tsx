import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Playfair_Display, Inter, Dancing_Script } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import AdSenseScript from '@/components/AdSenseScript'
import { AuthProvider } from '@/components/AuthProvider'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dancing',
  display: 'swap',
})

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.shareloveletters.com/' },
  metadataBase: new URL('https://www.shareloveletters.com'),
  title: 'Free Love Letters Online | ShareLove Letters',
  description: 'Write free love letters online with beautiful templates. AES-256 encrypted, shared via a private link that opens like a sealed envelope. No account needed.',
  keywords: 'free love letters, free love letter generator, love letter templates free, write a love letter online, letter writing, birthday letters, heartfelt messages',
  openGraph: {
    title: 'ShareLove Letters — Free Love Letters Online',
    description: 'Free, encrypted love letters shared as sealed envelopes. Beautiful templates, private links, no account needed.',
    type: 'website',
  },
}

// Sitewide entity graph. AI answer engines resolve a brand as an ENTITY before
// they will cite it, and until 2026-08-18 the only Organization node on the site
// was on /about — effectively invisible. The @id values are stable URIs so other
// schema on the site can reference this node rather than redeclaring it.
const siteJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.shareloveletters.com/#organization',
    name: 'ShareLove Letters',
    url: 'https://www.shareloveletters.com',
    description:
      'A free, encrypted letter-writing app for sending heartfelt letters via a private link — opened like a real envelope.',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.shareloveletters.com/opengraph-image.png',
    },
    email: 'hello@shareloveletters.com',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.shareloveletters.com/#website',
    name: 'ShareLove Letters',
    url: 'https://www.shareloveletters.com',
    publisher: { '@id': 'https://www.shareloveletters.com/#organization' },
    inLanguage: 'en',
  },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${dancing.variable}`}>
      <body className="min-h-screen bg-cream">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <AdSenseScript />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fdf8f0',
              color: '#2c1810',
              border: '1px solid #fecdd3',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#e11d48',
                secondary: '#fdf8f0',
              },
            },
          }}
        />
      </body>
      <GoogleAnalytics gaId="G-EEQZTB0DFJ" />
    </html>
  )
}
