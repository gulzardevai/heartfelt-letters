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
    metaDescription: 'Browse 100 free love quotes to put in a love letter, card or message. Copy any romantic quote in one tap, then drop it into a letter — free, no account.',
    intro: 'The right line at the top of a love letter does half the work for you. Here are 100 of the most quotable things ever written about love — from Shakespeare to modern voices. Copy any of them for a card or message, or use one to open a letter and finish it in your own words.',
    writeType: 'love',
    related: ['friendship', 'family', 'celebration'],
    sections: [
      {
        heading: 'How to use a love quote without sounding borrowed',
        body: 'A quote at the top of a love letter is a doorway, not the room. It works when it earns you the first three seconds of attention and then hands over to something only you could have written. It fails when it does the whole job — a letter made entirely of other people\'s sentences reads as a card, however beautiful the sentences are. Use one line, attribute it if you know the source, and then get specific fast.',
      },
      {
        heading: 'Which quotes actually suit a letter',
        body: 'Short declarative lines survive being lifted out of context; elaborate ones rarely do. Shakespeare and the Romantics wrote gorgeously, but a dense four-line passage at the top of a letter asks the reader to work before they have any reason to. If you are choosing between two quotes, take the shorter one — and if a quote needs explaining, it is the wrong quote for a letter.',
      },
      {
        heading: 'What to write after the quote',
        body: 'The strongest structure is quote, then contradiction of the quote\'s generality: here is the universal version, and here is what it looks like in our particular case. One concrete memory does this better than any amount of elaboration. If you want the full structure, our guide to writing a love letter walks through the four sections that make one land.',
      },
    ],
  },
  {
    slug: 'friendship',
    category: 'friendship',
    emoji: '🤝',
    name: 'Friendship',
    h1: 'Friendship Quotes for Letters & Cards',
    metaTitle: 'Friendship Quotes — 100 Free Quotes for Your Best Friend',
    metaDescription: 'Browse 100 free friendship quotes for a best friend, card or letter. Copy any quote in one tap and use it to tell a friend what they mean to you — free.',
    intro: 'Most friends never get told what they mean to us. A single well-chosen line can start that conversation. Here are 100 free friendship quotes — copy one for a card or message, or use it to open a letter to the friend who has always shown up.',
    writeType: 'friendship',
    related: ['love', 'gratitude', 'celebration'],
    sections: [
      {
        heading: 'Why friendship letters are harder than love letters',
        body: 'Romantic writing has a whole vocabulary and a set of occasions that make it expected. Friendship has almost none — no anniversary, no established form, no obvious moment. This is why most people never tell a close friend what they mean, and why a quote is genuinely useful here: it supplies the opening register, which is the part that feels strange to invent from nothing.',
      },
      {
        heading: 'Say it without making it sound like a goodbye',
        body: 'The main risk in a friendship letter is tonal. Sincerity with no occasion attached can read as though something is wrong, or as though you are leaving. Two things prevent it: anchor the letter to a specific shared memory rather than a general statement, and say plainly near the start that there is no occasion — you were just thinking about it.',
      },
      {
        heading: 'Where to go from a quote',
        body: 'Pick one line, then immediately go particular: the week they showed up, the thing they said that you still repeat, the version of you that exists because of them. Friendship letters are made almost entirely of specifics, and the quote is only there to get you past the first sentence.',
      },
    ],
  },
  {
    slug: 'family',
    category: 'family',
    emoji: '👨‍👩‍👧',
    name: 'Family',
    h1: 'Family Quotes for Letters & Messages',
    metaTitle: 'Family Quotes — 100 Free Quotes About Family, to Copy',
    metaDescription: 'Browse 100 free quotes about family for a letter to a parent, sibling or child. Copy any quote in one tap and make it the heart of your letter — free.',
    intro: 'Family is the hardest thing to put into words precisely because it is so constant. These 100 quotes give you a place to start — for a letter to a parent, a sibling or a child. Copy one, then say the specific thing only your family would understand.',
    writeType: 'thank_you',
    related: ['love', 'gratitude', 'friendship'],
    sections: [
      {
        heading: 'Writing to family when nothing needs fixing',
        body: 'Family letters usually get written at extremes — a crisis, an illness, a funeral, an estrangement. The ordinary ones, written for no reason to a parent or sibling who is perfectly fine, are much rarer and land much harder, precisely because nothing prompted them. The absence of an occasion is the message.',
      },
      {
        heading: 'Say the specific thing, not the summary',
        body: '"Thank you for everything" is the most common line in family letters and the least effective, because it compresses decades into a phrase that could be addressed to anyone. One concrete scene does more: the drive, the argument you now understand differently, the thing they did that you only recognised as a sacrifice years later. Specificity is what makes a family letter unmistakably yours.',
      },
      {
        heading: 'On difficult family relationships',
        body: 'Not every family letter is warm, and a quote will not resolve a complicated relationship. If what you are writing is honest rather than affectionate, keep it factual, keep it about your own experience rather than their character, and consider whether it needs to be sent at all — an unsent letter is a legitimate form and does much of the same work.',
      },
    ],
  },
  {
    slug: 'gratitude',
    category: 'gratitude',
    emoji: '🙏',
    name: 'Gratitude',
    h1: 'Gratitude & Thank You Quotes for Letters',
    metaTitle: 'Thank You Quotes — 100 Free Gratitude Quotes to Copy',
    metaDescription: 'Browse 100 free gratitude and thank you quotes for a letter, card or message. Copy any quote in one tap and use it to thank someone properly — free.',
    intro: 'Gratitude is easy to feel and strangely hard to deliver. A good quote gives your thank-you letter a doorway in. Here are 100 free quotes about gratitude — copy one for a card, or use it to open a letter to the person who deserves a real thank-you.',
    writeType: 'thank_you',
    related: ['family', 'friendship', 'celebration'],
    sections: [
      {
        heading: 'Why thank-you letters are the most skipped',
        body: 'Nearly everyone can name a person who changed the direction of their life — a teacher, a manager, a friend\'s parent. Almost nobody tells them, usually on the assumption that it is too late, that others have surely said it, or that they will not be remembered. All three assumptions are generally wrong, and the letter is generally kept.',
      },
      {
        heading: 'How to make gratitude specific',
        body: 'General thanks evaporate. Name the thing that happened, name what you did next because of it, and name where you are now. That three-part shape converts a compliment into evidence — it shows the person a consequence they did not know existed, which is what makes these letters land the way they do.',
      },
      {
        heading: 'It is not too late',
        body: 'Late thanks are not diminished by the delay; if anything the delay is the point, because it demonstrates that the thing lasted. A letter arriving fifteen years after the fact says something a prompt one cannot. Our guide to writing a thank-you letter to a teacher covers the structure, and it applies to anyone.',
      },
    ],
  },
  {
    slug: 'encouragement',
    category: 'encouragement',
    emoji: '🌟',
    name: 'Encouragement',
    h1: 'Encouragement Quotes for Letters & Cards',
    metaTitle: 'Encouragement Quotes — 100 Free Quotes to Lift Someone Up',
    metaDescription: 'Browse 100 free encouragement and strength quotes for a letter or card to a friend going through a hard time. Copy any quote in one tap — free.',
    intro: 'When someone you love is struggling, the right words are hard to find on the spot. These 100 encouragement quotes give you somewhere to begin. Copy one for a message, or use it to open a letter that reminds them what they are capable of.',
    writeType: 'friendship',
    related: ['friendship', 'gratitude', 'love'],
    sections: [
      {
        heading: 'What to say when someone is struggling',
        body: 'The instinct is to reassure, and reassurance is usually the least useful thing available — telling someone it will be fine asks them to accept a claim you cannot support. What reliably helps is narrower: naming what you have actually seen them handle, and stating plainly that you are not going anywhere. Evidence beats optimism.',
      },
      {
        heading: 'Avoid the phrases that close a conversation',
        body: '"Everything happens for a reason", "stay positive", and "at least..." all share a structure: they ask the person to feel differently, which reads as a request to stop talking about it. If you want the letter to help, describe what you observed rather than prescribing what they should feel.',
      },
      {
        heading: 'Encouragement quotes are a beginning, not the letter',
        body: 'A strong line gets you into the letter. What the person keeps is the specific paragraph after it — the one that proves you were paying attention to their situation rather than to hard times in general. One accurate sentence about what they are actually facing outweighs any number of inspiring ones.',
      },
    ],
  },
  {
    slug: 'apology',
    category: 'apology',
    emoji: '🕊️',
    name: 'Apology',
    h1: 'Apology & Forgiveness Quotes for Letters',
    metaTitle: 'Apology Quotes — 100 Free Sorry & Forgiveness Quotes to Copy',
    metaDescription: 'Browse 100 free apology and forgiveness quotes for a heartfelt sorry letter or message. Copy any quote in one tap and use it to say sorry properly — free.',
    intro: 'A quote will not apologise for you, but it can help you find the tone. These 100 quotes about apology and forgiveness are a starting point — copy one, then say plainly what you did, what it cost, and what you will do differently.',
    writeType: 'apology',
    related: ['love', 'friendship', 'family'],
    sections: [
      {
        heading: 'What an apology quote can and cannot do',
        body: 'A quote can set the tone and get you past the first line. It cannot do the apologising, and leaning on it too heavily has a specific failure mode: a letter that gestures beautifully at regret without ever naming what happened reads as evasion, no matter how sincere the feeling behind it.',
      },
      {
        heading: 'The three things a real apology contains',
        body: 'Name the specific thing you did. Name its effect in the other person\'s terms rather than your own. State what you will do differently as a decision already made rather than an offer conditional on their response. Anything else is optional, and explanation in particular tends to work against you — explanation and apology pull in opposite directions.',
      },
      {
        heading: 'Then stop',
        body: 'The most common mistake is ending with a request: for forgiveness, for a reply, for reassurance that things are all right. That turns the apology into something about your own relief. Say it, and leave room. If you want the longer version, our guide to writing an apology letter that heals covers the full structure.',
      },
    ],
  },
  {
    slug: 'celebration',
    category: 'celebration',
    emoji: '🎉',
    name: 'Celebration',
    h1: 'Celebration Quotes for Birthdays & Congratulations',
    metaTitle: 'Celebration Quotes — 100 Free Birthday & Congrats Quotes',
    metaDescription: 'Browse 100 free celebration quotes for birthdays, graduations, new jobs and congratulations letters. Copy any quote in one tap and make the card yours — free.',
    intro: 'Every celebration message starts to sound the same. A great quote sets yours apart. Here are 100 free quotes for birthdays, graduations and every kind of good news — copy one for a card, or use it to open a congratulations letter.',
    writeType: 'congratulations',
    related: ['friendship', 'gratitude', 'love'],
    sections: [
      {
        heading: 'Why congratulations messages all sound the same',
        body: 'Celebration writing is the most formulaic category there is, because the occasions are public and the expected phrases are well established. "So proud of you" and "you deserve it" are true and completely interchangeable, which is why nobody remembers receiving them. A quote helps you open somewhere less worn.',
      },
      {
        heading: 'Name the work, not the outcome',
        body: 'The reliable move in any congratulations letter is to praise the part nobody else saw. Everyone will mention the graduation, the promotion, the win. Almost nobody will mention the two years before it, the version where it nearly did not happen, or the specific thing you watched them give up. That is the paragraph they will re-read.',
      },
      {
        heading: 'Cards get thrown away; letters do not',
        body: 'The signed card is the default and it has a lifespan of about a fortnight. A short letter attached to the same occasion tends to survive house moves. If the milestone is genuinely significant, it is worth the extra fifteen minutes — our congratulations letter templates give you a structure to start from.',
      },
    ],
  },
  {
    slug: 'thinking-of-you',
    category: 'thinking-of-you',
    emoji: '💭',
    name: 'Thinking of You',
    h1: 'Thinking of You Quotes (for Him & for Her)',
    metaTitle: 'Thinking of You Quotes — 48 Free Quotes for Him & Her',
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
    metaDescription: 'Free "I miss you" quotes for him, her or a long-distance love. Heartfelt lines to text, put in a card, or open a letter with. Copy any quote in one tap.',
    intro: 'Missing someone is hard to put into words — until someone else already has. These are the lines for the nights the distance feels bigger than usual. Copy one for a message, or use it to open a letter to the person you wish were here.',
    writeType: 'love',
    related: ['thinking-of-you', 'long-distance', 'good-morning'],
    sections: [
      {
        heading: 'Missing someone is not the same as needing reassurance',
        body: 'There are two different messages hiding inside "I miss you", and it is worth knowing which one you are sending. One is a statement of affection that asks nothing. The other is a request for reassurance. Both are legitimate, but they land very differently, and the second one sent repeatedly puts a quiet weight on the person receiving it.',
      },
      {
        heading: 'Give the feeling somewhere to go',
        body: 'The most useful thing you can attach to missing someone is something concrete — a date, a plan, a memory recounted in detail. Absence with nothing attached tends to circle. Absence attached to a specific next time converts into anticipation, which is a considerably easier thing to sit with.',
      },
      {
        heading: 'When to write instead of text',
        body: 'Messages are the wrong medium for this particular feeling, because they arrive in the middle of everything else and disappear immediately. A letter can be re-read on the night it is actually needed, which is rarely the night it was sent. Our long-distance letters can also be sealed until a date you choose.',
      },
    ],
  },
  {
    slug: 'good-morning',
    category: 'good-morning',
    emoji: '☀️',
    name: 'Good Morning',
    h1: 'Good Morning Quotes for Him & Her',
    metaTitle: 'Good Morning Quotes — 45 Free Sweet Good Morning Love Quotes',
    metaDescription: 'Free good morning quotes for him or her — sweet, romantic lines to text first thing or put in a card. Copy any quote in one tap. Free, no account.',
    intro: 'A good-morning message is a small thing that lands big. These are the sweet, warm lines that make someone smile before their feet even hit the floor. Copy one for a morning text, or set it as the opening line of a letter that waits for them.',
    writeType: 'love',
    related: ['thinking-of-you', 'missing-you', 'long-distance'],
    sections: [
      {
        heading: 'Why the timing does most of the work',
        body: 'A good-morning message is not really about its content. Its function is to be the first thing, which is why an ordinary line at 7am outperforms a beautiful one at noon. What it communicates is priority: before anything else today, you were the thing I thought about.',
      },
      {
        heading: 'Keep it short and specific',
        body: 'Morning messages fail by being too long — nobody wants a paragraph before coffee — and by being too generic, at which point they read as automated. The sweet spot is one line with one detail attached: not "have a great day", but a mention of the thing they are actually walking into this morning.',
      },
      {
        heading: 'Making it a ritual without making it a chore',
        body: 'Daily messages become obligation surprisingly fast, and an obligation message reads as one. The pattern that survives is irregular and specific rather than daily and identical. If you want a morning to land properly, write something longer once and schedule it to open on a day they will need it.',
      },
    ],
  },
  {
    slug: 'long-distance',
    category: 'long-distance',
    emoji: '🌍',
    name: 'Long Distance',
    h1: 'Long Distance Relationship Quotes',
    metaTitle: 'Long Distance Relationship Quotes — 45 Free Quotes to Copy',
    metaDescription: 'Free long-distance relationship quotes for him or her. Heartfelt lines about missing someone and loving across the miles. Copy any quote in one tap free.',
    intro: 'Loving someone across the miles takes a special kind of patience — and, some days, the right words. These are the lines that make the distance feel smaller. Copy one for a message, or use it to open a letter that closes the gap for a moment.',
    writeType: 'love',
    related: ['missing-you', 'thinking-of-you', 'good-morning'],
    sections: [
      {
        heading: 'What actually makes distance survivable',
        body: 'Not frequency of contact, which most long-distance couples already have in abundance. The two things that predict whether a long-distance relationship holds are an agreed end point — a date, even a provisional one, when the distance stops — and a reliable ritual that neither person has to organise each time.',
      },
      {
        heading: 'The problem with messaging',
        body: 'Long-distance couples are not short on communication; they are short on permanence. Thousands of messages and calls, and nothing you can hold, find again, or re-read on a bad night. This is the specific gap a letter fills, and it is why letters do disproportionate work at distance compared with any other kind of contact.',
      },
      {
        heading: 'Write for the day, not the moment',
        body: 'The most useful long-distance letter is one written now and opened later — before a hard week, on the day of a delayed flight, on an anniversary spent apart. You can seal a letter behind a date and it stays locked, with a countdown, until then. It puts something in the calendar that is not a visit.',
      },
    ],
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
