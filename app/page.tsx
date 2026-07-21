import Link from 'next/link'
import { LETTER_TYPES } from '@/lib/templates'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import QuoteOfTheDay from '@/components/QuoteOfTheDay'

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is ShareLove Letters really free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Writing and sharing letters is completely free — templates, the editor, photo uploads, private links, and password protection included. No credit card, and you can even write without an account.' } },
    { '@type': 'Question', name: 'Can I write a love letter without signing up?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Guests can write and share one letter per day with no account. Sign up free to save up to 10 letters a month.' } },
    { '@type': 'Question', name: 'How does the recipient open my letter?', acceptedAnswer: { '@type': 'Answer', text: 'You share a private link. The recipient sees a sealed envelope with their name on it — they tap to break the wax seal and the letter unfolds with a beautiful animation.' } },
    { '@type': 'Question', name: 'Can I make my letter private?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can protect any letter with a password so only the person you share it with can read it. Letters are never public or searchable.' } },
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />

      <main>
      {/* Hero */}
      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-block bg-rose-100 text-rose-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Free to use • No account required
        </div>
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-rose-900 leading-tight mb-6">
          Write Letters That<br />
          <span className="text-rose-600 italic">Last Forever</span>
        </h1>
        <p className="text-lg text-rose-800/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Write free love letters online for her, him, family, and friends. Choose from elegant
          templates, add images, and share with a private link — opened like a real envelope.
          No account needed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/write"
            className="bg-rose-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-rose-700 shadow-lg hover:shadow-xl transition-all"
          >
            Start Writing ✍️
          </Link>
          <Link
            href="#templates"
            className="border border-rose-200 text-rose-800 bg-white/60 px-8 py-4 rounded-full text-base font-medium hover:border-rose-300 hover:bg-white transition-all"
          >
            Browse Templates
          </Link>
        </div>

        {/* Floating letter preview */}
        <div className="mt-16 relative mx-auto max-w-sm float-animation">
          <div className="bg-white rounded-2xl shadow-paper-lg p-8 text-left border border-rose-100 rotate-1">
            <p className="font-serif text-rose-950 text-sm leading-relaxed italic">
              &ldquo;My dearest love, every moment with you feels like a beautiful dream I never want to wake from...&rdquo;
            </p>
            <div className="mt-4 text-right text-xs text-rose-300 font-serif">— With all my love</div>
          </div>
          <div className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md">💕</div>
        </div>
      </section>

      {/* Quote of the day */}
      <QuoteOfTheDay />

      {/* Features */}
      <section className="py-16 px-6 bg-white/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center text-rose-900 mb-12">
            Everything you need to write the perfect letter
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📝', title: '30+ Templates', desc: 'Thoughtfully crafted templates for every occasion and relationship.' },
              { icon: '🔒', title: 'Password Protected', desc: 'Share your letter with a private link and optional password protection.' },
              { icon: '📧', title: 'Email Delivery', desc: 'Send your letter directly to your loved one\'s inbox.' },
              { icon: '🖼️', title: 'Add Images', desc: 'Upload photos and images to make your letter even more special.' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-paper border border-rose-50 text-center hover:-translate-y-1 transition-transform">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-serif font-semibold text-rose-900 mb-2">{f.title}</h3>
                <p className="text-sm text-rose-700/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Letter Types */}
      <section id="templates" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center text-rose-900 mb-4">
            Choose your letter type
          </h2>
          <p className="text-center text-rose-700/60 mb-10">Each type comes with beautifully written templates to get you started</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {LETTER_TYPES.map((type) => (
              <Link
                key={type.id}
                href={`/write?type=${type.id}`}
                className={`${type.bgColor} border rounded-2xl p-4 text-center hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer`}
              >
                <div className="text-3xl mb-2">{type.emoji}</div>
                <div className={`font-semibold text-sm ${type.color}`}>{type.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-white/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-rose-900 mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '🎨', title: 'Pick a Template', desc: 'Choose from 30+ templates across 10 letter types, or start from scratch.' },
              { step: '2', icon: '✍️', title: 'Write Your Letter', desc: 'Personalize with our rich editor — add formatting, colors, and images.' },
              { step: '3', icon: '💌', title: 'Share with Love', desc: 'Send via email or share a private link — with optional password protection.' },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-lg">
                  {s.step}
                </div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-serif font-semibold text-rose-900 text-lg mb-2">{s.title}</h3>
                <p className="text-rose-700/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO content + FAQ */}
      <section className="py-16 px-6 bg-white/40">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-rose-900 mb-6 text-center">
            Free love letters for every relationship
          </h2>
          <div className="text-rose-800/70 leading-relaxed space-y-4 text-[15px]">
            <p>
              ShareLove Letters is a <strong>free love letter generator</strong> and writing studio.
              Pick from 30 <Link href="/write" className="text-rose-600 underline hover:text-rose-800">free love letter templates</Link> —
              romantic letters for her or him, birthday and anniversary letters, apology letters,
              thank-you notes, and letters for parents and friends — then make them yours with our
              rich editor, custom fonts, and photos.
            </p>
            <p>
              Every letter is shared as a private link that opens like a real envelope, complete with
              a wax seal. Add a password so only your person can read it, or write an
              <strong> anonymous love letter</strong> without creating an account. Need the right
              words? Borrow a line from our <Link href="/quotes" className="text-rose-600 underline hover:text-rose-800">library of 700+ free quotes</Link> or
              follow the guides on our <Link href="/blog" className="text-rose-600 underline hover:text-rose-800">letter-writing blog</Link>.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <h3 className="font-serif text-xl font-bold text-rose-900 text-center mb-6">Frequently asked questions</h3>
            {[
              { q: 'Is ShareLove Letters really free?', a: 'Yes. Writing and sharing letters is completely free — templates, the editor, photo uploads, private links, and password protection included. No credit card, and you can even write without an account.' },
              { q: 'Can I write a love letter without signing up?', a: 'Yes. Guests can write and share one letter per day with no account. Sign up free to save up to 10 letters a month and manage them from your dashboard.' },
              { q: 'How does the recipient open my letter?', a: 'You share a private link. When your recipient opens it, they see a sealed envelope with their name on it — they tap to break the wax seal and the letter unfolds with a beautiful animation.' },
              { q: 'Can I make my letter private?', a: 'Yes. You can protect any letter with a password so only the person you share it with can read it. Letters are never public or searchable.' },
            ].map(item => (
              <details key={item.q} className="bg-white rounded-2xl border border-rose-100 px-5 py-4 group">
                <summary className="font-medium text-rose-900 cursor-pointer text-sm list-none flex justify-between items-center">
                  {item.q}
                  <span className="text-rose-300 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="text-sm text-rose-700/70 leading-relaxed mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-6">💌</div>
          <h2 className="font-serif text-4xl font-bold text-rose-900 mb-4">
            Someone is waiting to hear from you
          </h2>
          <p className="text-rose-700/60 mb-8 leading-relaxed">
            Don&apos;t let another day pass without telling them how much they mean to you.
            It only takes a few minutes to write something they&apos;ll treasure forever.
          </p>
          <Link
            href="/write"
            className="inline-block bg-rose-600 text-white px-10 py-4 rounded-full text-base font-semibold hover:bg-rose-700 shadow-lg hover:shadow-xl transition-all"
          >
            Write Your Letter Now
          </Link>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  )
}
