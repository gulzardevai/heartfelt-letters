import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import QuizPlayer from '@/components/QuizPlayer'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import type { AdminQuiz } from '@/lib/admin-quizzes'

export const dynamic = 'force-dynamic'

async function getQuiz(slug: string): Promise<AdminQuiz | null> {
  const db = getSupabaseAdmin()
  const { data } = await db
    .from('admin_quizzes')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return (data as AdminQuiz) ?? null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const quiz = await getQuiz(params.slug)
  if (!quiz) return {}
  const url = `https://www.shareloveletters.com/quizzes/${quiz.slug}`
  // Keep the SERP title under ~60 chars: add the longest suffix that still fits.
  const base = quiz.title
  const title =
    base.length + 28 <= 60
      ? `${base} — Free Quiz, Instant Result`
      : base.length + 13 <= 60
        ? `${base} — Free Quiz`
        : base
  const description =
    quiz.description.length > 158 ? `${quiz.description.slice(0, 155).trimEnd()}…` : quiz.description
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'ShareLove Letters — write a letter they will keep' }], title: quiz.title, description: quiz.description, url, type: 'website' },
  }
}

export default async function QuizPage({ params }: { params: { slug: string } }) {
  const quiz = await getQuiz(params.slug)
  if (!quiz) notFound()

  // Lightweight page-view counter — fire-and-forget, no PII.
  const db = getSupabaseAdmin()
  await db.rpc('increment_admin_quiz_views', { quiz_slug: quiz.slug }).then(() => {}, () => {})

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />
      <main className="flex-1">
        <section className="max-w-2xl mx-auto px-6 pt-14 pb-8 text-center">
          <nav className="text-xs text-rose-400 mb-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/quizzes" className="hover:text-rose-600 transition-colors">Quizzes</Link>
            <span className="mx-2">›</span>
            <span className="text-rose-500">{quiz.title}</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-rose-700/70 leading-relaxed mb-4">{quiz.description}</p>
          )}
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-10">
          <QuizPlayer slug={quiz.slug} title={quiz.title} questions={quiz.questions} results={quiz.results} />
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-16">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 text-center">
            <div className="text-3xl mb-3">💌</div>
            <p className="text-rose-700/80 mb-6 max-w-md mx-auto">
              A quiz is a lovely bit of fun. When you want to say something that lasts, write them a real letter.
            </p>
            <Link
              href="/write"
              className="inline-block bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
            >
              Write a real letter →
            </Link>
            <p className="text-xs text-rose-400 mt-4">Free, private and encrypted — no account needed.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
