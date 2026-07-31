'use client'
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { QUIZ_LIMITS, scoreBand, type PublicQuiz } from '@/lib/quiz'

type Result = { score: number; total: number; creatorName: string }

export default function TakeQuiz({ quiz }: { quiz: PublicQuiz }) {
  const [name, setName] = useState('')
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<number[]>(Array(quiz.questions.length).fill(-1))
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  const setAnswer = (qi: number, oi: number) =>
    setAnswers(a => a.map((v, i) => (i === qi ? oi : v)))

  const start = () => {
    if (!name.trim()) return toast.error('Enter your name to begin.')
    setStarted(true)
  }

  const submit = async () => {
    if (answers.some(a => a < 0)) return toast.error('Answer every question first.')
    setSubmitting(true)
    try {
      const res = await fetch(`/api/quiz/${quiz.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taker_name: name, answers }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not save your answers.')
        return
      }
      setResult({ score: data.score, total: data.total, creatorName: data.creator_name })
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    const pct = result.total ? Math.round((result.score / result.total) * 100) : 0
    const band = scoreBand(pct)
    return (
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 text-center">
        <div className="text-4xl mb-3">💞</div>
        <p className="text-sm text-rose-400 uppercase tracking-wide mb-2">How well {name.trim()} knows {result.creatorName}</p>
        <div className="font-serif text-5xl font-bold text-rose-600 mb-1">{result.score}/{result.total}</div>
        <p className="text-rose-900 font-semibold mb-1">{pct}% — {band.label}</p>
        <p className="text-sm text-rose-700/70 max-w-sm mx-auto mb-7">{band.note}</p>

        <Link
          href="/write?type=love"
          className="inline-block bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
        >
          Write {result.creatorName} a real letter →
        </Link>
        <p className="text-xs text-rose-400 mt-3">Free, private and encrypted — no account needed.</p>

        <div className="border-t border-rose-50 mt-7 pt-6">
          <p className="text-sm text-rose-700/70 mb-3">Think your friends know you better?</p>
          <Link
            href="/tools/quiz/create"
            className="inline-block bg-white border border-rose-200 text-rose-700 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-rose-50 transition-colors"
          >
            Make your own quiz
          </Link>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 text-center">
        <div className="text-4xl mb-3">🧠💘</div>
        <h2 className="font-serif text-2xl font-bold text-rose-900 mb-2">
          How well do you know {quiz.creator_name}?
        </h2>
        <p className="text-sm text-rose-700/70 mb-6">
          {quiz.questions.length} quick questions. Enter your name, then see how well you really know them.
        </p>
        <input
          value={name}
          onChange={e => setName(e.target.value.slice(0, QUIZ_LIMITS.takerName))}
          onKeyDown={e => e.key === 'Enter' && start()}
          placeholder="Your name"
          className="w-full max-w-xs mx-auto block rounded-xl border border-rose-200 px-4 py-2.5 text-sm text-center mb-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <p className="text-[11px] text-rose-400 mb-5">Your name and score are shared with {quiz.creator_name} (the quiz creator).</p>
        <button
          onClick={start}
          className="inline-block bg-rose-600 text-white px-10 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
        >
          Start the quiz →
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {quiz.questions.map((q, qi) => (
        <div key={qi} className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6">
          <p className="text-sm font-semibold text-rose-900 mb-4">
            <span className="text-rose-400">{qi + 1}.</span> {q.q}
          </p>
          <div className="space-y-2">
            {q.options.map((o, oi) => (
              <button
                key={oi}
                type="button"
                onClick={() => setAnswer(qi, oi)}
                className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                  answers[qi] === oi
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'bg-white border-rose-200 text-rose-800 hover:bg-rose-50'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center pt-1">
        <button
          onClick={submit}
          disabled={submitting}
          className="inline-block bg-rose-600 text-white px-10 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md disabled:opacity-50"
        >
          {submitting ? 'Scoring…' : 'See my score →'}
        </button>
      </div>
    </div>
  )
}
