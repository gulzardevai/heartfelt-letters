export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Props {
  params: { slug: string }
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

  const date = post.published_at ?? post.created_at
  const formatted = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="min-h-screen flex flex-col">
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
            <div className="flex items-center gap-3 text-sm text-rose-400">
              <span>{post.author}</span>
              <span>•</span>
              <span>{formatted}</span>
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
      </main>
      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  const supabase = createSupabaseServerClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, meta_title, meta_description')
    .eq('slug', params.slug)
    .single()

  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.meta_title || `${post.title} — ShareLove Letters Blog`,
    description: post.meta_description || post.excerpt || '',
  }
}
