import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// Lead-capture attempts for an admin quiz: who took it, their result, and when.
export default async function QuizAttemptsPage({ params }: { params: { id: string } }) {
  const db = getSupabaseAdmin()
  const { data: quiz } = await db
    .from('admin_quizzes')
    .select('id, slug, title')
    .eq('id', params.id)
    .single()
  if (!quiz) notFound()

  const { data: attempts } = await db
    .from('admin_quiz_attempts')
    .select('id, name, email, result_key, created_at')
    .eq('quiz_id', quiz.id)
    .order('created_at', { ascending: false })
    .limit(500)

  const rows = attempts ?? []
  const dist: Record<string, number> = {}
  for (const a of rows) dist[a.result_key] = (dist[a.result_key] ?? 0) + 1
  const summary = Object.entries(dist)
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => `${k} ${n}`)
    .join(' · ')

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/quizzes" className="text-sm text-gray-400 hover:text-gray-600">
          ← Back to quizzes
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Attempts — {quiz.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {rows.length} attempt{rows.length === 1 ? '' : 's'}
          {summary && <span className="text-gray-400"> · {summary}</span>}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {!rows.length ? (
          <div className="text-center py-16 text-gray-400">No attempts yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Result</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{a.name}</td>
                  <td className="px-6 py-4">
                    {a.email ? (
                      <a href={`mailto:${a.email}`} className="text-rose-600 hover:text-rose-800">
                        {a.email}
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{a.result_key}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(a.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
