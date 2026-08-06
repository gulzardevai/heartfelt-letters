import { MetadataRoute } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { OCCASIONS } from '@/lib/occasions'
import { QUOTE_CATEGORY_PAGES } from '@/lib/quotes'
import { TOOLS } from '@/lib/tools'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const BASE = 'https://www.shareloveletters.com'

// Static (non-DB-driven) pages must NOT report lastmod = "now" on every crawl —
// a sitemap where every URL is always freshly modified trains Google to ignore
// our lastmod values entirely, including the accurate ones on blog posts and
// quizzes. Bump this constant whenever the static page copy is actually changed.
const STATIC_LAST_MODIFIED = new Date('2026-08-06T00:00:00.000Z')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/write`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/letters`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.9 },
    ...OCCASIONS.map(o => ({
      url: `${BASE}/letters/${o.slug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${BASE}/printable-letter-templates`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/letter-themes`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/quiz`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    ...TOOLS.map(t => ({
      url: `${BASE}/tools/${t.slug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    { url: `${BASE}/quotes`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
    ...QUOTE_CATEGORY_PAGES.map(c => ({
      url: `${BASE}/quotes/${c.slug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${BASE}/blog`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/compare`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
  ]

  let blogPages: MetadataRoute.Sitemap = []
  try {
    const db = getSupabaseAdmin()
    const { data: posts } = await db
      .from('blog_posts')
      .select('slug, published_at, created_at')
      .eq('published', true)

    blogPages = (posts ?? []).map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.published_at ?? p.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    // sitemap still serves static pages if DB is unreachable
  }

  let quizPages: MetadataRoute.Sitemap = []
  try {
    const db = getSupabaseAdmin()
    const { data: quizzes } = await db
      .from('admin_quizzes')
      .select('slug, updated_at')
      .eq('published', true)

    if (quizzes?.length) {
      quizPages = [
        { url: `${BASE}/quizzes`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly' as const, priority: 0.6 },
        ...quizzes.map(q => ({
          url: `${BASE}/quizzes/${q.slug}`,
          lastModified: new Date(q.updated_at),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        })),
      ]
    }
  } catch {
    // ignore — quizzes are optional in the sitemap
  }

  return [...staticPages, ...blogPages, ...quizPages]
}
