export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogMobileCta from '@/components/BlogMobileCta'

interface Props {
  params: { slug: string }
}

// Post content is stored entity-escaped, so stripping tags alone leaves literal
// "&mdash;" sequences in the JSON-LD Google reads. Decode them (&amp; last, so
// "&amp;mdash;" survives as text rather than double-decoding into an em dash).
const ENTITIES: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&mdash;': '—',
  '&ndash;': '–',
  '&nbsp;': ' ',
  '&eacute;': 'é',
  '&hellip;': '…',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&ldquo;': '“',
  '&rdquo;': '”',
}

function decodeEntities(text: string): string {
  return text
    .replace(/&(?:lt|gt|quot|#39|apos|mdash|ndash|nbsp|eacute|hellip|rsquo|lsquo|ldquo|rdquo);/g, (e) => ENTITIES[e] ?? e)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

// Extract Q&A pairs from the post's FAQ section so we can emit FAQPage structured
// data (eligible for People-Also-Ask / rich results).
//
// Two markup shapes are accepted, because posts are authored by hand and have
// historically used both. Accepting only <h3>/<p> silently dropped FAQPage from
// /blog/spider-man-love-quotes — our best-performing post — for weeks, and the
// heading match being limited to "FAQ"/"Frequently Asked Questions" dropped it
// again from a post whose H2 read "Questions people ask". A miss here is
// invisible: the page renders perfectly and just quietly loses its schema.
// Hence the warning at the bottom — an FAQ-looking heading with zero extracted
// pairs is always a bug, in either the post or this parser.
function extractFaq(html: string, slug?: string): { q: string; a: string }[] {
  // Any H2 that looks like it introduces questions — "FAQ", "FAQs",
  // "Frequently Asked Questions", "Questions people ask about X".
  const headingRe = /<h2[^>]*>([\s\S]*?)<\/h2>/gi
  let m: RegExpExecArray | null
  let headingEnd = -1
  let headingText = ''
  while ((m = headingRe.exec(html)) !== null) {
    const text = decodeEntities(m[1].replace(/<[^>]+>/g, ' '))
    if (/\bFAQs?\b/i.test(text) || /\bquestions?\b/i.test(text)) {
      headingEnd = m.index + m[0].length
      headingText = text
      break
    }
  }
  if (headingEnd === -1) return []

  const afterHeading = html.slice(headingEnd)
  const nextH2 = afterHeading.search(/<h2[^>]*>/i)
  const faqHtml = nextH2 === -1 ? afterHeading : afterHeading.slice(0, nextH2)

  const items: { q: string; a: string }[] = []
  const push = (rawQ: string, rawA: string) => {
    const q = decodeEntities(rawQ.replace(/<[^>]+>/g, ' '))
    const a = decodeEntities(rawA.replace(/<[^>]+>/g, ' '))
    if (q && a) items.push({ q, a })
  }

  // Shape 1: <h3>Question</h3> followed by the answer.
  const h3Re = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/gi
  while ((m = h3Re.exec(faqHtml)) !== null) push(m[1], m[2])

  // Shape 2: <p><strong>Question?</strong> Answer.</p>
  if (items.length === 0) {
    const pRe = /<p[^>]*>\s*<(strong|b)[^>]*>([\s\S]*?)<\/\1>([\s\S]*?)<\/p>/gi
    while ((m = pRe.exec(faqHtml)) !== null) push(m[2], m[3])
  }

  if (items.length === 0) {
    console.warn(
      `[blog/faq] ${slug ?? '(unknown slug)'}: found an FAQ-style H2 (${JSON.stringify(headingText)}) ` +
        'but extracted 0 Q&A pairs, so no FAQPage schema was emitted. Expected either ' +
        '<h3>Question</h3><p>Answer</p> or <p><strong>Question?</strong> Answer.</p>.'
    )
  }
  return items
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createSupabaseServerClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  // Increment view count (fire and forget)
  supabase
    .from('blog_posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', post.id)
    .then(() => {})

  const date = post.published_at ?? post.created_at
  const formatted = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const words = post.content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  const readMins = Math.max(1, Math.round(words / 200))
  const views = (post.view_count || 0) + 1

  const canonical = `https://www.shareloveletters.com/blog/${params.slug}`
  const publisher = {
    '@type': 'Organization',
    name: 'ShareLove Letters',
    url: 'https://www.shareloveletters.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.shareloveletters.com/favicon.ico',
    },
  }
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': canonical,
    url: canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    headline: post.title,
    description: post.meta_description || post.excerpt || '',
    datePublished: new Date(date).toISOString(),
    dateModified: new Date(post.updated_at ?? date).toISOString(),
    author: { '@type': 'Organization', name: 'ShareLove Letters Team', url: 'https://www.shareloveletters.com' },
    publisher,
    // Google's Article rich results only accept .jpg/.png/.gif — every cover has a
    // PNG twin alongside the SVG used for the on-page hero.
    ...(post.cover_image ? { image: [post.cover_image.replace(/\.svg$/, '.png')] } : {}),
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.shareloveletters.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.shareloveletters.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
    ],
  }
  const faqItems = extractFaq(post.content as string, params.slug)
  const faqJsonLd = faqItems.length >= 2 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <Navbar />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-6 py-16">
          <Link href="/blog" className="text-sm text-rose-500 hover:text-rose-700 transition-colors mb-8 inline-block">
            ← Back to Blog
          </Link>

          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {(post.tags as string[]).map((tag: string) => (
                <span key={tag} className="text-xs bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full capitalize">{tag}</span>
              ))}
            </div>
            <h1 className="font-serif text-4xl font-bold text-rose-900 mb-4 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-rose-400">
              <span>{post.author}</span>
              <span>•</span>
              <span>{formatted}</span>
              <span>•</span>
              <span>📖 {readMins} min read</span>
              <span>•</span>
              <span>👁 {views.toLocaleString()} {views === 1 ? 'view' : 'views'}</span>
            </div>
          </header>

          {post.cover_image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={post.cover_image} alt={post.title} className="w-full rounded-2xl mb-10 shadow-md object-cover max-h-[420px]" />
          )}

          <div
            className="prose prose-rose max-w-none prose-headings:font-serif prose-h2:text-rose-900 prose-p:text-rose-800/80 prose-p:leading-relaxed prose-em:text-rose-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 border-t border-rose-100 pt-10 text-center">
            <div className="text-4xl mb-4">💌</div>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">Inspired to write?</h2>
            <p className="text-rose-600/70 mb-6 text-sm">Put these ideas into practice. Write a heartfelt letter to someone you care about — right now.</p>
            <Link
              href="/write"
              className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-rose-700 transition-colors shadow-md"
            >
              Write a Letter
            </Link>
          </div>
        </article>
        <BlogMobileCta />
      </main>
      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  const supabase = createSupabaseServerClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, meta_title, meta_description, cover_image')
    .eq('slug', params.slug)
    .single()

  if (!post) return { title: 'Post Not Found' }

  const url = `https://www.shareloveletters.com/blog/${params.slug}`
  const ogTitle = post.meta_title || post.title
  const ogDescription = post.meta_description || post.excerpt || ''
  // Social scrapers (Facebook, X, LinkedIn, Pinterest, WhatsApp) cannot render SVG
  // og:images. Every cover is stored as both <name>.svg (used on-page) and <name>.png,
  // so point the share image at the PNG twin and fall back to the site default.
  const shareImage = post.cover_image
    ? post.cover_image.replace(/\.svg$/, '.png')
    : 'https://www.shareloveletters.com/opengraph-image.png'
  const images = [{ url: shareImage, width: 1200, height: 630, alt: post.title }]

  return {
    title: post.meta_title || `${post.title} — ShareLove Letters Blog`,
    description: ogDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      title: ogTitle,
      description: ogDescription,
      url,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [shareImage],
    },
  }
}
