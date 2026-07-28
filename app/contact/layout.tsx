import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.shareloveletters.com/contact' },
  title: 'Contact & FAQ | ShareLove Letters',
  description: 'Questions about ShareLove Letters? Read our FAQ on letter expiry, password protection, sharing and privacy, or send us a message. We are happy to help.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
