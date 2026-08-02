import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShareBar from '@/components/tools/ScoreboardShare'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { SITE, type Quiz, type QuizAttempt } from '@/lib/quiz'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Quiz scoreboard',
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE}/tools/quiz` },
}

async function fetchData(id: string): Promise<{ quiz: Quiz | null; attempts: QuizAttempt[] }> {
  try {
    const db = getSupabaseAdmin()
    const { data: quiz } = await db
      .from('quizzes')
      .select('id, owner_token, title, creator_name, questions, created_at')
      .eq('id', id)
      .single()
    if (!quiz) return { quiz: null, attempts: [] }
    const { data: attempts } = await db
      .from('quiz_attempts')
      .select('id, taker_name, email, score, total, created_at')
      .eq('quiz_id', id)
      .order('score', { ascending: false })
      .order('created_at', { ascending: true })
    return { quiz: quiz as Quiz, attempts: (attempts as QuizAttempt[]) ?? [] }
  } catch {
    return { quiz: null, attempts: [] }
  }
}

function Gate({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-md text-center">{children}</div>
      </main>
      <Footer />
    </div>
  )
}

export default async function ScoreboardPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { owner?: string }
}) {
  const { quiz, attempts } = await fetchData(params.id)

  if (!quiz) {
    return (
      <Gate>
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="font-serif text-2xl font-bold text-rose-900 mb-3">Quiz not found</h1>
        <p className="text-rose-700/70 mb-6">This quiz does not exist or has been removed.</p>
        <Link href="/tools/quiz" className="text-rose-600 underline hover:text-rose-800">Make your own quiz →</Link>
      </Gate>
    )
  }

  if (!searchParams.owner || searchParams.owner !== quiz.owner_token) {
    return (
      <Gate>
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="font-serif text-2xl font-bold text-rose-900 mb-3">This scoreboard is private</h1>
        <p className="text-rose-700/70 mb-6">
          Only the person who created this quiz can see the scoreboard, using their secret link. If this is your quiz, open it
          from the private scoreboard link you saved when you created it.
        </p>
        <Link href={`/tools/quiz/${quiz.id}`} className="inline-block bg-rose-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-rose-700 transition-colors mb-4">
          Take this quiz instead →
        </Link>
        <div>
          <Link href="/tools/quiz" className="text-sm text-rose-500 underline hover:text-rose-700">Make your own quiz</Link>
        </div>
      </Gate>
    )
  }

  const shareUrl = `${SITE}/tools/quiz/${quiz.id}`

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />
      <main className="flex-1">
        <section className="max-w-2xl mx-auto px-6 pt-14 pb-6 text-center">
          <nav className="text-xs text-rose-400 mb-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/tools/quiz" className="hover:text-rose-600 transition-colors">Quiz</Link>
            <span className="mx-2">›</span>
            <span className="text-rose-500">Scoreboard</span>
          </nav>
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-rose-900 mb-2 leading-tight">{quiz.title}</h1>
          <p className="text-rose-700/70">
            {attempts.length === 0
              ? 'No one has taken your quiz yet.'
              : `${attempts.length} ${attempts.length === 1 ? 'person has' : 'people have'} taken your quiz.`}
          </p>
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-8">
          <ShareBar shareUrl={shareUrl} title={quiz.title} />
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-16">
          {attempts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 text-center">
              <p className="text-rose-700/70 mb-4">Share your quiz link and scores will appear here, ranked highest first.</p>
              <Link href={`/tools/quiz/${quiz.id}`} className="text-rose-600 underline hover:text-rose-800 text-sm">Preview your quiz →</Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
              <ul>
                {attempts.map((a, i) => {
                  const pct = a.total ? Math.round((a.score / a.total) * 100) : 0
                  return (
                    <li
                      key={a.id}
                      className="qz-row-in flex items-center gap-4 px-6 py-4 border-t border-rose-50 first:border-t-0"
                      style={{ animationDelay: `${Math.min(i, 10) * 0.06}s` }}
                    >
                      <span className={`w-8 text-center font-serif font-bold shrink-0 ${i === 0 ? 'text-rose-600 text-lg' : 'text-rose-300'}`}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-rose-900 truncate">{a.taker_name}</p>
                        {a.email && (
                          <p className="text-xs text-rose-500/80 truncate">
                            <a href={`mailto:${a.email}`} className="hover:underline">{a.email}</a>
                          </p>
                        )}
                        <p className="text-xs text-rose-400">
                          {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-rose-700">{a.score}/{a.total}</p>
                        <p className="text-xs text-rose-400">{pct}%</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
          <Link href="/tools/quiz/create" className="text-sm text-rose-500 underline hover:text-rose-700">Make another quiz →</Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
