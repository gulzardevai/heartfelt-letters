import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import QuoteCopyButton from '@/components/QuoteCopyButton'
import {
  QUOTE_CATEGORY_PAGES,
  getQuoteCategoryPage,
  getQuotesByCategory,
} from '@/lib/quotes'

interface Props {
  params: { category: string }
}

export function generateStaticParams() {
  return QUOTE_CATEGORY_PAGES.map(c => ({ category: c.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const cat = getQuoteCategoryPage(params.category)
  if (!cat) return { title: 'Category not found' }

  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    alternates: { canonical: `https://www.shareloveletters.com/quotes/${cat.slug}` },
    openGraph: {
      title: cat.metaTitle,
      description: cat.metaDescription,
      url: `https://www.shareloveletters.com/quotes/${cat.slug}`,
      type: 'website',
    },
  }
}

export default function QuoteCategoryPage({ params }: Props) {
  const cat = getQuoteCategoryPage(params.category)
  if (!cat) notFound()

  const quotes = getQuotesByCategory(cat.category)
  const related = cat.related.map(getQuoteCategoryPage).filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 pt-14 pb-10 text-center">
          <nav className="text-xs text-rose-400 mb-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/quotes" className="hover:text-rose-600 transition-colors">Quotes</Link>
            <span className="mx-2">›</span>
            <span className="text-rose-500">{cat.name}</span>
          </nav>

          <div className="text-5xl mb-5">{cat.emoji}</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">
            {cat.h1}
          </h1>
          <p className="text-rose-700/70 leading-relaxed text-left sm:text-center">
            {cat.intro}
          </p>

          <Link
            href={`/write?type=${cat.writeType}`}
            className="inline-block mt-7 bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Write a letter with one of these — free
          </Link>
          <p className="text-xs text-rose-400 mt-3">No account needed • Free • Encrypted</p>
        </section>

        {/* Quotes grid */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <p className="text-sm text-rose-600/60 mb-5">{quotes.length} {cat.name.toLowerCase()} quotes</p>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {quotes.map(quote => (
              <div
                key={quote.id}
                className="break-inside-avoid bg-white rounded-2xl border border-rose-100 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full mb-4">
                  {cat.emoji} {cat.name}
                </span>
                <blockquote className="font-serif text-rose-900 text-[15px] leading-relaxed mb-4">
                  &ldquo;{quote.text}&rdquo;
                </blockquote>
                <p className="text-xs text-rose-500 font-medium mb-4">— {quote.author}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-rose-50">
                  <QuoteCopyButton id={quote.id} text={quote.text} author={quote.author} />
                  <Link
                    href={`/write?type=${cat.writeType}`}
                    className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all font-medium ml-auto"
                    title="Use in a letter"
                  >
                    ✍️ Use
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related categories */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <h2 className="font-serif text-xl font-bold text-rose-900 mb-5 text-center">More quote categories</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {related.map(r => (
              <Link
                key={r!.slug}
                href={`/quotes/${r!.slug}`}
                className="bg-white border border-rose-100 rounded-full px-5 py-2.5 text-sm text-rose-700 hover:border-rose-300 hover:text-rose-900 transition-colors shadow-sm"
              >
                {r!.emoji} {r!.name}
              </Link>
            ))}
            <Link
              href="/quotes"
              className="bg-white border border-rose-100 rounded-full px-5 py-2.5 text-sm text-rose-700 hover:border-rose-300 hover:text-rose-900 transition-colors shadow-sm"
            >
              ✨ All quotes
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
          <h2 className="font-serif text-3xl font-bold text-rose-900 mb-4">
            Turn a quote into a letter
          </h2>
          <p className="text-rose-700/70 mb-8">
            Pick a line you love, then say the rest in your own words. It is free, private, and they open it as a sealed envelope.
          </p>
          <Link
            href={`/write?type=${cat.writeType}`}
            className="inline-block bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Start writing — free
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
