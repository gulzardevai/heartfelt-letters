'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type QuizRow = {
  id: string
  slug: string
  title: string
  published: boolean
  question_count: number
  view_count: number
  completed_count: number
  created_at: string
}

export default function AdminQuizzesTable({ quizzes }: { quizzes: QuizRow[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)

  async function togglePublished(quiz: QuizRow) {
    setBusy(quiz.id)
    try {
      const res = await fetch(`/api/admin/quizzes/${quiz.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !quiz.published }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        alert(j.error || 'Failed to update quiz')
      }
      router.refresh()
    } finally {
      setBusy(null)
    }
  }

  async function deleteQuiz(quiz: QuizRow) {
    if (!confirm(`Delete "${quiz.title}"? This cannot be undone.`)) return
    setBusy(quiz.id)
    try {
      const res = await fetch(`/api/admin/quizzes/${quiz.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        alert(j.error || 'Failed to delete quiz')
      }
      router.refresh()
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {!quizzes.length ? (
        <div className="text-center py-16 text-gray-400">No quizzes yet.</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Quiz</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Questions</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Views</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Completions</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Created</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quizzes.map(quiz => (
              <tr key={quiz.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{quiz.title}</div>
                  <div className="text-gray-400 text-xs mt-0.5">/quizzes/{quiz.slug}</div>
                </td>
                <td className="px-6 py-4 text-gray-500">{quiz.question_count}</td>
                <td className="px-6 py-4 text-gray-500">👁 {quiz.view_count.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-500">✅ {quiz.completed_count.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    quiz.published ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${quiz.published ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    {quiz.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                  {new Date(quiz.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                    <button
                      onClick={() => togglePublished(quiz)}
                      disabled={busy === quiz.id}
                      className="text-gray-500 hover:text-gray-800 text-xs disabled:opacity-50"
                    >
                      {quiz.published ? 'Unpublish' : 'Publish'}
                    </button>
                    {quiz.published && (
                      <Link href={`/quizzes/${quiz.slug}`} target="_blank" className="text-gray-400 hover:text-gray-700 text-xs">
                        View ↗
                      </Link>
                    )}
                    <Link href={`/admin/quizzes/${quiz.id}/attempts`} className="text-gray-500 hover:text-gray-800 text-xs">
                      Attempts
                    </Link>
                    <Link href={`/admin/quizzes/${quiz.id}`} className="text-rose-600 hover:text-rose-800 text-xs font-medium">
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteQuiz(quiz)}
                      disabled={busy === quiz.id}
                      className="text-red-500 hover:text-red-700 text-xs disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
