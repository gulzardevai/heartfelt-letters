import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '700+ Free Love Quotes & Letter Quotes by Category',
  description: 'Browse 700+ free quotes for love letters — romance, friendship, family, gratitude, apology and more. Copy any quote free or save favorites for your next letter.',
  keywords: 'quotes to put in a love letter, free love quotes, encouragement quotes for a friend, thinking of you quotes',
  alternates: { canonical: 'https://www.shareloveletters.com/quotes' },
  // NOINDEX (2026-08-18). Applies to /quotes and every /quotes/[category].
  //
  // This section is 11 pages where ~56% of the words sit inside <blockquote> —
  // seven of them carry 100 quotes each, attributed to Shakespeare, Angelou,
  // Austen, Lennon, Sparks. Aggregated quote collections are a classic AdSense
  // "Low value content" trigger, and shareloveletters.com has now been rejected
  // for exactly that twice (2026-08-04 and 2026-08-17). Two prior remediations
  // both measured WORD COUNT and so ranked these pages among the site's best:
  // they run 2,600-2,900 words while being the least original thing here.
  //
  // The cost of removing them from the index is close to nothing: 28d to
  // 2026-08-17 they drew 339 impressions (7.4% of the site) and ZERO clicks
  // across all eleven.
  //
  // `follow: true` deliberately — the pages stay crawlable and keep passing
  // link equity, and they stay fully live in the nav, /write and the letter
  // pages, because "borrow a line from our 700+ quotes" is a real writing aid
  // that serves goal 1 (letters written) and goal 3 (UX). Goal 4 does not get
  // to delete a product feature.
  //
  // To reverse this: cut each page to ~15 quotes with genuine original
  // commentary per quote, so the majority of the page is ours, then drop this
  // block and restore the sitemap entries in app/sitemap.ts.
  robots: { index: false, follow: true },
}

export default function QuotesLayout({ children }: { children: React.ReactNode }) {
  return children
}
