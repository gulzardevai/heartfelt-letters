import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { OCCASIONS, getOccasion } from '@/lib/occasions'
import { getTemplatesForType } from '@/lib/templates'

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

  const templates = getTemplatesForType(occasion.type)
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
            <Link href="/letters" className="hover:text-rose-600 transition-colors">Letters by occasion</Link>
            <span className="mx-2">›</span>
            <span className="text-rose-500">{occasion.name}</span>
          </nav>

          <div className="text-5xl mb-5">{occasion.emoji}</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">
            {occasion.h1}
          </h1>
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

        {/* How it works */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 md:p-10">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6 text-center">How it arrives</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-3">✍️</div>
                <h3 className="font-semibold text-rose-900 text-sm mb-1.5">Write it</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">
                  Pick a template, change the words, choose a theme. Add photos and a bouquet if you like.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">🔗</div>
                <h3 className="font-semibold text-rose-900 text-sm mb-1.5">Share a private link</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">
                  Only people with the link can read it. Add a password, or schedule the date it opens.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">💌</div>
                <h3 className="font-semibold text-rose-900 text-sm mb-1.5">They open an envelope</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">
                  A sealed envelope with their name on it, which opens into your letter.
                </p>
              </div>
            </div>
          </div>
        </section>

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
            Ready to write it?
          </h2>
          <p className="text-rose-700/70 mb-8">
            It takes a few minutes and costs nothing. They will keep it far longer than that.
          </p>
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
