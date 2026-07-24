import love from '@/data/quotes/love.json'
import friendship from '@/data/quotes/friendship.json'
import family from '@/data/quotes/family.json'
import gratitude from '@/data/quotes/gratitude.json'
import encouragement from '@/data/quotes/encouragement.json'
import apology from '@/data/quotes/apology.json'
import celebration from '@/data/quotes/celebration.json'
import thinkingOfYou from '@/data/quotes/thinking-of-you.json'
import missingYou from '@/data/quotes/missing-you.json'
import goodMorning from '@/data/quotes/good-morning.json'
import longDistance from '@/data/quotes/long-distance.json'

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

// Thematic quote pools that power the /quotes/[theme] sub-cluster pages
// (thinking-of-you, missing-you, good-morning, long-distance). Kept separate
// from the curated hub QUOTES array so the hub categories stay clean, but
// searchable via getQuotesByCategory below.
export const THEME_QUOTES: Quote[] = [
  ...thinkingOfYou,
  ...missingYou,
  ...goodMorning,
  ...longDistance,
] as Quote[]

// ---------------------------------------------------------------------------
// Per-category SEO landing pages (/quotes/[category])
// Each maps to a real library category (100 quotes) or a thematic pool (40+)
// so the page is substantial, with a unique H1/title/meta, an intro and a CTA.
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
  // Optional keyword-targeted prose blocks rendered under the intro
  // (e.g. for-him / for-her split on the thinking-of-you page).
  sections?: { heading: string; body: string }[]
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
  {
    slug: 'thinking-of-you',
    category: 'thinking-of-you',
    emoji: '💭',
    name: 'Thinking of You',
    h1: 'Thinking of You Quotes (for Him & for Her)',
    metaTitle: 'Thinking of You Quotes — 48 Free Quotes for Him & Her to Copy',
    metaDescription: 'Free "thinking of you" quotes for him or her — sweet, simple lines to text, put in a card, or open a letter with. Copy any quote in one tap. Free, no account.',
    intro: 'Sometimes the whole message is just: you were on my mind. These are the lines that say it without trying too hard — some sweet, some quiet, all easy to send. Copy one for a text or card, or use it to open a letter and finish it in your own words.',
    writeType: 'love',
    related: ['missing-you', 'long-distance', 'good-morning'],
    sections: [
      {
        heading: 'Thinking of You Quotes for Him',
        body: 'When you want to let him know he crossed your mind, keep it warm and specific. Lines like "There\'s no distance long enough to keep a good man like you off my mind" work in a text, a card, or the first line of a letter — pair the quote with one real detail only the two of you would understand.',
      },
      {
        heading: 'Thinking of You Quotes for Her',
        body: 'For her, the sweetest thinking-of-you notes feel personal, not generic. Try "A woman like you doesn\'t leave a person\'s thoughts; she settles into them," then add why she\'s on your mind today. Any of the quotes below copies straight into a message or a ShareLove letter.',
      },
    ],
  },
  {
    slug: 'missing-you',
    category: 'missing-you',
    emoji: '🥺',
    name: 'Missing You',
    h1: 'Missing You Quotes for Letters & Messages',
    metaTitle: 'Missing You Quotes — 45 Free "I Miss You" Quotes to Copy',
    metaDescription: 'Free "I miss you" quotes for him, her, or a long-distance love. Heartfelt lines to text, put in a card, or open a letter with. Copy any quote in one tap. Free, no account.',
    intro: 'Missing someone is hard to put into words — until someone else already has. These are the lines for the nights the distance feels bigger than usual. Copy one for a message, or use it to open a letter to the person you wish were here.',
    writeType: 'love',
    related: ['thinking-of-you', 'long-distance', 'good-morning'],
  },
  {
    slug: 'good-morning',
    category: 'good-morning',
    emoji: '☀️',
    name: 'Good Morning',
    h1: 'Good Morning Quotes for Him & Her',
    metaTitle: 'Good Morning Quotes — 45 Free Sweet Good Morning Love Quotes',
    metaDescription: 'Free good morning quotes for him or her — sweet, romantic lines to text first thing or put in a card. Copy any quote in one tap, or open a letter with it. Free, no account.',
    intro: 'A good-morning message is a small thing that lands big. These are the sweet, warm lines that make someone smile before their feet even hit the floor. Copy one for a morning text, or set it as the opening line of a letter that waits for them.',
    writeType: 'love',
    related: ['thinking-of-you', 'missing-you', 'long-distance'],
  },
  {
    slug: 'long-distance',
    category: 'long-distance',
    emoji: '🌍',
    name: 'Long Distance',
    h1: 'Long Distance Relationship Quotes',
    metaTitle: 'Long Distance Relationship Quotes — 45 Free Quotes to Copy',
    metaDescription: 'Free long-distance relationship quotes for him or her. Heartfelt lines about missing someone and loving across the miles. Copy any quote in one tap. Free, no account.',
    intro: 'Loving someone across the miles takes a special kind of patience — and, some days, the right words. These are the lines that make the distance feel smaller. Copy one for a message, or use it to open a letter that closes the gap for a moment.',
    writeType: 'love',
    related: ['missing-you', 'thinking-of-you', 'good-morning'],
  },
]

export function getQuoteCategoryPage(slug: string): QuoteCategoryPage | undefined {
  return QUOTE_CATEGORY_PAGES.find(c => c.slug === slug)
}

export function getQuotesByCategory(category: string): Quote[] {
  return [...QUOTES, ...THEME_QUOTES].filter(q => q.category === category)
}

// Deterministic quote of the day — same quote for everyone on a given date
export function getQuoteOfTheDay(): Quote {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000)
  const index = (dayOfYear * 31 + now.getFullYear()) % QUOTES.length
  return QUOTES[index]
}
