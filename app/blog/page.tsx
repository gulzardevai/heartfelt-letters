export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  cover_image: string | null
  content: string
  view_count: number
  author: string
  tags: string[]
  published_at: string | null
  created_at: string
}

export default async function BlogPage() {
  const supabase = createSupabaseServerClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_image, author, tags, published_at, created_at, content, view_count')
    .eq('published', true)
    .order('published_at', { ascending: false })

  const blogPosts = (posts as BlogPost[]) ?? []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-rose-50 to-pink-50 py-16 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-serif text-4xl font-bold text-rose-900 mb-4">The ShareLove Letters Blog</h1>
            <p className="text-rose-600/70">Tips, ideas, and reflections on the art of writing letters</p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16">
          {blogPosts.length === 0 ? (
            <div className="text-center py-20 text-rose-400">No posts yet. Check back soon!</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map(post => {
                const date = post.published_at ?? post.created_at
                const formatted = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                const words = post.content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
                const readMins = Math.max(1, Math.round(words / 200))
                return (
                  <article key={post.id} className="bg-white rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    {post.cover_image && (
                      <Link href={`/blog/${post.slug}`} className="block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.cover_image} alt={post.title} className="w-full h-44 object-cover" />
                      </Link>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-xs bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full capitalize">{tag}</span>
                        ))}
                      </div>
                      <h2 className="font-serif text-xl font-bold text-rose-900 mb-3 leading-snug">
                        <Link href={`/blog/${post.slug}`} className="hover:text-rose-600 transition-colors">
                          {post.title}
                        </Link>
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-rose-700/60 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-rose-400">
                        <span>{post.author}</span>
                        <span>{formatted}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-rose-400 mt-2">
                        <span>📖 {readMins} min read</span>
                        {post.view_count > 0 && <span>👁 {post.view_count.toLocaleString()} views</span>}
                      </div>
                    </div>
                    <div className="border-t border-rose-50 px-6 py-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm text-rose-600 font-medium hover:text-rose-800 transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
