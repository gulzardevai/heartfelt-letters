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
  hubBlurb: string // one or two sentences under the tagline: what it is for, who it helps
  keyword: string
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string[] // 2 server-rendered paragraphs under the H1
  // Editorial guidance rendered below the tool. The tools themselves are
  // client-side, so this is most of what a crawler (or a reader who hasn't
  // used the widget) actually gets from the page. Keyed by slug in TOOL_GUIDES.
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
    hubBlurb:
      'Type two names and get the same score every time — nothing random, nothing saved. It predicts nothing, but it is a low-stakes way to raise a subject you have been circling with someone.',
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
      {
        q: 'Should I use nicknames or full names?',
        a: 'Either works, but they give different results, because the calculation reads exactly the letters you type. Katie and Katherine are two separate inputs. If you want a score you can compare with a friend later, agree on one version of each name first.',
      },
      {
        q: 'Is a love calculator accurate?',
        a: 'No, and it is not trying to be. It knows nothing about either person beyond the letters in their names, so it cannot say anything about a real relationship. The only thing it is reliably accurate about is itself — the same two names always return the same number.',
      },
    ],
  },
  {
    slug: 'days-together',
    emoji: '📅',
    name: 'Days Together Counter',
    hubTagline: 'Count every day since your relationship began.',
    hubBlurb:
      'For couples who want the exact figure: days, months and years since your start date, plus the next round milestone. Best for catching day 1,000 before it quietly goes past.',
    keyword: 'Days together counter',
    metaTitle: 'Days Together Counter — How Long Have We Been Together?',
    metaDescription:
      'Pick the day your relationship started and see how many days, months and years you have been together — plus your next milestone. Free, no sign-up.',
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
      {
        q: 'How long is 1,000 days in years?',
        a: 'Roughly two years and nine months — which is why day 1,000 tends to land at a completely unremarkable point in year three. It is the milestone most couples miss, and for the same reason it is the one that surprises a partner most.',
      },
      {
        q: 'What if we do not agree on our start date?',
        a: 'Run the counter twice. Plenty of couples count from different days — one from the first date, one from the day it became official — and keeping both simply gives you two milestones a few weeks apart instead of one to argue about.',
      },
    ],
  },
  {
    slug: 'nickname-generator',
    emoji: '🥰',
    name: 'Cute Nickname Generator',
    hubTagline: 'Sweet pet names for your boyfriend or girlfriend.',
    hubBlurb:
      'Sweet, playful and unusual pet names to browse when you have been together for years and still default to first names. Useful for finding the category you want, more than the exact word.',
    keyword: 'Cute nickname generator',
    metaTitle: 'Cute Nickname Generator — Boyfriend & Girlfriend Pet Names',
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
      {
        q: 'What if I want a nickname that is not cheesy?',
        a: 'Try the playful or cute categories rather than the romantic ones. Names that sound faintly ridiculous tend to survive longer than grand ones, because they are obviously a joke between two people rather than a declaration anyone could overhear.',
      },
      {
        q: 'Is it rude to use a pet name in front of other people?',
        a: 'It depends entirely on the person, and they are often too polite to say. A useful test is whether you would use it in a voice note they might play out loud. If not, keep it private — and make sure that is an agreement rather than an assumption.',
      },
    ],
  },
  {
    slug: 'love-language-quiz',
    emoji: '💞',
    name: 'Love Language Quiz',
    hubTagline: 'Discover how you most feel loved.',
    hubBlurb:
      'A few questions on how affection actually registers for you — words, time, gifts, acts or touch. Best taken separately by two people who then compare, because the gap is the interesting part.',
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
      { href: '/tools/quiz', label: 'How well do you know me? quiz maker' },
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
      {
        q: 'How long does the love language quiz take?',
        a: 'Six questions, so about a minute. There is no email step and no result page to unlock — you answer and the result appears immediately.',
      },
      {
        q: 'Can your love language change over time?',
        a: 'Yes, and it commonly does. What registers as love is shaped by whatever is currently scarce, so couples in a long-distance stretch drift toward quality time and new parents often shift toward acts of service. Retake it when your circumstances change rather than treating the old result as permanent.',
      },
    ],
  },
  {
    slug: 'anniversary-gifts',
    emoji: '🎁',
    name: 'Anniversary Gifts by Year',
    hubTagline: 'Traditional & modern gift ideas for every year.',
    hubBlurb:
      'The traditional and modern material for any year, from paper to diamond, with a way of reading each one that is not simply "buy a notebook". For anyone with an anniversary two weeks away and no idea.',
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
      {
        q: 'Which list should I follow, traditional or modern?',
        a: 'Neither has any authority behind it — the traditional list is a Victorian codification of older customs and the modern one was largely assembled by retail associations. Look at both, take whichever suggests something specific about your partner, and ignore the other.',
      },
      {
        q: 'Do these gifts work for a dating anniversary rather than a wedding?',
        a: 'Yes. The sequence has no legal content, so unmarried couples, friendships and the anniversary of the day you met borrow it perfectly well. If you are not sure which year you are counting, the days together counter will work it out from your start date.',
      },
    ],
  },
  {
    slug: 'countdown',
    emoji: '⏳',
    name: 'Countdown to a Date',
    hubTagline: 'A live countdown to any special day.',
    hubBlurb:
      'A live countdown to a reunion, a wedding, a due date or a flight home. Made for anyone sitting with a wait that feels open-ended — a finite number is easier to hold than an unknown one.',
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
      {
        q: 'Will my countdown still be there if I close the tab?',
        a: 'Your date is encoded into the share link, so bookmarking that link or sending it to someone reopens the same countdown exactly where it should be. Nothing is stored on our side, which is also why there is no account to make.',
      },
      {
        q: 'Which time zone does the countdown use?',
        a: 'Your device clock. If the two of you are in different countries, agree whose time you are setting it to before you both start watching — the usual convention is the time zone where the thing actually happens, whether that is the airport, the venue or the front door.',
      },
    ],
  },
  {
    slug: 'zodiac-compatibility',
    emoji: '♊',
    name: 'Zodiac Love Compatibility',
    hubTagline: 'Match two star signs for a love read.',
    hubBlurb:
      'Two star signs, an element-based read and a score. A structured way to talk about two temperaments — treated here as a game, which is honestly what it is.',
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
      {
        q: 'Does this use my full birth chart?',
        a: 'No — it uses sun signs, the ones you get from a birth date alone. A full chart also places the moon and the rising sign, both of which need an exact birth time and place. That is why a reading can feel wrong: two people with the same sun sign are often described very differently once the rest of the chart is involved.',
      },
      {
        q: 'What does a low compatibility score mean?',
        a: 'That the two elements are traditionally described as difficult together, which in practice means there is more to negotiate — and, when it is negotiated, more range. Read a low score as a list of things worth talking about rather than a verdict on the relationship.',
      },
    ],
  },
  {
    slug: 'couples-questions',
    emoji: '💬',
    name: 'Couples Questions',
    hubTagline: 'Deep, fun and date-night questions to draw from.',
    hubBlurb:
      'Prompts to draw from when the conversation has narrowed to logistics and neither of you wants to raise something out of nowhere. Built for long-term couples more than new ones.',
    keyword: 'Couples questions',
    metaTitle: 'Couples Questions Generator — Deep, Fun & Date-Night Prompts',
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
      { href: '/tools/quiz', label: 'How well do you know me? quiz maker' },
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
      {
        q: 'How many questions should we do in one evening?',
        a: 'Three or four is plenty. Working through thirty turns a conversation into a task, and the value is in following up on an answer rather than covering ground. Skipping is allowed too — treating "not tonight" as a real answer is what makes the harder questions safe to ask later.',
      },
      {
        q: 'What if a question upsets one of us?',
        a: 'Stop drawing cards and stay with what came up. Continuing down the list is a way of avoiding something while appearing to have a deep conversation. And keep the answers between you — these questions only work because both people assume nothing said will be repeated or used in an argument later.',
      },
    ],
  },
  {
    slug: 'love-note',
    emoji: '💌',
    name: 'Love Note Reveal',
    hubTagline: 'Turn a few words into a link that opens like a little envelope.',
    hubBlurb:
      'One sentence, wrapped in a link that opens with a small envelope animation. For the message that is genuinely one line and would only be diluted by three paragraphs.',
    keyword: 'Love note',
    metaTitle: 'Love Note Reveal — Send a Sweet Note as a Surprise Link',
    metaDescription:
      'Write a short love note and turn it into a private link that opens with a little envelope reveal. Free, no sign-up — a sweet surprise, then send a real letter.',
    h1: 'Love Note Reveal',
    intro: [
      'Type a few sweet words and turn them into a private link that opens like a tiny envelope. Send it in a text, and when they tap it your note is revealed with a gentle little animation — a small surprise that lands right in the middle of their day.',
      'It is the pocket-sized version of a love letter: quick to make, lovely to receive. And when a few words turn into something you want to say properly, that same feeling becomes a full letter you can seal and send.',
    ],
    ctaLine: 'A note is a spark. A letter is the whole fire.',
    writeType: 'love',
    related: [
      { href: '/tools/nickname-generator', label: 'Cute nickname generator' },
      { href: '/letters/love', label: 'Love letter templates' },
      { href: '/quotes/love', label: 'Love quotes' },
    ],
    faq: [
      {
        q: 'How does the love note link work?',
        a: 'You type a short note and we turn it into a private web link. Nothing is saved on our servers — the words are encoded into the link itself, right in your browser. When the person you send it to opens the link, the note is revealed with a little envelope animation.',
      },
      {
        q: 'Is my love note private?',
        a: 'It is unlisted and never indexed by search engines, so it will not turn up in Google. But because the note travels inside the link, anyone who has the link can open it — so treat it as a sweet surprise to share, not a place for secrets.',
      },
      {
        q: 'Is it free, and do I need an account?',
        a: 'Completely free, with no sign-up. Write your note, copy the link, and send it however you like — text, chat or email.',
      },
      {
        q: 'What is the difference between this and a real letter?',
        a: 'This is a quick, playful note — a few words that open with a smile. A ShareLove letter is the real thing: longer, sealed like an envelope, with room for photos and even the option to schedule when it opens. When your note wants to become a letter, you can write one free.',
      },
    ],
  },
]

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug)
}
