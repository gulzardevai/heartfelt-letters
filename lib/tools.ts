// Free romance micro-tools (/tools/[slug]).
// Each tool is a fully client-side, interactive utility with its own indexable
// landing page. The tools are top-of-funnel: they entertain a romance searcher
// and then funnel them into /write to send a real letter. They deliberately do
// NOT generate finished letters — /write remains the compose product.

export type ToolFaq = { q: string; a: string }

export type ToolLink = { href: string; label: string }

export type Tool = {
  slug: string
  emoji: string
  name: string // short label, used in lists, breadcrumbs, nav
  hubTagline: string // one line for the /tools hub card
  keyword: string
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string[] // 2 server-rendered paragraphs under the H1
  ctaLine: string // line above the "write a real letter" CTA
  writeType?: string // LETTER_TYPES id to deep-link the CTA (/write?type=...)
  related: ToolLink[] // internal links into /letters, /quotes, other tools
  faq: ToolFaq[]
}

export const TOOLS: Tool[] = [
  {
    slug: 'love-calculator',
    emoji: '💘',
    name: 'Love Calculator',
    hubTagline: 'Two names, one playful compatibility score.',
    keyword: 'Love calculator',
    metaTitle: 'Love Calculator — Free Name Compatibility Score',
    metaDescription:
      'Enter two names and get a fun love compatibility score in seconds. Free, private and shareable — then turn the moment into a real letter to the person you love.',
    h1: 'Love Calculator',
    intro: [
      'Type in two names and our love calculator gives you a playful compatibility score out of 100 — the same silly, sweet game you played on paper in school, now instant and shareable.',
      'It is just for fun, of course. Real love is not decided by letters lining up. So once you have your score, do the thing that actually moves someone: write them a letter that says what the number never could.',
    ],
    ctaLine: 'A score is a bit of fun. A letter is the real thing.',
    writeType: 'love',
    related: [
      { href: '/tools/zodiac-compatibility', label: 'Zodiac Love Compatibility' },
      { href: '/letters/love', label: 'Love letter templates' },
      { href: '/quotes/love', label: 'Love quotes' },
    ],
    faq: [
      {
        q: 'How does the love calculator work?',
        a: 'It turns the letters of both names into a stable score between 0 and 100, so the same two names always give the same result. It is a light-hearted game, not a real prediction — think of it as a fun conversation starter, not relationship advice.',
      },
      {
        q: 'Is the love calculator free?',
        a: 'Completely free, with no account and no sign-up. Nothing you type is saved or sent anywhere — the score is worked out right in your browser.',
      },
      {
        q: 'What should I do after I get my score?',
        a: 'Screenshot it for a laugh, then say the real thing. The best follow-up to a 99% score is an actual love letter — you can write and send one free on ShareLove in a couple of minutes.',
      },
    ],
  },
  {
    slug: 'days-together',
    emoji: '📅',
    name: 'Days Together Counter',
    hubTagline: 'Count every day since your relationship began.',
    keyword: 'Days together counter',
    metaTitle: 'Days Together Counter — How Long Have We Been Together?',
    metaDescription:
      'Pick the day your relationship started and see exactly how many days, months and years you have been together — plus your next milestone. Free relationship counter.',
    h1: 'Days Together Counter',
    intro: [
      'Choose the day it all began and this counter tells you exactly how long you have been together — in days, months and years — and counts down to your next milestone worth celebrating.',
      'Anniversaries are easy to remember. The 1,000th day, the 500th, the small numbers that quietly stack up are the ones nobody marks. This is a nice way to catch them — and a perfect excuse to write.',
    ],
    ctaLine: 'Reached a milestone? Mark it with a letter they can keep.',
    writeType: 'anniversary',
    related: [
      { href: '/tools/countdown', label: 'Countdown to a special date' },
      { href: '/tools/anniversary-gifts', label: 'Anniversary gifts by year' },
      { href: '/letters/anniversary', label: 'Anniversary letter templates' },
    ],
    faq: [
      {
        q: 'How do I count how many days we have been together?',
        a: 'Enter the date your relationship started — your first date, the day you made it official, whatever you count from — and the tool instantly works out the number of days, months and years, plus how long until your next milestone.',
      },
      {
        q: 'Can I use this for a wedding or friendship anniversary too?',
        a: 'Yes. Any start date works — a wedding day, the day you met, a friendship, even a sobriety or moving-in date. The counter simply measures the time since the day you choose.',
      },
      {
        q: 'How can I celebrate a milestone?',
        a: 'A letter is the one gift that gets better with time. On ShareLove you can write one for free and even schedule it to unseal on the exact milestone date, so it arrives right on the day.',
      },
    ],
  },
  {
    slug: 'nickname-generator',
    emoji: '🥰',
    name: 'Cute Nickname Generator',
    hubTagline: 'Sweet pet names for your boyfriend or girlfriend.',
    keyword: 'Cute nickname generator',
    metaTitle: 'Cute Nickname Generator — Pet Names for Boyfriend & Girlfriend',
    metaDescription:
      'Generate cute nicknames and pet names for your boyfriend, girlfriend or partner. Sweet, funny and unique ideas — free, instant and no sign-up needed.',
    h1: 'Cute Nickname Generator',
    intro: [
      'Stuck on what to call the person you love? Generate cute, sweet and playful nicknames for your boyfriend, girlfriend or partner — from timeless classics to soft, silly and unique ones you can make your own.',
      'The best pet name is the one that becomes yours alone. Use these as a starting point, pick the one that makes them smile, and then use it where it counts — in a letter.',
    ],
    ctaLine: 'Found their name? Open a letter with it.',
    writeType: 'love',
    related: [
      { href: '/tools/couples-questions', label: 'Couples questions' },
      { href: '/letters/just-because', label: 'Just-because letter templates' },
      { href: '/quotes/love', label: 'Love quotes' },
    ],
    faq: [
      {
        q: 'What are some cute nicknames for a boyfriend or girlfriend?',
        a: 'Classics like love, sweetheart, darling and honey never go out of style, while playful ones — sunshine, bug, goober, muffin — feel more personal. This generator mixes both so you can find one that fits your partner and your inside jokes.',
      },
      {
        q: 'How do I pick the right pet name?',
        a: 'Say a few out loud and notice which one feels natural. The right nickname usually comes from a shared moment or a small quirk, so treat the generated ideas as inspiration and tweak them until one is unmistakably yours.',
      },
      {
        q: 'Where should I use their new nickname?',
        a: 'A love letter is the sweetest place. Open your letter with the pet name and it instantly feels intimate — you can write one free on ShareLove with no account.',
      },
    ],
  },
  {
    slug: 'love-language-quiz',
    emoji: '💞',
    name: 'Love Language Quiz',
    hubTagline: 'Discover how you most feel loved.',
    keyword: 'Love language quiz',
    metaTitle: 'Love Language Quiz — Find Your Primary Love Language Free',
    metaDescription:
      'Take a quick free love language quiz to discover how you most feel loved — words, quality time, gifts, acts of service or touch. No email, instant result.',
    h1: 'Love Language Quiz',
    intro: [
      'Answer a handful of quick questions and discover your primary love language — the way you most naturally feel loved, whether that is words of affirmation, quality time, receiving gifts, acts of service or physical touch.',
      'Knowing your love language (and your partner’s) is one of the simplest ways to love someone in a way they actually feel. And if your result is words of affirmation? A heartfelt letter is exactly what your heart is asking for.',
    ],
    ctaLine: 'Speak their love language in writing.',
    writeType: 'love',
    related: [
      { href: '/tools/couples-questions', label: 'Couples questions' },
      { href: '/letters/love', label: 'Love letter templates' },
      { href: '/quotes/love', label: 'Love quotes' },
    ],
    faq: [
      {
        q: 'What are the five love languages?',
        a: 'The five love languages are words of affirmation, quality time, receiving gifts, acts of service and physical touch. Most people have one or two that matter most — this quiz helps you spot yours.',
      },
      {
        q: 'Is this love language test free?',
        a: 'Yes, and it needs no email or sign-up. You answer the questions right here and get your result instantly, worked out in your browser.',
      },
      {
        q: 'What if my love language is words of affirmation?',
        a: 'Then written words land deeper for you than almost anything. Ask your partner for them — and write your own too. A letter on ShareLove is a lasting way to give the words someone with this love language treasures most.',
      },
    ],
  },
  {
    slug: 'anniversary-gifts',
    emoji: '🎁',
    name: 'Anniversary Gifts by Year',
    hubTagline: 'Traditional & modern gift ideas for every year.',
    keyword: 'Anniversary gifts by year',
    metaTitle: 'Anniversary Gifts by Year — Traditional & Modern Gift Ideas',
    metaDescription:
      'Find the traditional and modern anniversary gift for every year — from paper (1st) to gold (50th) — plus a heartfelt letter idea to pair with it. Free.',
    h1: 'Anniversary Gifts by Year',
    intro: [
      'Every wedding anniversary has its own traditional and modern gift theme — paper for the first, cotton for the second, all the way to gold, pearl and diamond. Pick your year and see both, along with a simple gift idea to run with.',
      'There is a lovely thread running through the early years: paper, cotton, leather. The very first anniversary gift is paper — which is why a letter is never the wrong choice, at any year.',
    ],
    ctaLine: 'The one gift that fits every anniversary: your words.',
    writeType: 'anniversary',
    related: [
      { href: '/tools/days-together', label: 'Days together counter' },
      { href: '/letters/anniversary', label: 'Anniversary letter templates' },
      { href: '/quotes/love', label: 'Love quotes' },
    ],
    faq: [
      {
        q: 'What is the traditional first anniversary gift?',
        a: 'Paper. It is why cards, books and — most meaningfully — letters are the classic first-anniversary gift. The modern equivalent is a clock, marking the time you have shared.',
      },
      {
        q: 'What is the difference between traditional and modern anniversary gifts?',
        a: 'Traditional gifts follow the old year-by-year list (paper, cotton, leather, and so on), while the modern list swaps in contemporary alternatives (clocks, china, appliances). This tool shows both so you can choose whichever fits your partner.',
      },
      {
        q: 'What is a meaningful anniversary gift for any year?',
        a: 'A letter. It costs nothing, gets more precious with time, and no year’s theme rules it out. Write and send one free on ShareLove — you can even schedule it to open on your anniversary.',
      },
    ],
  },
  {
    slug: 'countdown',
    emoji: '⏳',
    name: 'Countdown to a Date',
    hubTagline: 'A live countdown to any special day.',
    keyword: 'Countdown to a date',
    metaTitle: 'Countdown to a Special Date — Free Live Countdown Timer',
    metaDescription:
      'Pick any special date and watch a live countdown of the days, hours, minutes and seconds. Perfect for anniversaries, reunions and birthdays. Free, no sign-up.',
    h1: 'Countdown to a Special Date',
    intro: [
      'Choose a date that matters — an anniversary, a reunion, a birthday, the day they come home — and watch a live countdown tick down the days, hours, minutes and seconds until it arrives.',
      'Counting down is half the joy. And there is a beautiful way to make the day itself even better: write a letter now and schedule it to unseal at exactly the moment the countdown hits zero.',
    ],
    ctaLine: 'Have a letter waiting when the countdown ends.',
    writeType: 'love',
    related: [
      { href: '/tools/days-together', label: 'Days together counter' },
      { href: '/letters/long-distance', label: 'Long-distance letter templates' },
      { href: '/letters/birthday', label: 'Birthday letter templates' },
    ],
    faq: [
      {
        q: 'How do I make a countdown to a special date?',
        a: 'Pick the date (and time, if you like) and the countdown starts immediately, updating every second. Leave the page open to watch it tick, or come back anytime to check how long is left.',
      },
      {
        q: 'What can I count down to?',
        a: 'Anything you are looking forward to — a wedding, an anniversary, a partner returning from a trip, a birthday, a first date, or the new year. If a day matters to you, it is worth counting down.',
      },
      {
        q: 'Can I schedule a letter to arrive when the countdown ends?',
        a: 'Yes. On ShareLove you can write a letter and set it to unseal on a future date and time, so a message is waiting for someone the moment your countdown reaches zero.',
      },
    ],
  },
  {
    slug: 'zodiac-compatibility',
    emoji: '♊',
    name: 'Zodiac Love Compatibility',
    hubTagline: 'Match two star signs for a love read.',
    keyword: 'Zodiac love compatibility',
    metaTitle: 'Zodiac Love Compatibility — Star Sign Match Calculator',
    metaDescription:
      'Pick two star signs and get an instant zodiac love compatibility read and score. Fun, free and shareable — then say the real thing in a heartfelt letter.',
    h1: 'Zodiac Love Compatibility',
    intro: [
      'Choose two star signs and get an instant compatibility read — a score plus a short take on how your elements, fire, earth, air and water, tend to spark, soothe or challenge each other in love.',
      'Astrology is a fun lens, not a verdict. The most compatible thing you can do for a relationship is tell the other person how you feel — in your own words, not the stars’.',
    ],
    ctaLine: 'The stars are fun. Your words are what they will keep.',
    writeType: 'love',
    related: [
      { href: '/tools/love-calculator', label: 'Love calculator' },
      { href: '/letters/love', label: 'Love letter templates' },
      { href: '/quotes/love', label: 'Love quotes' },
    ],
    faq: [
      {
        q: 'How is zodiac love compatibility calculated?',
        a: 'This tool looks at the elements of the two signs — fire, earth, air and water — and how they traditionally interact, then gives a compatibility score and a short read. It is meant as fun, not fate.',
      },
      {
        q: 'Which star signs are most compatible?',
        a: 'In astrology, signs that share or complement elements often get along easily — but every pairing has strengths. The read here highlights what tends to click and what to be mindful of for any two signs.',
      },
      {
        q: 'What should I do with my result?',
        a: 'Share it for fun, then say what actually matters. A letter that names what you love about someone means far more than any chart — and you can write one free on ShareLove.',
      },
    ],
  },
  {
    slug: 'couples-questions',
    emoji: '💬',
    name: 'Couples Questions',
    hubTagline: 'Deep, fun and date-night questions to draw from.',
    keyword: 'Couples questions',
    metaTitle: 'Couples Questions Generator — Deep & Fun Date-Night Questions',
    metaDescription:
      'Draw deep, fun and date-night questions for couples to spark real conversation. Free question generator for new and long-term partners — no sign-up needed.',
    h1: 'Couples Questions Generator',
    intro: [
      'Pull a question and start a conversation that actually goes somewhere. Choose deep questions to go below the surface, fun ones to laugh together, or date-night prompts to keep an evening flowing.',
      'The best relationships are built on questions like these — and on answers written down. When a question sparks something you want them to remember, put it in a letter.',
    ],
    ctaLine: 'A great answer deserves to be written down.',
    writeType: 'love',
    related: [
      { href: '/tools/love-language-quiz', label: 'Love language quiz' },
      { href: '/tools/nickname-generator', label: 'Cute nickname generator' },
      { href: '/letters/love', label: 'Love letter templates' },
    ],
    faq: [
      {
        q: 'What are good questions to ask your partner?',
        a: 'The best ones invite a story rather than a yes or no — what a moment felt like, what they are hoping for, what they remember. This generator mixes deep, fun and date-night prompts so you always have a good one ready.',
      },
      {
        q: 'How do I use these couples questions?',
        a: 'Pick a category and draw a question, then take turns answering honestly. Keep tapping for a new one whenever the conversation is ready to move on — great for date nights, road trips or long-distance calls.',
      },
      {
        q: 'What if an answer really moves me?',
        a: 'Write it down for them. A letter capturing what someone said, and what it meant to you, is a gift they will reread for years — and you can create one free on ShareLove.',
      },
    ],
  },
]

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug)
}
