import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '700+ Free Love Quotes & Letter Quotes by Category',
  description: 'Browse 700+ free quotes for love letters — romance, friendship, family, gratitude, apology and more. Copy any quote free or save favorites for your next letter.',
  keywords: 'quotes to put in a love letter, free love quotes, encouragement quotes for a friend, thinking of you quotes',
  alternates: { canonical: 'https://www.shareloveletters.com/quotes' },
}

export default function QuotesLayout({ children }: { children: React.ReactNode }) {
  return children
}
