import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PrintButton from '@/components/PrintButton'
import { OCCASIONS, getOccasion } from '@/lib/occasions'
import { getTemplatesForType, TEMPLATES } from '@/lib/templates'

interface Props {
  params: { occasion: string }
}

export function generateStaticParams() {
  return OCCASIONS.map(o => ({ occasion: o.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const occasion = getOccasion(params.occasion)
  if (!occasion) return { title: 'Occasion not found' }

  return {
    title: occasion.metaTitle,
    description: occasion.metaDescription,
    alternates: { canonical: `https://www.shareloveletters.com/letters/${occasion.slug}` },
    openGraph: {
      images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'ShareLove Letters — write a letter they will keep' }],
      title: occasion.metaTitle,
      description: occasion.metaDescription,
      url: `https://www.shareloveletters.com/letters/${occasion.slug}`,
      type: 'article',
    },
  }
}

export default function OccasionPage({ params }: Props) {
  const occasion = getOccasion(params.occasion)
  if (!occasion) notFound()

  // Occasions that share a letter type declare their own template subset so
  // no two occasion pages render identical template lists (dedupes for SEO).
  const templates = occasion.templateIds
    ? occasion.templateIds
        .map(id => TEMPLATES.find(t => t.id === id))
        .filter((t): t is NonNullable<typeof t> => Boolean(t))
    : getTemplatesForType(occasion.type)
  const related = occasion.related.map(getOccasion).filter(Boolean)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: occasion.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="occasion-page min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
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
            <Link href="/letters" className="hover:text-rose-600 transition-colors">Letters by occasion</Link>
            <span className="mx-2">›</span>
            <span className="text-rose-500">{occasion.name}</span>
          </nav>

          <div className="text-5xl mb-5">{occasion.emoji}</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">
            {occasion.h1}
          </h1>
          {occasion.subheading && (
            <p className="text-rose-800/80 text-lg leading-relaxed mb-5 font-medium">
              {occasion.subheading}
            </p>
          )}
          {occasion.intro.map((p, i) => (
            <p key={i} className="text-rose-700/70 leading-relaxed mb-4 text-left sm:text-center">
              {p}
            </p>
          ))}

          <Link
            href={`/write?type=${occasion.type}`}
            className="inline-block mt-6 bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Write your {occasion.name.toLowerCase()} letter — free
          </Link>
          <p className="text-xs text-rose-400 mt-3">No account needed • Free • Encrypted</p>
          <p className="text-sm text-rose-700/60 mt-4">
            Prefer paper?{' '}
            <a href="#printable" className="text-rose-600 underline hover:text-rose-800">
              Print the fill-in-the-blank template
            </a>{' '}
            and write it by hand.
          </p>
        </section>

        {/* What to say */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 md:p-10">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6">
              What to say in a {occasion.name.toLowerCase()} letter
            </h2>
            <ul className="space-y-4 mb-8">
              {occasion.whatToSay.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm text-rose-800/80 leading-relaxed">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-rose-50 text-rose-500 text-xs font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="bg-rose-50/70 border border-rose-100 rounded-2xl px-5 py-4">
              <p className="text-sm text-rose-800/80 leading-relaxed">
                <strong className="text-rose-900">One thing to skip:</strong> {occasion.avoid}
              </p>
            </div>
          </div>
        </section>

        {/* Generic vs specific */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-2 text-center">
            The difference one specific line makes
          </h2>
          <p className="text-sm text-rose-700/60 text-center mb-8">
            Same sentiment, two ways of saying it in a {occasion.name.toLowerCase()} letter.
          </p>
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-400 mb-3">Most people write</p>
              <p className="text-sm text-rose-700/60 italic leading-relaxed">&ldquo;{occasion.example.generic}&rdquo;</p>
            </div>
            <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-500 mb-3">Write this instead</p>
              <p className="text-sm text-rose-900/90 italic leading-relaxed">&ldquo;{occasion.example.better}&rdquo;</p>
            </div>
          </div>
          <div className="bg-rose-50/70 border border-rose-100 rounded-2xl px-5 py-4">
            <p className="text-sm text-rose-800/80 leading-relaxed">
              <strong className="text-rose-900">Why it works:</strong> {occasion.example.why}
            </p>
          </div>
        </section>

        {/* Opening lines */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-2 text-center">
            Three ways to open a {occasion.name.toLowerCase()} letter
          </h2>
          <p className="text-sm text-rose-700/60 text-center mb-8">
            The first line is the hard part. Steal one of these and fill in the brackets.
          </p>
          <div className="space-y-4">
            {occasion.openers.map((line, i) => (
              <div key={i} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                <p className="font-serif text-rose-900/90 leading-relaxed italic">&ldquo;{line}&rdquo;</p>
              </div>
            ))}
          </div>
        </section>

        {/* Templates */}
        <section className="max-w-4xl mx-auto px-6 pb-14">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-2 text-center">
            {occasion.name} letter templates
          </h2>
          <p className="text-sm text-rose-700/60 text-center mb-8">
            Start from one of these and make it yours — they open straight into the editor.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {templates.map(t => (
              <div key={t.id} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm flex flex-col">
                <h3 className="font-serif font-semibold text-rose-900 mb-2">{t.name}</h3>
                <p className="text-sm text-rose-700/60 italic leading-relaxed mb-5 flex-1">
                  &ldquo;{t.preview}&rdquo;
                </p>
                <Link
                  href={`/write?type=${occasion.type}&template=${t.id}`}
                  className="text-sm text-center bg-rose-50 text-rose-700 px-4 py-2.5 rounded-xl hover:bg-rose-100 transition-colors font-medium"
                >
                  Use this template →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Printable fill-in-the-blank template */}
        <section id="printable" className="print-sheet max-w-3xl mx-auto px-6 pb-14 scroll-mt-20">
          <div className="text-center mb-8 print-hide">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-2">
              Printable {occasion.name.toLowerCase()} letter template
            </h2>
            <p className="text-sm text-rose-700/60 max-w-xl mx-auto">
              A fill-in-the-blank version. Print it and write by hand on the lines, or use the brackets
              as prompts and type it online — either way, replace every bracket with something only you
              would know.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <PrintButton />
              <Link
                href={`/write?type=${occasion.type}`}
                className="inline-block bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-rose-700 transition-colors shadow-sm"
              >
                Fill it in online instead →
              </Link>
            </div>
          </div>

          <div className="print-sheet-card bg-white rounded-3xl border border-rose-100 shadow-sm p-8 md:p-12">
            <p className="font-serif text-lg font-bold text-rose-900 mb-1">
              {occasion.emoji} {occasion.name} letter
            </p>
            <p className="text-xs text-rose-400 mb-8 pb-6 border-b border-rose-100">
              Fill in the brackets. Cross out anything that is not true of the two of you.
            </p>
            {occasion.fillIn.map((line, i) => (
              <div key={i} className="mb-7">
                <p className="font-serif text-[15px] text-rose-900/90 leading-relaxed">{line}</p>
                <div className="print-rule mt-4 border-b border-rose-100" />
                <div className="print-rule mt-7 border-b border-rose-100" />
              </div>
            ))}
            <p className="text-[11px] text-rose-400 text-center pt-6 border-t border-rose-100">
              shareloveletters.com — free letter templates. Write it online and they open a sealed
              envelope with their name on it.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 md:p-10">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6 text-center">How it arrives</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-3">✍️</div>
                <h3 className="font-semibold text-rose-900 text-sm mb-1.5">Write it</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">
                  Edit a template, pick a theme, add photos or a song.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">🔗</div>
                <h3 className="font-semibold text-rose-900 text-sm mb-1.5">Share a private link</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">
                  Password-protect it, or set the date it unlocks.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">💌</div>
                <h3 className="font-semibold text-rose-900 text-sm mb-1.5">They open an envelope</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">
                  Sealed, with their name on it, opening into your {occasion.name.toLowerCase()} letter.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Differentiator callout */}
        {occasion.moat && (
          <section className="max-w-3xl mx-auto px-6 pb-14">
            <div className="bg-rose-600 text-white rounded-3xl shadow-md p-8 md:p-10">
              <h2 className="font-serif text-2xl font-bold mb-4">{occasion.moat.heading}</h2>
              <p className="text-rose-50/90 leading-relaxed text-sm md:text-[15px]">{occasion.moat.body}</p>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6 text-center">Questions people ask</h2>
          <div className="space-y-4">
            {occasion.faq.map(f => (
              <div key={f.q} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                <h3 className="font-semibold text-rose-900 mb-2 text-sm">{f.q}</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="font-serif text-xl font-bold text-rose-900 mb-5 text-center">Other occasions</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {related.map(r => (
              <Link
                key={r!.slug}
                href={`/letters/${r!.slug}`}
                className="bg-white border border-rose-100 rounded-full px-5 py-2.5 text-sm text-rose-700 hover:border-rose-300 hover:text-rose-900 transition-colors shadow-sm"
              >
                {r!.emoji} {r!.name}
              </Link>
            ))}
          </div>
          <p className="text-center text-sm text-rose-700/60 mt-8">
            Need words to borrow? Browse our{' '}
            <Link href="/quotes" className="text-rose-600 underline hover:text-rose-800">700+ quote library</Link>{' '}
            or read our{' '}
            <Link href="/blog" className="text-rose-600 underline hover:text-rose-800">letter-writing guides</Link>.
          </p>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
          <h2 className="font-serif text-3xl font-bold text-rose-900 mb-4">
            Ready to write your {occasion.name.toLowerCase()} letter?
          </h2>
          <p className="text-rose-700/70 mb-8">{occasion.closing}</p>
          <Link
            href={`/write?type=${occasion.type}`}
            className="inline-block bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Start your {occasion.name.toLowerCase()} letter
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
