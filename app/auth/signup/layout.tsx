import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up Free | ShareLove Letters',
  alternates: { canonical: 'https://www.shareloveletters.com/auth/signup' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
