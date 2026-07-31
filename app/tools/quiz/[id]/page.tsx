import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TakeQuiz from '@/components/tools/TakeQuiz'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { toPublicQuiz, SITE, type Quiz } from '@/lib/quiz'

export const dynamic = 'force-dynamic'

async function fetchQuiz(id: string): Promise<Quiz | null> {
  try {
    const db = getSupabaseAdmin()
    const { data } = await db
      .from('quizzes')
      .select('id, owner_token, title, creator_name, questions, created_at')
      .eq('id', id)
      .single()
    return (data as Quiz) ?? null
  } catch {
    return null
  }
}

// User-generated: NEVER indexed. noindex,follow via HTML meta here + X-Robots-Tag
// header in middleware. Not in the sitemap. Canonical points at the indexable hub.
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const quiz = await fetchQuiz(params.id)
  const base = `${SITE}/tools/quiz`
  if (!quiz) {
    return { title: 'Quiz not found', robots: { index: false, follow: true }, alternates: { canonical: base } }
  }
  const title = `${quiz.title} — take the quiz`
  const desc = `${quiz.creator_name} made a quiz: how well do you know them? ${quiz.questions.length} questions — take it and find out.`
  const cardImg = `${SITE}/tools/quiz/${quiz.id}/card`
  return {
    title,
    description: desc,
    robots: { index: false, follow: true },
    alternates: { canonical: base },
    openGraph: {
      title: quiz.title,
      description: desc,
      url: `${SITE}/tools/quiz/${quiz.id}`,
      type: 'website',
      images: [{ url: cardImg, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: quiz.title, description: desc, images: [cardImg] },
  }
}

export default async function TakeQuizPage({ params }: { params: { id: string } }) {
  const quiz = await fetchQuiz(params.id)
  if (!quiz) notFound()

  const publicQuiz = toPublicQuiz(quiz)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />
      <main className="flex-1">
        <section className="max-w-2xl mx-auto px-6 pt-14 pb-6 text-center">
          <nav className="text-xs text-rose-400 mb-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/tools/quiz" className="hover:text-rose-600 transition-colors">Quiz</Link>
          </nav>
          <div className="text-5xl mb-4">💌</div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-rose-900 leading-tight">
            {quiz.title}
          </h1>
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-20">
          <TakeQuiz quiz={publicQuiz} />
        </section>
      </main>
      <Footer />
    </div>
  )
}
