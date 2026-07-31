'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSavedQuizzes, type SavedQuiz } from './quizStore'

// Shown on the /tools/quiz hub: the quizzes this device has created, with their
// private scoreboard links. Renders nothing if there are none.
export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([])

  useEffect(() => {
    setQuizzes(getSavedQuizzes())
  }, [])

  if (quizzes.length === 0) return null

  return (
    <section className="max-w-2xl mx-auto px-6 pb-14">
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6">
        <h2 className="font-serif text-xl font-bold text-rose-900 mb-1">Your quizzes</h2>
        <p className="text-xs text-rose-400 mb-4">Saved on this device — the scoreboard link is private to you.</p>
        <ul className="space-y-3">
          {quizzes.map(q => (
            <li key={q.id} className="flex items-center justify-between gap-3 border-t border-rose-50 pt-3 first:border-t-0 first:pt-0">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-rose-900 truncate">{q.title}</p>
                <p className="text-xs text-rose-400">
                  {new Date(q.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/tools/quiz/${q.id}`}
                  className="text-xs bg-white border border-rose-200 text-rose-700 px-3 py-1.5 rounded-full hover:bg-rose-50 transition-colors"
                >
                  Share
                </Link>
                <a
                  href={q.ownerUrl}
                  className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded-full hover:bg-rose-700 transition-colors"
                >
                  Scoreboard →
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
