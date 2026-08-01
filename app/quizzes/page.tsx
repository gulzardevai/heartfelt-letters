import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Love & Relationship Quizzes — Free, No Sign-Up',
  description:
    'Free love and relationship quizzes: answer a few quick questions, get your result instantly, then turn the moment into a real letter. No account needed.',
  alternates: { canonical: 'https://www.shareloveletters.com/quizzes' },
}

export default async function QuizzesHubPage() {
  const db = getSupabaseAdmin()
  const { data: quizzes } = await db
    .from('admin_quizzes')
    .select('slug, title, description, questions')
    .eq('published', true)
    .order('created_at', { ascending: false })

  // No published quizzes yet — send visitors to the tools hub instead of a thin page.
  if (!quizzes?.length) redirect('/tools')

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pt-14 pb-16">
        <div className="text-center mb-10">
          <div className="text-5xl mb-5">💞</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-4">Love quizzes</h1>
          <p className="text-rose-700/70 leading-relaxed">
            Quick, free quizzes about love and relationships. Answer a few questions, get your result instantly — no account, nothing saved.
          </p>
        </div>

        <div className="space-y-4">
          {quizzes.map(q => (
            <Link
              key={q.slug}
              href={`/quizzes/${q.slug}`}
              className="block bg-white rounded-2xl border border-rose-100 p-6 shadow-sm hover:border-rose-300 transition-colors"
            >
              <h2 className="font-serif text-xl font-bold text-rose-900 mb-1.5">{q.title}</h2>
              <p className="text-sm text-rose-700/70 leading-relaxed">{q.description}</p>
              <p className="text-xs text-rose-400 mt-3">
                {Array.isArray(q.questions) ? q.questions.length : 0} questions · takes about a minute →
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/tools" className="text-sm bg-white border border-rose-100 text-rose-700 px-4 py-2 rounded-full hover:bg-rose-50 transition-colors">
            All love tools
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
