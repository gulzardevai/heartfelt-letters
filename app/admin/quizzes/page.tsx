import Link from 'next/link'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import AdminQuizzesTable from '@/components/AdminQuizzesTable'

export const dynamic = 'force-dynamic'

export default async function AdminQuizzesPage() {
  const db = getSupabaseAdmin()
  const { data: quizzes } = await db
    .from('admin_quizzes')
    .select('id, slug, title, published, questions, view_count, completed_count, created_at')
    .order('created_at', { ascending: false })

  // UGC quiz-maker stats (the "how well do you know me?" quizzes users build)
  const [{ count: ugcQuizzes }, { count: ugcAttempts }] = await Promise.all([
    db.from('quizzes').select('*', { count: 'exact', head: true }),
    db.from('quiz_attempts').select('*', { count: 'exact', head: true }),
  ])

  const rows = (quizzes ?? []).map(q => ({
    id: q.id as string,
    slug: q.slug as string,
    title: q.title as string,
    published: q.published as boolean,
    question_count: Array.isArray(q.questions) ? q.questions.length : 0,
    view_count: (q.view_count as number) ?? 0,
    completed_count: (q.completed_count as number) ?? 0,
    created_at: q.created_at as string,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {rows.length} total · {rows.filter(r => r.published).length} published · {rows.filter(r => !r.published).length} drafts
          </p>
        </div>
        <Link
          href="/admin/quizzes/new"
          className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
        >
          + New Quiz
        </Link>
      </div>

      <AdminQuizzesTable quizzes={rows} />

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">User-made &ldquo;how well do you know me?&rdquo; quizzes</h2>
        <p className="text-sm text-gray-500">
          {(ugcQuizzes ?? 0).toLocaleString()} quizzes created · {(ugcAttempts ?? 0).toLocaleString()} attempts taken
          <span className="text-gray-400"> — built by visitors at /tools/quiz (managed separately)</span>
        </p>
      </div>
    </div>
  )
}
