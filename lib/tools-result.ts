// Pure result logic + branded-card summaries shared by the client widgets and
// the server-side OG / story image routes, so a shared card always matches the
// widget that produced it. No React, no browser-only APIs — safe everywhere.

export type CardData = {
  emoji: string
  heading: string // e.g. "Sara 💕 James"
  big: string // the hero value, e.g. "94%" (may be empty)
  sub: string // one supporting line
  footer?: string // small extra line
}

/* ------------------------------------------------------------------ */
/* Love calculator                                                     */
/* ------------------------------------------------------------------ */

export function loveScore(a: string, b: string): number {
  const s = (a + b).toLowerCase().replace(/[^a-z]/g, '')
  if (!s) return 0
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000
  return 40 + (h % 60)
}

export function loveBand(n: number): { label: string; note: string } {
  if (n >= 90) return { label: 'A rare kind of match', note: 'The letters practically finish each other’s sentences. Go tell them.' }
  if (n >= 75) return { label: 'Seriously strong', note: 'There’s real warmth here. This is the kind you write letters about.' }
  if (n >= 60) return { label: 'Sweet and promising', note: 'A lovely spark — worth nurturing with a little more honesty out loud.' }
  return { label: 'A slow-burn', note: 'Numbers don’t know your story. The words you choose to say do.' }
}

/* ------------------------------------------------------------------ */
/* Zodiac compatibility                                                */
/* ------------------------------------------------------------------ */

export type ZodiacSign = { name: string; emoji: string; element: 'Fire' | 'Earth' | 'Air' | 'Water' }

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Aries', emoji: '♈', element: 'Fire' },
  { name: 'Taurus', emoji: '♉', element: 'Earth' },
  { name: 'Gemini', emoji: '♊', element: 'Air' },
  { name: 'Cancer', emoji: '♋', element: 'Water' },
  { name: 'Leo', emoji: '♌', element: 'Fire' },
  { name: 'Virgo', emoji: '♍', element: 'Earth' },
  { name: 'Libra', emoji: '♎', element: 'Air' },
  { name: 'Scorpio', emoji: '♏', element: 'Water' },
  { name: 'Sagittarius', emoji: '♐', element: 'Fire' },
  { name: 'Capricorn', emoji: '♑', element: 'Earth' },
  { name: 'Aquarius', emoji: '♒', element: 'Air' },
  { name: 'Pisces', emoji: '♓', element: 'Water' },
]

const ZODIAC_PAIR: Record<string, { score: number; read: string }> = {
  'Fire-Fire': { score: 88, read: 'Two flames — passionate, spontaneous and never boring, as long as you take turns leading.' },
  'Fire-Air': { score: 92, read: 'Air feeds fire. This is a lively, inspiring match full of ideas, adventure and easy chemistry.' },
  'Fire-Earth': { score: 68, read: 'Fire wants to leap; earth wants to plan. Grounding meets spark — it works with patience and respect.' },
  'Fire-Water': { score: 62, read: 'Steam or a doused flame. Deeply intense, sometimes stormy — honest words keep it warm, not scalding.' },
  'Earth-Earth': { score: 90, read: 'Steady, loyal and built to last. You share values and quietly build a life that feels safe.' },
  'Earth-Air': { score: 66, read: 'Practical meets playful. Different rhythms, but each teaches the other something they were missing.' },
  'Earth-Water': { score: 93, read: 'A nourishing match. Water softens earth, earth gives water a home — gentle, devoted and secure.' },
  'Air-Air': { score: 85, read: 'Endless conversation and mental sparks. Keep an eye on grounding the feelings behind the ideas.' },
  'Air-Water': { score: 64, read: 'Head meets heart. Fascinating and tender when air slows down to feel and water speaks its needs.' },
  'Water-Water': { score: 91, read: 'Profound emotional intimacy. You feel each other deeply — just remember to come up for air together.' },
}

export function signByName(name: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find(s => s.name === name)
}

export function zodiacResult(aName: string, bName: string): { score: number; read: string } {
  const a = signByName(aName)
  const b = signByName(bName)
  if (!a || !b) return { score: 0, read: '' }
  const order = ['Fire', 'Earth', 'Air', 'Water']
  const [x, y] = [a.element, b.element].sort((m, n) => order.indexOf(m) - order.indexOf(n))
  const base = ZODIAC_PAIR[`${x}-${y}`]
  const same = aName === bName ? -4 : 0
  return { score: Math.min(99, Math.max(50, base.score + same)), read: base.read }
}

/* ------------------------------------------------------------------ */
/* Days together                                                       */
/* ------------------------------------------------------------------ */

const DAY = 1000 * 60 * 60 * 24

export type DaysResult = {
  days: number
  years: number
  months: number
  remDays: number
  nextMilestone: { label: string; inDays: number } | null
}

export function daysTogether(dateStr: string): DaysResult | null {
  if (!dateStr) return null
  const start = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  if (isNaN(start.getTime()) || start.getTime() > now.getTime()) return null

  const days = Math.floor((now.getTime() - start.getTime()) / DAY)
  let y = now.getFullYear() - start.getFullYear()
  let m = now.getMonth() - start.getMonth()
  let d = now.getDate() - start.getDate()
  if (d < 0) {
    m -= 1
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  }
  if (m < 0) {
    y -= 1
    m += 12
  }

  const nextHundred = (Math.floor(days / 100) + 1) * 100
  const hundredIn = nextHundred - days
  const nextAnniv = new Date(start)
  nextAnniv.setFullYear(start.getFullYear() + y + 1)
  const annivIn = Math.ceil((nextAnniv.getTime() - now.getTime()) / DAY)
  const nextMilestone =
    hundredIn <= annivIn
      ? { label: `${nextHundred.toLocaleString()} days together`, inDays: hundredIn }
      : { label: `${y + 1} year${y + 1 === 1 ? '' : 's'} together`, inDays: annivIn }

  return { days, years: y, months: m, remDays: d, nextMilestone }
}

/* ------------------------------------------------------------------ */
/* Anniversary gifts                                                   */
/* ------------------------------------------------------------------ */

export const ANNIVERSARY_GIFTS: Record<number, { traditional: string; modern: string; idea: string }> = {
  1: { traditional: 'Paper', modern: 'Clocks', idea: 'A heartfelt letter — the ultimate paper gift — recalling your first year together.' },
  2: { traditional: 'Cotton', modern: 'China', idea: 'Matching cotton pyjamas, plus a note tucked into the pocket.' },
  3: { traditional: 'Leather', modern: 'Crystal / Glass', idea: 'A leather-bound journal to fill with your favourite memories.' },
  4: { traditional: 'Fruit / Flowers', modern: 'Appliances', idea: 'A picnic of their favourite fruit and a bouquet that never wilts.' },
  5: { traditional: 'Wood', modern: 'Silverware', idea: 'A carved keepsake box — for letters and small treasures.' },
  6: { traditional: 'Candy / Iron', modern: 'Wood', idea: 'A sweet hamper of the candy that reminds you of them.' },
  7: { traditional: 'Wool / Copper', modern: 'Desk sets', idea: 'A cosy wool blanket for the nights in you both love.' },
  8: { traditional: 'Pottery / Bronze', modern: 'Linens / Lace', idea: 'A handmade ceramic mug pair for slow morning coffees.' },
  9: { traditional: 'Pottery / Willow', modern: 'Leather', idea: 'A leather photo album of nine years, with a letter inside the cover.' },
  10: { traditional: 'Tin / Aluminium', modern: 'Diamond jewellery', idea: 'A decade deserves a letter naming ten things you still adore.' },
  11: { traditional: 'Steel', modern: 'Fashion jewellery', idea: 'An engraved steel keychain with a date only you two know.' },
  12: { traditional: 'Silk / Linen', modern: 'Pearls', idea: 'A silk scarf or tie, with a note about how you’ve grown together.' },
  13: { traditional: 'Lace', modern: 'Textiles / Furs', idea: 'A delicate lace keepsake and an evening reminiscing.' },
  14: { traditional: 'Ivory', modern: 'Gold jewellery', idea: 'A gold piece engraved with your anniversary date.' },
  15: { traditional: 'Crystal', modern: 'Watches', idea: 'A crystal keepsake, plus a letter marking fifteen years.' },
  20: { traditional: 'China', modern: 'Platinum', idea: 'A fine china set for the dinners you’ll keep sharing — and a letter.' },
  25: { traditional: 'Silver', modern: 'Silver', idea: 'A silver frame holding a photo from year one, with a letter behind it.' },
  30: { traditional: 'Pearl', modern: 'Diamond', idea: 'Pearls and a letter tracing three decades of your story.' },
  40: { traditional: 'Ruby', modern: 'Ruby', idea: 'A ruby token and a letter about the love that only deepened.' },
  50: { traditional: 'Gold', modern: 'Gold', idea: 'Golden anniversary — a letter here becomes a family heirloom.' },
}

export function ordinal(n: number): string {
  return `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`
}

/* ------------------------------------------------------------------ */
/* Love languages                                                      */
/* ------------------------------------------------------------------ */

export type Lang = 'words' | 'time' | 'gifts' | 'acts' | 'touch'

export const LANG_INFO: Record<Lang, { label: string; emoji: string; blurb: string }> = {
  words: { label: 'Words of Affirmation', emoji: '💬', blurb: 'You feel most loved through kind, honest, spoken and written words. A heartfelt letter lands deeper for you than almost anything.' },
  time: { label: 'Quality Time', emoji: '⏳', blurb: 'Undivided attention is everything. You feel loved when someone chooses to be fully present with you.' },
  gifts: { label: 'Receiving Gifts', emoji: '🎁', blurb: 'It’s the thought made visible. A small, meaningful token tells you that you were on someone’s mind.' },
  acts: { label: 'Acts of Service', emoji: '🤲', blurb: 'Actions speak loudest for you. When someone eases your load without being asked, you feel truly cared for.' },
  touch: { label: 'Physical Touch', emoji: '🤗', blurb: 'A hug, a hand held, closeness — physical warmth is how love feels most real to you.' },
}

// How to love a partner whose primary language is X.
export const LOVE_BETTER: Record<Lang, string> = {
  words: 'Tell them, out loud and in writing, exactly what you appreciate. Leave notes. Send the letter. Praise them to others.',
  time: 'Protect real, undistracted time together — phones away, fully present. Plans matter less than your attention.',
  gifts: 'Bring back small, thoughtful tokens that say “I saw this and thought of you.” It’s the meaning, not the price.',
  acts: 'Ease their load before they ask — the chore, the errand, the thing they dread. Actions say “I’ve got you.”',
  touch: 'Reach for them often — a hand held, a hug on arrival, closeness on the couch. Physical warmth reassures them.',
}

/* ------------------------------------------------------------------ */
/* Couples "who knows who better" challenge bank                       */
/* ------------------------------------------------------------------ */

export const CHALLENGE_QUESTIONS: { q: string; options: string[] }[] = [
  { q: 'My ideal date night is…', options: ['A cosy night in', 'A fancy dinner out', 'An adventure somewhere new', 'A movie and takeout'] },
  { q: 'My go-to comfort food is…', options: ['Pizza', 'Ice cream', 'Chocolate', 'Something homemade'] },
  { q: 'The way I most like to be shown love is…', options: ['Kind words', 'Quality time', 'A little gift', 'A helping hand', 'A hug'] },
  { q: 'On a lazy Sunday you’ll find me…', options: ['Sleeping in', 'Out for brunch', 'Reading or a hobby', 'Being productive'] },
  { q: 'My dream holiday is…', options: ['A beach somewhere warm', 'A big city trip', 'A quiet cabin in nature', 'A road trip adventure'] },
  { q: 'The little thing that instantly makes my day is…', options: ['A good morning text', 'My favourite coffee', 'A surprise treat', 'A long hug'] },
  { q: 'My guilty-pleasure TV is…', options: ['Reality shows', 'A gripping drama', 'Comedy / sitcoms', 'True crime'] },
  { q: 'If I had a free afternoon I’d spend it…', options: ['With friends', 'On a hobby', 'Napping / resting', 'Getting things done'] },
]

/* ------------------------------------------------------------------ */
/* Card summaries (used by both widget and OG/story image routes)      */
/* ------------------------------------------------------------------ */

function langLabel(l: Lang): string {
  return LANG_INFO[l]?.label ?? ''
}

export function cardFor(slug: string, s: any): CardData {
  const fallback: CardData = { emoji: '💌', heading: 'ShareLove Letters', big: '', sub: 'Free love letters, sealed like an envelope.' }
  if (!s || typeof s !== 'object') return fallback

  switch (slug) {
    case 'love-calculator': {
      const n = loveScore(s.a || '', s.b || '')
      return { emoji: '💘', heading: `${s.a || '?'} 💕 ${s.b || '?'}`, big: `${n}%`, sub: loveBand(n).label, footer: 'Love match' }
    }
    case 'zodiac-compatibility': {
      const r = zodiacResult(s.a, s.b)
      const ea = signByName(s.a)?.emoji ?? ''
      const eb = signByName(s.b)?.emoji ?? ''
      return { emoji: '✨', heading: `${ea} ${s.a || '?'} 💞 ${s.b || '?'} ${eb}`, big: `${r.score}%`, sub: 'Star sign love match', footer: 'Zodiac compatibility' }
    }
    case 'days-together': {
      const d = daysTogether(s.d)
      return { emoji: '📅', heading: 'Together', big: d ? d.days.toLocaleString() : '—', sub: 'days and counting 💞', footer: 'Days together' }
    }
    case 'countdown': {
      const label = (s.label && String(s.label).trim()) || 'Counting down'
      let when = ''
      const t = new Date(s.t)
      if (!isNaN(t.getTime())) when = t.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      return { emoji: '⏳', heading: label, big: when, sub: 'counting down together 💞', footer: 'Countdown' }
    }
    case 'nickname-generator': {
      const list: string[] = Array.isArray(s.p) ? s.p : []
      return { emoji: '🥰', heading: 'Cute names for you', big: list[0] || '', sub: list.slice(1, 4).join('  ·  '), footer: 'Nickname ideas' }
    }
    case 'anniversary-gifts': {
      const y = Number(s.y)
      const g = ANNIVERSARY_GIFTS[y]
      return { emoji: '🎁', heading: `${ordinal(y)} anniversary`, big: g?.traditional || '', sub: g ? `Modern: ${g.modern}` : '', footer: 'Anniversary gift' }
    }
    case 'love-language-quiz': {
      if (s.m === 'couple' && s.a && s.b) {
        return {
          emoji: '💞',
          heading: `${s.a.n || 'You'} 💞 ${s.b.n || 'Them'}`,
          big: '',
          sub: `${langLabel(s.a.lang)}  +  ${langLabel(s.b.lang)}`,
          footer: 'Our love languages',
        }
      }
      if (s.m === 'invite' && s.a) {
        return { emoji: '💞', heading: `${s.a.n || 'Someone'} took the love language quiz`, big: '', sub: 'Now discover yours →', footer: 'Love language quiz' }
      }
      const lang = s.lang as Lang
      const info = LANG_INFO[lang]
      return { emoji: info?.emoji ?? '💞', heading: 'My love language is', big: info?.label ?? '', sub: 'What’s yours?', footer: 'Love language quiz' }
    }
    case 'love-note': {
      // Teaser only — the private note text is NEVER placed on the card, in the
      // OG image, or in the page title/description. The message stays behind the
      // reveal; only a recipient name (which the sender opted to add) is shown.
      const to = (s.t && String(s.t).trim()) || ''
      return {
        emoji: '💌',
        heading: to ? `A love note for ${to}` : 'You have a love note',
        big: '',
        sub: 'Someone sent you a love note — tap to open 💞',
        footer: 'Love note',
      }
    }
    case 'couples-questions': {
      if (s.m === 'score') {
        const pct = s.total ? Math.round((s.score / s.total) * 100) : 0
        const who = s.g ? `${s.g} knows ${s.n || 'them'}` : `How well you know ${s.n || 'them'}`
        return { emoji: '💬', heading: who, big: `${s.score}/${s.total}`, sub: `${pct}% — ${scoreLabel(pct)}`, footer: 'Who knows who better?' }
      }
      // challenge invite
      return { emoji: '💬', heading: `Do you really know ${s.n || 'me'}?`, big: '', sub: 'Take the challenge →', footer: 'Who knows who better?' }
    }
    default:
      return fallback
  }
}

export function scoreLabel(pct: number): string {
  if (pct >= 90) return 'Soulmate level 💖'
  if (pct >= 70) return 'You really know them!'
  if (pct >= 50) return 'Not bad — keep learning'
  return 'Room to grow together'
}

// Short share caption used by the Web Share API / clipboard.
export function shareTextFor(slug: string, s: any): string {
  const c = cardFor(slug, s)
  const value = c.big ? ` — ${c.big}` : ''
  return `${c.heading}${value} · ${c.sub}`
}
