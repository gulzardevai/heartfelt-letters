import type { Metadata } from 'next'
import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Playfair_Display, Inter, Dancing_Script } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
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
  metadataBase: new URL('https://shareloveletters.com'),
  title: 'Free Love Letters Online — Write & Share Beautiful Letters | ShareLove Letters',
  description: 'Write free love letters online with beautiful templates. AES-256 encrypted, shared via a private link that opens like a sealed envelope. No account needed.',
  keywords: 'free love letters, free love letter generator, love letter templates free, write a love letter online, letter writing, birthday letters, heartfelt messages',
  openGraph: {
    title: 'ShareLove Letters — Free Love Letters Online',
    description: 'Free, encrypted love letters shared as sealed envelopes. Beautiful templates, private links, no account needed.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${dancing.variable}`}>
      <body className="min-h-screen bg-cream">
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1228680334439068"
          crossOrigin="anonymous"
        />
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
