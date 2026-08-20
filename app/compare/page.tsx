import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.shareloveletters.com/compare' },
  title: 'Best Online Love Letter Websites Compared (Free & Paid)',
  description: 'Compare the best online love letter websites: ShareLove vs Digital Love Letters, FutureMe, Paperless Post and Canva. Free, encrypted, no account needed.',
}

const competitors = [
  {
    name: 'Digital Love Letters',
    focus: 'Online love letters',
    price: '$5/yr or $8 once',
    weakness: 'You can write the whole letter and attach a photo without an account, but pressing Publish sends you straight to a sign-in page — and a plan costs $5.00/year or $8.00 one-time, both discounted under a countdown timer (checked on their public pricing page, 19 Aug 2026). Its 14 occasions skew romantic — nothing for grief, friendship, illness or congratulations. No anonymous writing, no password protection, no quote library.',
  },
  {
    name: 'Paperless Post',
    focus: 'Digital greeting cards',
    price: 'Paid coins per send',
    weakness: 'Designed for short greetings, not meaningful long-form letters. Requires payment to send anything beyond a basic card.',
  },
  {
    name: 'Hallmark Cards Online',
    focus: 'E-cards & physical cards',
    price: '$2–$10 per card',
    weakness: 'Generic templates with little personalization. Physical cards cost money and take days to arrive.',
  },
  {
    name: 'Canva',
    focus: 'Visual design tool',
    price: 'Free / $15/mo Pro',
    weakness: 'A full design suite — overkill for writing a letter. No sharing via link, no recipient experience, no letter-specific templates.',
  },
  {
    name: 'Google Docs',
    focus: 'Word processing',
    price: 'Free',
    weakness: 'Zero emotional design. Sharing requires giving someone a Google Drive link. No templates, no beautiful presentation for the recipient.',
  },
  {
    name: 'Bond (app)',
    focus: 'Handwritten notes',
    price: '$3–$6 per note',
    weakness: 'Physical delivery only, charges per letter, slow delivery. No instant sharing, no digital link.',
  },
  {
    name: 'FutureMe',
    focus: 'Letters to your future self',
    price: 'Free / paid Premium',
    weakness: 'Only delivers letters to yourself, and only by email on a scheduled date. Requires an account and email verification, and many letters end up in a public archive. No way to write to someone else.',
  },
  {
    name: 'Dear You / Letters Anonymous',
    focus: 'Public anonymous confession walls',
    price: 'Free',
    weakness: 'Your letter is posted to a public wall for strangers to read — the person it was written for never actually receives it. No private delivery to a recipient, no password protection.',
  },
  {
    name: 'Letters by Heart',
    focus: 'Interactive romantic cards',
    price: 'Free tier / paid',
    weakness: 'A genuinely pretty animated-envelope product, but the free tier has edges — check which feature you actually want is included before you invest the emotional energy. Romance-only, and it publishes no encryption or no-index guarantee.',
  },
  {
    name: 'Emocia',
    focus: 'Multimedia love pages',
    price: 'Free / paid tiers',
    weakness: 'Built for spectacle — animated text, photo galleries, music, effects. The right pick if the message is secondary to the show; the wrong one if you want to say something true in plain words and keep it private.',
  },
  {
    name: 'Gifft.me',
    focus: 'Virtual gift pages',
    price: 'Free / paid gifts',
    weakness: 'Fast and friendly for a cheerful surprise: write, add a photo, share the link. Privacy controls are light, so it is not where you would put words you would never want anyone else to read.',
  },
]

// The four questions a real person asks before typing their heart into a
// stranger's website — the criteria this whole page is ranked on.
const criteria = [
  {
    q: 'Is it free — really free?',
    a: 'Not "free to write, then paywalled the moment you hit send". Several tools let you compose a whole letter and only reveal the charge at the sharing step, which is the worst possible moment to find a price tag.',
  },
  {
    q: 'Do I need an account?',
    a: 'Forcing a signup before someone can send a two-minute note is the single biggest reason people abandon these tools mid-letter.',
  },
  {
    q: 'Is it private?',
    a: 'A love letter is the most personal text most people ever type online. Encryption, password protection and a link kept out of Google are not luxuries here — they are the whole point.',
  },
  {
    q: 'Does the reveal feel special?',
    a: 'Plain text in a browser tab is forgettable. An envelope that opens, a moment of anticipation — that is the difference between a message and a keepsake.',
  },
]

const features = [
  { feature: 'Purpose-built for letters', us: true, dll: true, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Occasions beyond romance — grief, friendship, get-well, congratulations', us: true, dll: false, paperless: true, hallmark: true, canva: true, docs: true },
  { feature: '57 letter templates by type', us: true, dll: false, paperless: false, hallmark: true, canva: false, docs: false },
  { feature: 'Eight full love letter templates written out on the page — copy them, no sign-up, no paywall', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: '25 occasion guides: what to say, opening lines to steal, worked before/after examples', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Seasonal guides — Christmas card wording, letters to Santa, Thanksgiving gratitude letters', us: true, dll: false, paperless: false, hallmark: true, canva: true, docs: false },
  { feature: 'Free printable fill-in-the-blank letter templates — no PDF to buy, no watermark', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Download the printable PDF without creating an account or giving an email address', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Print the letter on clean paper, no chrome (write online or by hand)', us: true, dll: false, paperless: false, hallmark: true, canva: true, docs: true },
  { feature: 'QR code for the letter link — and one printed on every PDF template that opens the digital version', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Rich text editor', us: true, dll: true, paperless: false, hallmark: false, canva: true, docs: true },
  { feature: 'Share via private link', us: true, dll: true, paperless: true, hallmark: false, canva: false, docs: true },
  { feature: 'Password protection', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: true },
  { feature: 'AES-256 encrypted letters', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Envelope opening animation', us: true, dll: false, paperless: true, hallmark: false, canva: false, docs: false },
  { feature: 'Letter themes (vintage, midnight...)', us: true, dll: false, paperless: true, hallmark: true, canva: true, docs: false },
  { feature: 'Recipients can reply on the letter', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'See whether your letter was opened, how many times, and every reply — from your dashboard', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Schedule a letter to open on a future date', us: true, dll: false, paperless: true, hallmark: true, canva: false, docs: false },
  { feature: 'Virtual flower bouquet with the letter', us: true, dll: true, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Send that bouquet with a sympathy, get-well or thank-you letter, not only a love letter', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Attach a song (Spotify, Apple Music, YouTube)', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'No account needed to send the letter', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Image uploads', us: true, dll: true, paperless: true, hallmark: false, canva: true, docs: true },
  { feature: '700+ quote library, browsable by category', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Free love tools (love calculator, quizzes, counters)', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Every tool explained — how it works, what the result actually means, and where it is only a game', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Shareable results & couple quizzes (send a link, unfurls as a card)', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: '"How well do you know me?" quiz — ready-made fun questions, zero writing, private scoreboard with optional taker emails', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Personal welcome & onboarding email on signup', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Anonymous writing', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Free to use', us: true, dll: false, paperless: false, hallmark: false, canva: true, docs: true },
]

const faqs = [
  {
    q: 'What is the best free online love letter website?',
    a: 'ShareLove Letters is a free, purpose-built love letter website: 57 templates, including eight full fill-in-the-blank love letter templates you can copy straight off the page, a rich-text editor, photo uploads, private shareable links and a real envelope-opening experience — with no account required to start and no paid tiers. Unlike design tools or e-card sites, it is built for one thing: writing meaningful, long-form letters to the people you love.',
  },
  {
    q: 'Is ShareLove Letters really free?',
    a: 'Yes. Writing and sharing letters is completely free — templates, the editor, photo uploads, private links, password protection, scheduled delivery, quotes and bouquets all included. There are no coins, no subscriptions and no credit card required.',
  },
  {
    q: 'Do I need an account to send a letter?',
    a: 'No. Guests can write and share a letter with no sign-up at all. Creating a free account is optional — it lets you save up to 10 letters a month and manage them from a dashboard.',
  },
  {
    q: 'Are the letters private and encrypted?',
    a: 'Yes. Every letter is encrypted at rest with bank-grade AES-256, so the database holds only ciphertext rather than your words. That is encryption at rest, not end-to-end encryption — we hold the key, because the letter has to be decrypted to show it to the person you sent it to, and we explain exactly what that does and does not protect on our About page. Letters are never public, indexed or searchable, and you can add a password so only your recipient can open it.',
  },
  {
    q: 'Can I send a love letter anonymously?',
    a: 'Yes. You can write and share a letter without an account and without revealing who you are — no competitor on this list offers true anonymous send. Pair it with password protection for a private, secret letter that only reaches the person you intend.',
  },
  {
    q: 'Are online love letters private and secure?',
    a: 'It depends entirely on the tool. Some store your text unencrypted behind a link search engines can crawl. The privacy-first choice is a service that encrypts letters at rest with AES-256, offers password protection, and keeps the share link out of Google — so your letter is readable only by the person holding it. That is the criterion almost nobody else in this category ranks on, and it is the one that matters most once the letter is sent.',
  },
  {
    q: 'Which website makes the letter feel most special to open?',
    a: 'The reveal is subjective, but the tools people remember use an animation — an envelope that opens or a card that unfolds — rather than dropping plain text into a tab. ShareLove, Digital Love Letters and Letters by Heart all do this well; Emocia goes furthest with full multimedia if spectacle is what you are after.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const Check = () => (
  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-sm font-bold">✓</span>
)
const Cross = () => (
  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-400 text-sm">✕</span>
)

export default function ComparePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <span className="inline-block bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-6">
            Honest comparison
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">
            Why ShareLove Letters?<br />
            <span className="text-rose-500">The honest answer.</span>
          </h1>
          <p className="text-rose-700/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Looking for the best digital love letter website? There are plenty of tools for sending cards and documents, but none of them were built specifically for writing meaningful, long-form letters to the people you love. We were — free, encrypted, and no account needed.
          </p>
          <p className="text-rose-700/60 text-sm leading-relaxed max-w-2xl mx-auto mt-5">
            Almost every &ldquo;best love letter website&rdquo; round-up is written by one of the sites being ranked,
            conveniently placing itself at number one. This one is too — we build ShareLove. So instead of asking you
            to trust the ranking, we have published the criteria, the competitors&apos; genuine strengths, and the
            cases where another tool suits you better.
          </p>
        </section>

        {/* How we judged — the criteria the ranking below is built on */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3 text-center">How we judged them</h2>
          <p className="text-sm text-rose-700/60 text-center max-w-2xl mx-auto mb-8 leading-relaxed">
            Most round-ups rank on vibes. These are the four questions a real person actually asks before typing
            their heart into a stranger&apos;s website.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {criteria.map((c) => (
              <div key={c.q} className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
                <h3 className="font-semibold text-rose-900 mb-2">{c.q}</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">{c.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Competitor breakdown */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-8 text-center">How we compare to the alternatives</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {competitors.map((c) => (
              <div key={c.name} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">{c.price}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">{c.focus}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{c.weakness}</p>
              </div>
            ))}

            {/* Us */}
            <div className="bg-rose-600 rounded-2xl p-6 shadow-sm text-white md:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold">💌 ShareLove Letters</h3>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">Free</span>
              </div>
              <p className="text-xs text-rose-200 mb-3 font-medium uppercase tracking-wide">Purpose-built letter writing</p>
              <ul className="text-sm text-rose-100 space-y-1.5 leading-relaxed">
                <li>✓ Built only for writing letters — nothing else</li>
                <li>✓ 57 templates across 12 emotional categories, including 8 copyable love letter templates</li>
                <li>✓ Occasion-by-occasion guides on what to say — and what to skip</li>
                <li>✓ Free printable fill-in-the-blank letters — download the PDF or print it, fill the blanks in pen, done</li>
                <li>✓ A QR code for every letter you send — show it, print it, tape it to a gift — and one on every printable PDF that opens the online version of that same letter</li>
                <li>✓ Beautiful presentation for whoever receives it</li>
                <li>✓ AES-256 encrypted at rest — the database holds ciphertext, not your words</li>
                <li>✓ Share via private link, optionally with a password</li>
                <li>✓ Recipients can reply right on the letter</li>
                <li>✓ With a free account, your dashboard shows whether each letter was opened, how many times, and every reply</li>
                <li>✓ Schedule any letter to unseal on a future date — to someone else or your future self</li>
                <li>✓ Send a virtual bouquet with it — six styles, free, never wilts, and it works on a get-well or sympathy letter, not just a romantic one</li>
                <li>✓ Attach your song — Spotify, Apple Music or YouTube, playable under the letter</li>
                <li>✓ Four letter themes — vintage, midnight &amp; more</li>
                <li>✓ Free love tools — love calculator, love language quiz, zodiac match &amp; more</li>
                <li>✓ Shareable results — send a link, take a couple quiz together, save it as a Story card</li>
                <li>✓ Make a &ldquo;how well do you know me?&rdquo; quiz in under a minute — tap your answers to ready-made questions, share, watch scores (and optional emails, so you can reach your top scorers) roll in on a private scoreboard</li>
                <li>✓ Write anonymously or with an account</li>
                <li>✓ Free — no coins, no subscriptions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-8 text-center">Feature by feature</h2>
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-rose-100">
                    <th className="text-left px-6 py-4 font-semibold text-gray-700 w-48">Feature</th>
                    <th className="px-4 py-4 text-center">
                      <span className="font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full text-xs whitespace-nowrap inline-block">💌&nbsp;Us</span>
                    </th>
                    <th className="px-4 py-4 text-center text-xs text-gray-500 font-medium">Digital Love Letters</th>
                    <th className="px-4 py-4 text-center text-xs text-gray-500 font-medium">Paperless Post</th>
                    <th className="px-4 py-4 text-center text-xs text-gray-500 font-medium">Hallmark</th>
                    <th className="px-4 py-4 text-center text-xs text-gray-500 font-medium">Canva</th>
                    <th className="px-4 py-4 text-center text-xs text-gray-500 font-medium">Google Docs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50">
                  {features.map((row) => (
                    <tr key={row.feature} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-6 py-3.5 text-gray-700">{row.feature}</td>
                      <td className="px-4 py-3.5 text-center">{row.us ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3.5 text-center">{row.dll ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3.5 text-center">{row.paperless ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3.5 text-center">{row.hallmark ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3.5 text-center">{row.canva ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3.5 text-center">{row.docs ? <Check /> : <Cross />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Quick verdict — the honest "another tool might suit you better" answer */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 md:p-8">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-4">Quick verdict, by what you need</h2>
            <ul className="text-sm text-rose-700/70 space-y-2.5 leading-relaxed">
              <li>
                <strong className="text-rose-900">Free, private, no signup:</strong> ShareLove Letters — that is
                exactly the gap it was built to fill.
              </li>
              <li>
                <strong className="text-rose-900">The most established romance-only brand, and you do not mind
                paying:</strong> Digital Love Letters.
              </li>
              <li>
                <strong className="text-rose-900">A multimedia spectacle:</strong> Emocia.
              </li>
              <li>
                <strong className="text-rose-900">A fast, gifty surprise:</strong> Gifft.me.
              </li>
              <li>
                <strong className="text-rose-900">A physical card in the post:</strong> Hallmark.
              </li>
            </ul>
            <p className="text-sm text-rose-700/60 leading-relaxed mt-5">
              Whichever you pick, the tool matters far less than the words — a plain letter that tells the truth will
              always beat a fancy one that says nothing. If the words are the hard part, our guide on{' '}
              <Link href="/blog/how-to-write-a-love-letter-to-your-boyfriend-or-girlfriend" className="text-rose-600 underline hover:text-rose-700">
                how to write a love letter
              </Link>{' '}
              walks it through line by line, and the{' '}
              <Link href="/blog/paragraphs-for-her" className="text-rose-600 underline hover:text-rose-700">
                copy-and-paste paragraphs
              </Link>{' '}
              give you a running start.
            </p>
          </div>
        </section>

        {/* The real difference */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-10 md:p-14">
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-6 text-center">The real difference</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-semibold text-rose-900 mb-2">Built for one thing</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">
                  Every decision we make is optimised for one goal: helping you write something that truly moves another person.
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="font-semibold text-rose-900 mb-2">The recipient experience</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">
                  When someone opens your letter, they see a beautifully presented page — not a shared doc or a forwarded email.
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="font-semibold text-rose-900 mb-2">Private by design</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">
                  Every letter is encrypted with bank-grade AES-256 at rest, so the database holds only
                  ciphertext — never plaintext behind a link a search engine can crawl. Password protect any
                  letter, write anonymously, and know your words go only where you intend.{' '}
                  <a href="/about" className="text-rose-600 underline">
                    Exactly what our encryption does and does not protect
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6 pb-20">
          <h2 className="font-serif text-3xl font-bold text-rose-900 mb-8 text-center">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
                <h3 className="font-semibold text-rose-900 mb-2">{f.q}</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Further reading — gives the comparison content somewhere to go */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">Still comparing?</h2>
            <p className="text-sm text-rose-700/70 leading-relaxed mb-3">
              If you already know what you want to send, the{' '}
              <Link href="/letters/love" className="text-rose-600 underline hover:text-rose-700">
                love letter templates
              </Link>{' '}
              are written out in full so you can copy one straight off the page, and the{' '}
              <Link href="/letters" className="text-rose-600 underline hover:text-rose-700">
                occasion guides
              </Link>{' '}
              cover the other twenty-four reasons people write.
            </p>
            <p className="text-sm text-rose-700/70 leading-relaxed">
              If what you want is to say something without your name attached, our guide to{' '}
              <Link href="/blog/how-to-send-an-anonymous-letter-to-someone" className="text-rose-600 underline hover:text-rose-700">
                sending an anonymous letter
              </Link>{' '}
              covers how to do it kindly (including a full anonymous love letter to copy), the{' '}
              <Link href="/letters/secret-letter" className="text-rose-600 underline hover:text-rose-700">
                secret letter templates
              </Link>{' '}
              give you a starting point, and{' '}
              <Link href="/quizzes" className="text-rose-600 underline hover:text-rose-700">
                our free love quizzes
              </Link>{' '}
              are a low-pressure way to work out what you have been meaning to say.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
          <h2 className="font-serif text-3xl font-bold text-rose-900 mb-4">Ready to write something real?</h2>
          <p className="text-rose-700/70 mb-8">No account needed to start. Write your first letter in under 2 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/write"
              className="bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
            >
              Write a Letter — Free
            </Link>
            <Link
              href="/about"
              className="border border-rose-200 text-rose-700 px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
