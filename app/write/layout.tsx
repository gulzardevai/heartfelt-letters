import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.shareloveletters.com/write' },
  title: 'Free Love Letter Generator Online | ShareLove Letters',
  description: 'Free love letter generator: pick a template for her, him, family or friends, personalize it, and share a beautiful letter via private link. No signup needed.',
  keywords: 'free love letter generator, write a love letter online, love letter templates free, free love letters for her, free love letters for him',
}

export default function WriteLayout({ children }: { children: React.ReactNode }) {
  return children
}
