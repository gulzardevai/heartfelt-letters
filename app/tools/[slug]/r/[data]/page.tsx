import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ToolWidget from '@/components/tools/ToolWidget'
import { getTool } from '@/lib/tools'
import { decodeState, SITE } from '@/lib/tools-share'
import { cardFor, shareTextFor } from '@/lib/tools-result'

// Result permalinks are shareable artifacts, NOT indexable surfaces. They carry
// a canonical pointing back to the base /tools/<slug> page and are noindexed, so
// they never spawn thin duplicate index bloat. The base tool page stays the one
// canonical, indexable surface. (Middleware also sets X-Robots-Tag: noindex and
// suppresses the self-referencing Link canonical header for these URLs.)
export function generateMetadata({ params }: { params: { slug: string; data: string } }): Metadata {
  const tool = getTool(params.slug)
  if (!tool) return {}
  const base = `${SITE}/tools/${tool.slug}`
  const state = decodeState(params.data)
  const card = cardFor(tool.slug, state)
  const title = `${card.heading}${card.big ? ` — ${card.big}` : ''} · ShareLove Letters`
  const desc = shareTextFor(tool.slug, state)
  const cardImg = `${base}/r/${params.data}/card`

  return {
    title,
    description: desc,
    alternates: { canonical: base },
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description: desc,
      url: `${base}/r/${params.data}`,
      type: 'website',
      images: [{ url: cardImg, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [cardImg],
    },
  }
}

export default function ToolResultPage({ params }: { params: { slug: string; data: string } }) {
  const tool = getTool(params.slug)
  if (!tool) notFound()
  const state = decodeState(params.data)
  const writeHref = tool.writeType ? `/write?type=${tool.writeType}` : '/write'

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />
      <main className="flex-1">
        <section className="max-w-2xl mx-auto px-6 pt-14 pb-8 text-center">
          <nav className="text-xs text-rose-400 mb-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/tools" className="hover:text-rose-600 transition-colors">Tools</Link>
            <span className="mx-2">›</span>
            <Link href={`/tools/${tool.slug}`} className="hover:text-rose-600 transition-colors">{tool.name}</Link>
          </nav>
          <div className="text-5xl mb-5">{tool.emoji}</div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-rose-900 mb-4 leading-tight">
            {tool.h1}
          </h1>
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-10">
          <ToolWidget slug={tool.slug} initial={state} />
        </section>

        {/* Funnel CTA into /write */}
        <section className="max-w-2xl mx-auto px-6 pb-10">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 text-center">
            <div className="text-3xl mb-3">💌</div>
            <p className="text-rose-700/80 mb-6 max-w-md mx-auto">{tool.ctaLine}</p>
            <Link
              href={writeHref}
              className="inline-block bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
            >
              Write them a real letter →
            </Link>
            <p className="text-xs text-rose-400 mt-4">Free, private and encrypted — no account needed.</p>
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-16 text-center">
          <Link
            href={`/tools/${tool.slug}`}
            className="text-sm bg-white border border-rose-100 text-rose-700 px-5 py-2.5 rounded-full hover:bg-rose-50 transition-colors"
          >
            Try it yourself →
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
