import love from '@/data/quotes/love.json'
import friendship from '@/data/quotes/friendship.json'
import family from '@/data/quotes/family.json'
import gratitude from '@/data/quotes/gratitude.json'
import encouragement from '@/data/quotes/encouragement.json'
import apology from '@/data/quotes/apology.json'
import celebration from '@/data/quotes/celebration.json'

export interface Quote {
  id: string
  text: string
  author: string
  category: string
}

export const QUOTE_CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'love', label: 'Love & Romance', emoji: '❤️' },
  { id: 'friendship', label: 'Friendship', emoji: '🤝' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { id: 'encouragement', label: 'Encouragement', emoji: '🌟' },
  { id: 'apology', label: 'Apology', emoji: '🕊️' },
  { id: 'celebration', label: 'Celebration', emoji: '🎉' },
]

export const QUOTES: Quote[] = [
  ...love,
  ...friendship,
  ...family,
  ...gratitude,
  ...encouragement,
  ...apology,
  ...celebration,
].map((q, i) => ({ q: q as Quote, sort: ((i + 1) * 2654435761) % 4294967296 }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ q }) => q)

// ---------------------------------------------------------------------------
// Per-category SEO landing pages (/quotes/[category])
// Each maps to a real library category (100 quotes) so the page is substantial,
// with a unique H1/title/meta, an intro and a CTA into /write.
// ---------------------------------------------------------------------------

export type QuoteCategoryPage = {
  slug: string
  category: string       // matches quote.category
  emoji: string
  name: string           // short label for lists/breadcrumbs
  h1: string
  metaTitle: string
  metaDescription: string
  intro: string
  writeType: string      // LETTER_TYPES id for the "write a letter" CTA
  related: string[]      // slugs
}

export const QUOTE_CATEGORY_PAGES: QuoteCategoryPage[] = [
  {
    slug: 'love',
    category: 'love',
    emoji: '❤️',
    name: 'Love',
    h1: 'Love Quotes for Letters & Messages',
    metaTitle: 'Love Quotes for a Letter — 100 Free Romantic Quotes to Copy',
    metaDescription: 'Browse 100 free love quotes to put in a love letter, card or message. Copy any romantic quote in one tap, then drop it straight into a letter — free, no account.',
    intro: 'The right line at the top of a love letter does half the work for you. Here are 100 of the most quotable things ever written about love — from Shakespeare to modern voices. Copy any of them for a card or message, or use one to open a letter and finish it in your own words.',
    writeType: 'love',
    related: ['friendship', 'family', 'celebration'],
  },
  {
    slug: 'friendship',
    category: 'friendship',
    emoji: '🤝',
    name: 'Friendship',
    h1: 'Friendship Quotes for Letters & Cards',
    metaTitle: 'Friendship Quotes — 100 Free Quotes for a Best Friend, to Copy',
    metaDescription: 'Browse 100 free friendship quotes for a best friend, card or letter. Copy any quote in one tap and use it to tell a friend what they mean to you — free, no account.',
    intro: 'Most friends never get told what they mean to us. A single well-chosen line can start that conversation. Here are 100 free friendship quotes — copy one for a card or message, or use it to open a letter to the friend who has always shown up.',
    writeType: 'friendship',
    related: ['love', 'gratitude', 'celebration'],
  },
  {
    slug: 'family',
    category: 'family',
    emoji: '👨‍👩‍👧',
    name: 'Family',
    h1: 'Family Quotes for Letters & Messages',
    metaTitle: 'Family Quotes — 100 Free Quotes About Family, to Copy',
    metaDescription: 'Browse 100 free quotes about family for a letter, card or message to a parent, sibling or child. Copy any quote in one tap and make it the heart of your letter — free.',
    intro: 'Family is the hardest thing to put into words precisely because it is so constant. These 100 quotes give you a place to start — for a letter to a parent, a sibling or a child. Copy one, then say the specific thing only your family would understand.',
    writeType: 'thank_you',
    related: ['love', 'gratitude', 'friendship'],
  },
  {
    slug: 'gratitude',
    category: 'gratitude',
    emoji: '🙏',
    name: 'Gratitude',
    h1: 'Gratitude & Thank You Quotes for Letters',
    metaTitle: 'Thank You Quotes — 100 Free Gratitude Quotes to Copy',
    metaDescription: 'Browse 100 free gratitude and thank you quotes for a letter, card or message. Copy any quote in one tap and use it to thank someone properly — free, no account needed.',
    intro: 'Gratitude is easy to feel and strangely hard to deliver. A good quote gives your thank-you letter a doorway in. Here are 100 free quotes about gratitude — copy one for a card, or use it to open a letter to the person who deserves a real thank-you.',
    writeType: 'thank_you',
    related: ['family', 'friendship', 'celebration'],
  },
  {
    slug: 'encouragement',
    category: 'encouragement',
    emoji: '🌟',
    name: 'Encouragement',
    h1: 'Encouragement Quotes for Letters & Cards',
    metaTitle: 'Encouragement Quotes — 100 Free Quotes to Lift Someone Up',
    metaDescription: 'Browse 100 free encouragement and strength quotes for a letter or card to a friend going through a hard time. Copy any quote in one tap — free, no account needed.',
    intro: 'When someone you love is struggling, the right words are hard to find on the spot. These 100 encouragement quotes give you somewhere to begin. Copy one for a message, or use it to open a letter that reminds them what they are capable of.',
    writeType: 'friendship',
    related: ['friendship', 'gratitude', 'love'],
  },
  {
    slug: 'apology',
    category: 'apology',
    emoji: '🕊️',
    name: 'Apology',
    h1: 'Apology & Forgiveness Quotes for Letters',
    metaTitle: 'Apology Quotes — 100 Free Sorry & Forgiveness Quotes to Copy',
    metaDescription: 'Browse 100 free apology and forgiveness quotes for a heartfelt sorry letter or message. Copy any quote in one tap and use it to say sorry properly — free, no account.',
    intro: 'A quote will not apologise for you, but it can help you find the tone. These 100 quotes about apology and forgiveness are a starting point — copy one, then say plainly what you did, what it cost, and what you will do differently.',
    writeType: 'apology',
    related: ['love', 'friendship', 'family'],
  },
  {
    slug: 'celebration',
    category: 'celebration',
    emoji: '🎉',
    name: 'Celebration',
    h1: 'Celebration Quotes for Birthdays & Congratulations',
    metaTitle: 'Celebration Quotes — 100 Free Birthday & Congrats Quotes to Copy',
    metaDescription: 'Browse 100 free celebration quotes for birthdays, graduations, new jobs and congratulations letters. Copy any quote in one tap and make the card yours — free, no account.',
    intro: 'Every celebration message starts to sound the same. A great quote sets yours apart. Here are 100 free quotes for birthdays, graduations and every kind of good news — copy one for a card, or use it to open a congratulations letter.',
    writeType: 'congratulations',
    related: ['friendship', 'gratitude', 'love'],
  },
]

export function getQuoteCategoryPage(slug: string): QuoteCategoryPage | undefined {
  return QUOTE_CATEGORY_PAGES.find(c => c.slug === slug)
}

export function getQuotesByCategory(category: string): Quote[] {
  return QUOTES.filter(q => q.category === category)
}

// Deterministic quote of the day — same quote for everyone on a given date
export function getQuoteOfTheDay(): Quote {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000)
  const index = (dayOfYear * 31 + now.getFullYear()) % QUOTES.length
  return QUOTES[index]
}
