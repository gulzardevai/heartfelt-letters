import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | ShareLove Letters',
  alternates: { canonical: 'https://www.shareloveletters.com/contact' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
