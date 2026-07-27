import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | ShareLove Letters',
  alternates: { canonical: 'https://www.shareloveletters.com/auth/login' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
