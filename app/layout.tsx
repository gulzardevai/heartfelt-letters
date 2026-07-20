import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Heartfelt Letters — Write Letters That Last Forever',
  description: 'Create beautiful, heartfelt letters for your loved ones. Share them via unique links or send directly to their inbox.',
  keywords: 'letter writing, love letters, birthday letters, heartfelt messages',
  openGraph: {
    title: 'Heartfelt Letters',
    description: 'Write letters that last forever',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream">
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
    </html>
  )
}
