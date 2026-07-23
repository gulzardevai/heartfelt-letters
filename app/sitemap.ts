import { MetadataRoute } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { OCCASIONS } from '@/lib/occasions'
import { QUOTE_CATEGORY_PAGES } from '@/lib/quotes'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const BASE = 'https://www.shareloveletters.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/write`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/letters`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    ...OCCASIONS.map(o => ({
      url: `${BASE}/letters/${o.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${BASE}/quotes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...QUOTE_CATEGORY_PAGES.map(c => ({
      url: `${BASE}/quotes/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
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

  return [...staticPages, ...blogPages]
}
