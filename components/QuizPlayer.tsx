'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { AdminQuizQuestion, AdminQuizResult } from '@/lib/admin-quizzes'

// Generic player for admin-authored quizzes (/quizzes/[slug]). Each option
// maps to a result key; the key picked most often wins.

function track(event: string, params: Record<string, string>) {
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void }
    if (typeof w.gtag === 'function') w.gtag('event', event, params)
  } catch {
    /* analytics must never break the quiz */
  }
}

export default function QuizPlayer({
  slug,
  questions,
  results,
}: {
  slug: string
  questions: AdminQuizQuestion[]
  results: AdminQuizResult[]
}) {
  const [step, setStep] = useState(0)
  const [tally, setTally] = useState<Record<string, number>>({})
  const [winner, setWinner] = useState<AdminQuizResult | null>(null)

  const answer = (key: string) => {
    if (step === 0) track('quiz_started', { quiz: slug })
    const next = { ...tally, [key]: (tally[key] ?? 0) + 1 }
    setTally(next)
    if (step + 1 >= questions.length) {
      const topKey = Object.entries(next).sort((a, b) => b[1] - a[1])[0][0]
      const top = results.find(r => r.key === topKey) ?? results[0]
      setWinner(top)
      track('quiz_completed', { quiz: slug, result: top.key })
      // Fire-and-forget completion counter — no PII, just a number.
      fetch('/api/quizzes/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      }).catch(() => {})
    } else {
      setStep(step + 1)
    }
  }

  const reset = () => {
    setStep(0)
    setTally({})
    setWinner(null)
  }

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      {!winner ? (
        <>
          <div className="flex items-center justify-between text-xs text-rose-400 mb-4">
            <span>Question {step + 1} of {questions.length}</span>
            <div className="flex-1 mx-3 h-1.5 bg-rose-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all"
                style={{ width: `${(step / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <h3 className="font-serif text-xl text-rose-900 mb-5">{questions[step].question}</h3>
          <div className="space-y-2.5">
            {questions[step].options.map((o, i) => (
              <button
                key={i}
                onClick={() => answer(o.result)}
                className="w-full text-left px-4 py-3 rounded-xl border border-rose-200 text-rose-800 hover:bg-rose-50 hover:border-rose-300 transition-colors"
              >
                {o.text}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          {winner.emoji && <div className="text-5xl mb-3">{winner.emoji}</div>}
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Your result</p>
          <h3 className="font-serif text-3xl font-bold text-rose-900 mt-1 mb-3">{winner.title}</h3>
          <p className="text-sm text-rose-700/70 max-w-md mx-auto">{winner.description}</p>

          <Link
            href={winner.link_href || '/write'}
            className="mt-6 inline-block bg-rose-600 text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-sm"
          >
            {winner.link_label || 'Write them a real letter 💌'}
          </Link>

          <div>
            <button onClick={reset} className="mt-5 text-sm text-rose-600 underline hover:text-rose-800">
              Take the quiz again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
