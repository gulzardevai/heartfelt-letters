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

// Deterministic quote of the day — same quote for everyone on a given date
export function getQuoteOfTheDay(): Quote {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000)
  const index = (dayOfYear * 31 + now.getFullYear()) % QUOTES.length
  return QUOTES[index]
}
