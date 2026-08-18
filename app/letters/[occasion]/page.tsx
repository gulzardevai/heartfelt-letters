import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PrintableSheets from '@/components/PrintableSheets'
import TemplateLibrary from '@/components/TemplateLibrary'
import { breadcrumbLd } from '@/lib/schema'
import BouquetArt from '@/components/BouquetArt'
import { BOUQUETS } from '@/lib/bouquets'
import { OCCASIONS, getOccasion } from '@/lib/occasions'
import { getTemplateLibrary, getTemplatesForType, TEMPLATES } from '@/lib/templates'

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
  // Some occasion names already end in "letter" (Love Letter, Secret Letter);
  // appending another one gives "love letter letter". Build the phrase once.
  const lower = occasion.name.toLowerCase()
  const subject = occasion.subject ?? (lower.endsWith('letter') ? lower : `${lower} letter`)
  const Subject = subject.charAt(0).toUpperCase() + subject.slice(1)
  const library = occasion.templateLibrary ? getTemplateLibrary(occasion.templateLibrary.ids) : []
  const related = occasion.related.map(getOccasion).filter(Boolean)

  const breadcrumbJsonLd = breadcrumbLd([
    { name: 'Home', path: '' },
    { name: 'Letters by occasion', path: '/letters' },
    { name: occasion.name, path: `/letters/${occasion.slug}` },
  ])

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, faqJsonLd]) }}
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
          {occasion.proseLink && (
            <p className="text-rose-700/70 leading-relaxed mb-4 text-left sm:text-center">
              {occasion.proseLink.before}
              <Link href={occasion.proseLink.href} className="text-rose-600 underline hover:text-rose-800">
                {occasion.proseLink.anchor}
              </Link>
              {occasion.proseLink.after}
            </p>
          )}

          <Link
            href={`/write?type=${occasion.type}`}
            className="inline-block mt-6 bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Write your {subject} — free
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

        {/* Bouquet gallery — for the page whose searcher wants to see the flowers */}
        {occasion.bouquetGallery && (
          <section id="bouquets" className="max-w-4xl mx-auto px-6 pb-14 scroll-mt-20">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-rose-900 mb-2 text-center">
              {occasion.bouquetGallery.heading}
            </h2>
            <p className="text-sm text-rose-700/60 text-center mb-8 max-w-xl mx-auto">
              {occasion.bouquetGallery.intro}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {BOUQUETS.map(b => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm flex flex-col text-center"
                >
                  <BouquetArt bouquet={b} className="h-32 w-auto mx-auto mb-4" />
                  <h3 className="font-serif font-semibold text-rose-900 text-sm mb-1.5">{b.label}</h3>
                  <p className="text-xs text-rose-700/60 leading-relaxed mb-4 flex-1">{b.note}</p>
                  <Link
                    href={`/write?bouquet=${b.id}`}
                    className="text-sm text-center bg-rose-50 text-rose-700 px-4 py-2.5 rounded-xl hover:bg-rose-100 transition-colors font-medium"
                  >
                    Send these →
                  </Link>
                </div>
              ))}
            </div>
            <div className="bg-rose-50/70 border border-rose-100 rounded-2xl px-5 py-4 mt-6">
              <p className="text-sm text-rose-800/80 leading-relaxed">{occasion.bouquetGallery.note}</p>
            </div>
          </section>
        )}

        {/* Full template library — the templates themselves, high on the page */}
        {occasion.templateLibrary && library.length > 0 && (
          <section id="templates" className="max-w-3xl mx-auto px-6 pb-14 scroll-mt-20">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-rose-900 mb-2 text-center">
              {occasion.templateLibrary.heading}
            </h2>
            <p className="text-sm text-rose-700/60 text-center mb-8 max-w-xl mx-auto">
              {occasion.templateLibrary.intro}
            </p>
            <nav className="flex flex-wrap justify-center gap-2.5 mb-10">
              {library.map(t => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="bg-white border border-rose-100 rounded-full px-4 py-2 text-xs text-rose-700 hover:border-rose-300 hover:text-rose-900 transition-colors shadow-sm"
                >
                  {t.name}
                </a>
              ))}
            </nav>
            <TemplateLibrary templates={library} />
          </section>
        )}

        {/* When is it? — only for occasions whose date moves or differs by country */}
        {occasion.dates && (
          <section className="max-w-3xl mx-auto px-6 pb-14">
            <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 md:p-10">
              <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6">
                {occasion.dates.heading}
              </h2>
              <dl className="divide-y divide-rose-100">
                {occasion.dates.rows.map(row => (
                  <div key={row.region} className="py-3.5 flex flex-wrap items-baseline gap-x-3">
                    <dt className="font-semibold text-rose-900 text-sm w-36 shrink-0">{row.region}</dt>
                    <dd className="text-sm text-rose-800/80">
                      {row.date}
                      <span className="text-rose-700/50"> — {row.rule}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              {occasion.dates.note && (
                <div className="bg-rose-50/70 border border-rose-100 rounded-2xl px-5 py-4 mt-6">
                  <p className="text-sm text-rose-800/80 leading-relaxed">{occasion.dates.note}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Worked example — one complete letter, annotated line by line */}
        {occasion.annotated && (
          <section id="example" className="max-w-3xl mx-auto px-6 pb-14 scroll-mt-20">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-rose-900 mb-2 text-center">
              {occasion.annotated.heading}
            </h2>
            <p className="text-sm text-rose-700/60 text-center mb-8 max-w-xl mx-auto">
              {occasion.annotated.intro}
            </p>
            <ol className="space-y-4">
              {occasion.annotated.lines.map((line, i) => (
                <li key={i} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                  <p className="font-serif text-rose-900 leading-relaxed mb-3">{line.text}</p>
                  <p className="text-sm text-rose-700/70 leading-relaxed border-t border-rose-50 pt-3">
                    <strong className="text-rose-800 font-semibold">Why: </strong>
                    {line.note}
                  </p>
                </li>
              ))}
            </ol>
            {occasion.annotated.note && (
              <div className="bg-rose-50/70 border border-rose-100 rounded-2xl px-5 py-4 mt-6">
                <p className="text-sm text-rose-800/80 leading-relaxed">{occasion.annotated.note}</p>
              </div>
            )}
            <div className="text-center mt-7">
              <Link
                href={`/write?type=${occasion.type}`}
                className="inline-block bg-rose-600 text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
              >
                Start yours from this example — free
              </Link>
            </div>
          </section>
        )}

        {/* How to lay the letter out — only where searchers ask for the format */}
        {occasion.format && (
          <section className="max-w-3xl mx-auto px-6 pb-14">
            <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 md:p-10">
              <h2 className="font-serif text-2xl font-bold text-rose-900 mb-4">
                {occasion.format.heading}
              </h2>
              <p className="text-sm text-rose-800/80 leading-relaxed mb-7">{occasion.format.intro}</p>
              <ol className="space-y-5">
                {occasion.format.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-rose-900 text-sm mb-1.5">{step.label}</h3>
                      <p className="text-sm text-rose-800/80 leading-relaxed">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {occasion.format.note && (
                <div className="bg-rose-50/70 border border-rose-100 rounded-2xl px-5 py-4 mt-7">
                  <p className="text-sm text-rose-800/80 leading-relaxed">{occasion.format.note}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* What to say */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 md:p-10">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6">
              What to say in a {subject}
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
            Same sentiment, two ways of saying it in a {subject}.
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
            Three ways to open a {subject}
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
            {occasion.templateLibrary
              ? `Ready-to-send ${subject} templates`
              : `${Subject} templates`}
          </h2>
          <p className="text-sm text-rose-700/60 text-center mb-8">
            {occasion.templateLibrary
              ? 'Already written, with no blanks to fill in — pick one, edit the parts you want and send it.'
              : 'Start from one of these and make it yours — they open straight into the editor.'}
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

        {/* Printable template — fill-in-the-blank letter or prompt sheet */}
        <section id="printable" className="print-sheet max-w-3xl mx-auto px-6 pb-14 scroll-mt-20">
          <PrintableSheets
            name={occasion.name}
            emoji={occasion.emoji}
            slug={occasion.slug}
            type={occasion.type}
            fillIn={occasion.fillIn}
          />
          <p className="no-print text-center text-sm text-rose-700/60 mt-8">
            Need a different one?{' '}
            <Link href="/printable-letter-templates" className="text-rose-600 underline hover:text-rose-800">
              Browse all free printable letter templates
            </Link>
            .
          </p>
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
                  Sealed, with their name on it, opening into your {subject}.
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
            Ready to write your {subject}?
          </h2>
          <p className="text-rose-700/70 mb-8">{occasion.closing}</p>
          <Link
            href={`/write?type=${occasion.type}`}
            className="inline-block bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Start your {subject}
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
