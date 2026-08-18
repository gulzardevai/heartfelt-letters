import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ToolWidget from '@/components/tools/ToolWidget'
import { TOOLS, getTool } from '@/lib/tools'
import { getToolGuide } from '@/lib/tool-guides'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return TOOLS.map(t => ({ slug: t.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = getTool(params.slug)
  if (!tool) return {}
  const url = `https://www.shareloveletters.com/tools/${tool.slug}`
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'ShareLove Letters — write a letter they will keep' }],
      title: tool.metaTitle,
      description: tool.metaDescription,
      url,
      type: 'website',
    },
  }
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug)
  if (!tool) notFound()

  const writeHref = tool.writeType ? `/write?type=${tool.writeType}` : '/write'
  const guide = getToolGuide(tool.slug)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.shareloveletters.com' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.shareloveletters.com/tools' },
      { '@type': 'ListItem', position: 3, name: tool.name, item: `https://www.shareloveletters.com/tools/${tool.slug}` },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-2xl mx-auto px-6 pt-14 pb-8 text-center">
          <nav className="text-xs text-rose-400 mb-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/tools" className="hover:text-rose-600 transition-colors">Tools</Link>
            <span className="mx-2">›</span>
            <span className="text-rose-500">{tool.name}</span>
          </nav>

          <div className="text-5xl mb-5">{tool.emoji}</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">
            {tool.h1}
          </h1>
          {tool.intro.map((p, i) => (
            <p key={i} className="text-rose-700/70 leading-relaxed mb-4 text-left sm:text-center">
              {p}
            </p>
          ))}
        </section>

        {/* Interactive tool */}
        <section className="max-w-2xl mx-auto px-6 pb-10">
          <ToolWidget slug={tool.slug} />
        </section>

        {/* How to use it — the widget is client-side, so the steps are also the
            only server-rendered explanation of what the thing actually does. */}
        {guide?.steps && (
          <section className="max-w-2xl mx-auto px-6 pb-12">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6 text-center">How it works</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {guide.steps.map((s, i) => (
                <div key={s.title} className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm text-center">
                  <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center mx-auto mb-3">{i + 1}</div>
                  <h3 className="font-semibold text-rose-900 mb-1.5 text-sm">{s.title}</h3>
                  <p className="text-xs text-rose-700/70 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Editorial guidance — the widget above is client-side, so this is the
            substance of the page for a crawler and for a first-time reader. */}
        {guide?.sections.map(s => (
          <section key={s.heading} className="max-w-2xl mx-auto px-6 pb-10">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-4">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p
                key={i}
                className="text-rose-800/75 leading-relaxed mb-4 [&_a]:text-rose-600 [&_a]:underline hover:[&_a]:text-rose-700"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </section>
        ))}

        {/* Funnel CTA into /write */}
        <section className="max-w-2xl mx-auto px-6 pb-14">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 text-center">
            <div className="text-3xl mb-3">💌</div>
            <p className="text-rose-700/80 mb-6 max-w-md mx-auto">{tool.ctaLine}</p>
            <Link
              href={writeHref}
              className="inline-block bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
            >
              Now write them a real letter →
            </Link>
            <p className="text-xs text-rose-400 mt-4">Free, private and encrypted — no account needed.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto px-6 pb-14">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6 text-center">Questions people ask</h2>
          <div className="space-y-4">
            {tool.faq.map(f => (
              <div key={f.q} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                <h3 className="font-semibold text-rose-900 mb-2 text-sm">{f.q}</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="max-w-2xl mx-auto px-6 pb-16 text-center">
          <p className="text-sm text-rose-700/60 mb-4">Keep exploring</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {tool.related.map(r => (
              <Link
                key={r.href}
                href={r.href}
                className="text-sm bg-white border border-rose-100 text-rose-700 px-4 py-2 rounded-full hover:bg-rose-50 transition-colors"
              >
                {r.label}
              </Link>
            ))}
            <Link
              href="/tools"
              className="text-sm bg-white border border-rose-100 text-rose-700 px-4 py-2 rounded-full hover:bg-rose-50 transition-colors"
            >
              All love tools
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
