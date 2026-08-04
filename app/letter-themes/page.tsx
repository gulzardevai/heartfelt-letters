import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { THEMES } from '@/lib/themes'

export const metadata: Metadata = {
  title: 'Love Letter Themes — Vintage, Midnight & Aesthetic Letter Templates',
  description:
    'Dress your letter in a beautiful theme. Choose a vintage love letter template, a moonlit midnight theme, soft blossom pink or timeless classic — each with a matching envelope. Free, no account needed.',
  alternates: { canonical: 'https://www.shareloveletters.com/letter-themes' },
  openGraph: {
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'ShareLove Letters — write a letter they will keep' }],
    title: 'Love Letter Themes — Vintage, Midnight & Aesthetic Letter Templates',
    description:
      'Choose a vintage, midnight, blossom or classic theme for your love letter — each with a matching sealed envelope. Free, private, no account needed.',
    url: 'https://www.shareloveletters.com/letter-themes',
    type: 'website',
  },
}

// Page-level SEO copy for each theme (kept out of lib/themes.ts, which stays
// pure visual metadata). Keyed by theme id.
const THEME_COPY: Record<string, { tagline: string; description: string; keyword: string }> = {
  classic: {
    keyword: 'Classic love letter',
    tagline: 'Timeless rose &amp; cream',
    description:
      'The original ShareLove look — warm cream paper, deep rose ink and a red wax seal. Elegant and unmistakably romantic for any love letter.',
  },
  vintage: {
    keyword: 'Vintage love letter template',
    tagline: 'Aged parchment &amp; sepia ink',
    description:
      'A vintage love letter template with aged-parchment paper, sepia-brown handwriting and a burnt-umber seal — the look of a letter found in an old drawer, written to be kept for decades.',
  },
  midnight: {
    keyword: 'Midnight love letter',
    tagline: 'Moonlit navy &amp; gold',
    description:
      'A moody, romantic theme in deep midnight navy with soft candle-cream text and a gold wax seal. Perfect for a letter meant to be read late at night.',
  },
  blossom: {
    keyword: 'Blossom love letter',
    tagline: 'Soft cherry-blossom pink',
    description:
      'An aesthetic love letter in gentle cherry-blossom pinks with rose-mauve ink and a magenta seal — sweet, delicate and made for spring confessions.',
  },
}

const FAQ = [
  {
    q: 'What is a vintage love letter template?',
    a: 'It is a letter styled to look old and treasured — aged parchment paper, sepia handwriting and a wax seal. On ShareLove the Vintage theme applies that look to your words and the sealed envelope automatically, so you write a modern message that arrives feeling timeless.',
  },
  {
    q: 'Are the letter themes free?',
    a: 'Yes. Every theme — Classic, Vintage, Midnight and Blossom — is completely free, with no account required to send your first letter.',
  },
  {
    q: 'Does the theme change the envelope too?',
    a: 'It does. Each theme colours the whole experience: the paper, the ink, the headings and the sealed envelope the recipient opens, so the whole letter feels of a piece.',
  },
  {
    q: 'Can I switch themes after I start writing?',
    a: 'Anytime. Pick a theme from a preview here to open the editor with it applied, then swap between all four in the Theme panel while you write — your words stay exactly as they are.',
  },
]

export default function LetterThemesPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 pt-14 pb-12 text-center">
          <nav className="text-xs text-rose-400 mb-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-rose-500">Letter themes</span>
          </nav>

          <div className="text-5xl mb-5">🎨</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">
            Love letter themes
          </h1>
          <p className="text-rose-700/70 leading-relaxed mb-4 text-left sm:text-center">
            The right words deserve the right paper. Wrap your letter in a theme that matches the
            mood — an aged <strong>vintage love letter template</strong>, a moonlit midnight theme, soft
            cherry-blossom pink, or the timeless classic. Each one restyles the paper, the ink and the
            sealed envelope your recipient opens.
          </p>
          <p className="text-rose-700/70 leading-relaxed mb-4 text-left sm:text-center">
            Every theme is free, works without an account, and keeps your letter privately encrypted.
            Pick one below to open the editor with it already applied.
          </p>
        </section>

        {/* Theme previews */}
        <section className="max-w-4xl mx-auto px-6 pb-14">
          <div className="grid sm:grid-cols-2 gap-6">
            {THEMES.map(theme => {
              const copy = THEME_COPY[theme.id]
              return (
                <div
                  key={theme.id}
                  className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Visual preview rendered in the theme's own colours */}
                  <div
                    className="p-6 pb-5"
                    style={{ backgroundColor: theme.paper }}
                  >
                    <div
                      className="text-[11px] font-semibold tracking-widest uppercase mb-2"
                      style={{ color: theme.accent }}
                    >
                      {theme.emoji} {theme.label}
                    </div>
                    <div
                      className="font-serif text-lg mb-2"
                      style={{ color: theme.accent }}
                    >
                      My dearest,
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: theme.text }}
                    >
                      Some things are easier to write than to say out loud. This is one of them —
                      every word here is meant only for you.
                    </p>
                    <div
                      className="font-serif italic text-sm mt-3"
                      style={{ color: theme.accent }}
                    >
                      — always yours
                    </div>
                    {/* Envelope + seal colour strip */}
                    <div className="flex items-center gap-1.5 mt-4">
                      {[theme.envelope.front2, theme.envelope.flap1, theme.envelope.flap2].map((c, i) => (
                        <span
                          key={i}
                          className="h-3.5 w-6 rounded-sm border border-black/5"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <span
                        className="h-4 w-4 rounded-full border border-black/10 ml-0.5"
                        style={{ backgroundColor: theme.envelope.seal1 }}
                        aria-hidden
                      />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="font-serif text-xl font-bold text-rose-900 mb-1">
                      {copy.keyword}
                    </h2>
                    <p
                      className="text-xs text-rose-400 mb-3"
                      dangerouslySetInnerHTML={{ __html: copy.tagline }}
                    />
                    <p className="text-sm text-rose-700/70 leading-relaxed mb-5 flex-1">
                      {copy.description}
                    </p>
                    <Link
                      href={`/write?theme=${theme.id}`}
                      className="text-sm text-center bg-rose-600 text-white px-4 py-2.5 rounded-xl hover:bg-rose-700 transition-colors font-medium"
                    >
                      Write with the {theme.label} theme →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 md:p-10">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6 text-center">
              How themes work
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="font-semibold text-rose-900 text-sm mb-1.5">Pick a look</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">
                  Choose vintage, midnight, blossom or classic — or swap between them freely while you write.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">✍️</div>
                <h3 className="font-semibold text-rose-900 text-sm mb-1.5">Write your letter</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">
                  Start from a template or a blank page. The theme colours the paper, ink and headings as you go.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">💌</div>
                <h3 className="font-semibold text-rose-900 text-sm mb-1.5">They open it</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">
                  A matching sealed envelope arrives by private link and opens into your themed letter.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6 text-center">Questions people ask</h2>
          <div className="space-y-4">
            {FAQ.map(f => (
              <div key={f.q} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                <h3 className="font-semibold text-rose-900 mb-2 text-sm">{f.q}</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
          <p className="text-sm text-rose-700/60">
            Not sure what to write? Browse{' '}
            <Link href="/letters" className="text-rose-600 underline hover:text-rose-800">letters by occasion</Link>,{' '}
            our{' '}
            <Link href="/quotes" className="text-rose-600 underline hover:text-rose-800">700+ quote library</Link>{' '}
            or read the{' '}
            <Link href="/blog" className="text-rose-600 underline hover:text-rose-800">letter-writing guides</Link>.
          </p>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
          <h2 className="font-serif text-3xl font-bold text-rose-900 mb-4">
            Ready to write it?
          </h2>
          <p className="text-rose-700/70 mb-8">
            Pick a theme, say what you mean, and send it as a sealed envelope. Free, private, no account needed.
          </p>
          <Link
            href="/write"
            className="inline-block bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Start your letter — free
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
