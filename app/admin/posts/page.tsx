import { getSupabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import AdminPostsTable from '@/components/AdminPostsTable'

export const dynamic = 'force-dynamic'

function wordCount(html: string | null): number {
  if (!html) return 0
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ')
  return text.split(/\s+/).filter(Boolean).length
}

export default async function AdminPostsPage() {
  const db = getSupabaseAdmin()
  const { data: posts } = await db
    .from('blog_posts')
    .select('id, slug, title, published, published_at, created_at, tags, cover_image, content, view_count')
    .order('created_at', { ascending: false })

  const rows = (posts ?? []).map((p) => ({
    id: p.id as string,
    slug: p.slug as string,
    title: p.title as string,
    published: p.published as boolean,
    published_at: p.published_at as string | null,
    created_at: p.created_at as string,
    tags: (p.tags ?? []) as string[],
    cover_image: p.cover_image as string | null,
    word_count: wordCount(p.content as string | null),
    view_count: (p.view_count as number) ?? 0,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {rows.length} total · {rows.filter((r) => r.published).length} published · {rows.filter((r) => !r.published).length} drafts
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
        >
          + New Post
        </Link>
      </div>

      <AdminPostsTable posts={rows} />
    </div>
  )
}
