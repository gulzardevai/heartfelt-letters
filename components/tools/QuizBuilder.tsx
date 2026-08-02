'use client'
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { QUIZ_LIMITS, shareLink, scoreboardLink } from '@/lib/quiz'
import { saveQuiz } from './quizStore'

type Q = { q: string; options: string[]; correct: number }

function track(event: string, params: Record<string, string> = {}) {
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void }
    if (typeof w.gtag === 'function') w.gtag('event', event, params)
  } catch {
    /* analytics must never break the builder */
  }
}

const CONFETTI_COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#f5c26b', '#e8b04b', '#fecdd3']

function blankQuestion(): Q {
  return { q: '', options: ['', ''], correct: 0 }
}

type Created = { id: string; ownerToken: string; title: string; creatorName: string }

export default function QuizBuilder() {
  const [creatorName, setCreatorName] = useState('')
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState<Q[]>([blankQuestion(), blankQuestion(), blankQuestion()])
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState<Created | null>(null)

  const setQ = (i: number, patch: Partial<Q>) =>
    setQuestions(qs => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)))

  const setOption = (qi: number, oi: number, value: string) =>
    setQuestions(qs =>
      qs.map((q, idx) =>
        idx === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? value : o)) } : q
      )
    )

  const addQuestion = () =>
    setQuestions(qs => (qs.length >= QUIZ_LIMITS.maxQuestions ? qs : [...qs, blankQuestion()]))

  const removeQuestion = (i: number) =>
    setQuestions(qs => (qs.length <= QUIZ_LIMITS.minQuestions ? qs : qs.filter((_, idx) => idx !== i)))

  const addOption = (qi: number) =>
    setQuestions(qs =>
      qs.map((q, idx) =>
        idx === qi && q.options.length < QUIZ_LIMITS.maxOptions
          ? { ...q, options: [...q.options, ''] }
          : q
      )
    )

  const removeOption = (qi: number, oi: number) =>
    setQuestions(qs =>
      qs.map((q, idx) => {
        if (idx !== qi || q.options.length <= QUIZ_LIMITS.minOptions) return q
        const options = q.options.filter((_, j) => j !== oi)
        const correct = q.correct >= options.length ? options.length - 1 : q.correct
        return { ...q, options, correct }
      })
    )

  const submit = async () => {
    if (!creatorName.trim()) return toast.error('Add your name first.')
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].q.trim()) return toast.error(`Question ${i + 1} needs some text.`)
      const filled = questions[i].options.filter(o => o.trim())
      if (filled.length < QUIZ_LIMITS.minOptions)
        return toast.error(`Question ${i + 1} needs at least ${QUIZ_LIMITS.minOptions} answers.`)
      if (!questions[i].options[questions[i].correct]?.trim())
        return toast.error(`Fill in the correct answer you marked for question ${i + 1}.`)
    }

    setSaving(true)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          creator_name: creatorName,
          questions: questions.map(q => ({
            q: q.q,
            options: q.options.filter(o => o.trim()),
            correct_index: q.correct,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not create the quiz.')
        return
      }
      const finalTitle = title.trim() || `How well do you know ${creatorName.trim()}?`
      saveQuiz({
        id: data.id,
        title: finalTitle,
        creatorName: creatorName.trim(),
        shareUrl: shareLink(data.id),
        ownerUrl: scoreboardLink(data.id, data.owner_token),
        createdAt: new Date().toISOString(),
      })
      track('ugc_quiz_created')
      setCreated({ id: data.id, ownerToken: data.owner_token, title: finalTitle, creatorName: creatorName.trim() })
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (created) {
    return <CreatedScreen created={created} />
  }

  return (
    <div className="space-y-6">
      {/* About you */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-rose-900 mb-1.5">Your name</label>
          <input
            value={creatorName}
            onChange={e => setCreatorName(e.target.value.slice(0, QUIZ_LIMITS.creatorName))}
            placeholder="e.g. Sara"
            className="w-full rounded-xl border border-rose-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <p className="text-xs text-rose-400 mt-1.5">The quiz is about you — this is who friends will be tested on.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-rose-900 mb-1.5">
            Quiz title <span className="font-normal text-rose-400">(optional)</span>
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value.slice(0, QUIZ_LIMITS.title))}
            placeholder={creatorName ? `How well do you know ${creatorName}?` : 'How well do you know me?'}
            className="w-full rounded-xl border border-rose-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, qi) => (
        <div key={qi} className="qz-row-in bg-white rounded-3xl border border-rose-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-rose-900">Question {qi + 1}</span>
            {questions.length > QUIZ_LIMITS.minQuestions && (
              <button
                onClick={() => removeQuestion(qi)}
                className="text-xs text-rose-400 hover:text-rose-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <input
            value={q.q}
            onChange={e => setQ(qi, { q: e.target.value.slice(0, QUIZ_LIMITS.question) })}
            placeholder="e.g. What's my go-to comfort food?"
            className="w-full rounded-xl border border-rose-200 px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <p className="text-xs text-rose-400 mb-2">Tap the circle to mark the correct answer (your answer).</p>
          <div className="space-y-2">
            {q.options.map((o, oi) => (
              <div key={oi} className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setQ(qi, { correct: oi })}
                  aria-label="Mark as correct answer"
                  className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                    q.correct === oi ? 'bg-rose-600 border-rose-600 text-white' : 'border-rose-300 text-transparent hover:border-rose-400'
                  }`}
                >
                  ✓
                </button>
                <input
                  value={o}
                  onChange={e => setOption(qi, oi, e.target.value.slice(0, QUIZ_LIMITS.option))}
                  placeholder={`Answer ${oi + 1}`}
                  className="flex-1 rounded-xl border border-rose-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                {q.options.length > QUIZ_LIMITS.minOptions && (
                  <button
                    onClick={() => removeOption(qi, oi)}
                    aria-label="Remove option"
                    className="text-rose-300 hover:text-rose-500 transition-colors text-lg leading-none px-1"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          {q.options.length < QUIZ_LIMITS.maxOptions && (
            <button
              onClick={() => addOption(qi)}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium mt-3 transition-colors"
            >
              + Add answer option
            </button>
          )}
        </div>
      ))}

      {questions.length < QUIZ_LIMITS.maxQuestions && (
        <button
          onClick={addQuestion}
          className="w-full bg-white border border-dashed border-rose-300 text-rose-600 rounded-2xl py-3.5 text-sm font-semibold hover:bg-rose-50 transition-colors"
        >
          + Add question ({questions.length}/{QUIZ_LIMITS.maxQuestions})
        </button>
      )}

      <div className="text-center pt-2">
        <button
          onClick={submit}
          disabled={saving}
          className="cta-heartbeat inline-block bg-rose-600 text-white px-10 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md disabled:opacity-50"
        >
          {saving ? 'Sealing your quiz… 💌' : 'Create my quiz →'}
        </button>
        <p className="text-xs text-rose-400 mt-3">
          Free, no account. You will get a share link and a private scoreboard.
        </p>
      </div>
    </div>
  )
}

function CreatedScreen({ created }: { created: Created }) {
  const share = shareLink(created.id)
  const owner = scoreboardLink(created.id, created.ownerToken)

  const copy = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(msg)
    } catch {
      toast.error('Could not copy.')
    }
  }

  const nativeShare = async () => {
    track('ugc_quiz_shared', { channel: 'native' })
    const text = `${created.title} — take my quiz and see how well you really know me 💌`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: created.title, text, url: share })
      } catch {
        /* dismissed */
      }
    } else {
      copy(share, 'Share link copied — send it to your friends')
    }
  }

  return (
    <div className="relative space-y-6">
      {/* One-shot CSS confetti over the reveal */}
      <div className="absolute inset-x-0 top-0 h-64 overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="qz-confetti"
            style={{
              left: `${(i * 53) % 100}%`,
              backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animationDelay: `${(i % 6) * 0.12}s`,
              animationDuration: `${1.5 + (i % 4) * 0.25}s`,
            }}
          />
        ))}
      </div>

      <div className="qz-result-reveal bg-white rounded-3xl border border-rose-100 shadow-paper p-8 text-center">
        <div className="qz-result-emoji text-5xl mb-3" aria-hidden="true">💌</div>
        <h2 className="font-serif text-2xl font-bold text-rose-900 mb-2">Your quiz is sealed 💌 — share it</h2>
        <p className="text-sm text-rose-700/70 mb-6">Send the link like a little gift. Watch the scores roll in on your private scoreboard.</p>

        {/* Share link */}
        <div className="text-left">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide mb-2">Share this with friends</p>
          <div className="flex items-center gap-2 mb-3">
            <input
              readOnly
              value={share}
              onFocus={e => e.target.select()}
              className="flex-1 rounded-xl border border-rose-200 px-3.5 py-2.5 text-sm text-rose-700 bg-rose-50/40 min-w-0"
            />
            <button
              onClick={() => {
                track('ugc_quiz_shared', { channel: 'copy' })
                copy(share, 'Share link copied')
              }}
              className="shrink-0 bg-white border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-50 transition-colors"
            >
              Copy
            </button>
          </div>
          <button
            onClick={nativeShare}
            className="cta-heartbeat w-full bg-rose-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-rose-700 transition-colors shadow-sm mb-6"
          >
            Share my quiz 💞
          </button>
        </div>

        {/* Owner / scoreboard link */}
        <div className="text-left border-t border-rose-50 pt-6">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide mb-2">Your private scoreboard</p>
          <p className="text-xs text-rose-700/70 mb-2">
            Keep this link safe — it is the <strong>only</strong> way to see who took your quiz and how they scored. We have
            saved it on this device, but bookmark it too.
          </p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={owner}
              onFocus={e => e.target.select()}
              className="flex-1 rounded-xl border border-rose-200 px-3.5 py-2.5 text-sm text-rose-700 bg-rose-50/40 min-w-0"
            />
            <button
              onClick={() => copy(owner, 'Scoreboard link copied — keep it safe')}
              className="shrink-0 bg-white border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-50 transition-colors"
            >
              Copy
            </button>
          </div>
          <a
            href={owner}
            className="inline-block mt-4 text-sm text-rose-600 underline hover:text-rose-800 font-medium"
          >
            Open my scoreboard →
          </a>
        </div>
      </div>

      <div className="text-center">
        <Link href="/tools/quiz" className="text-sm text-rose-400 hover:text-rose-600 transition-colors">
          ← Back to quizzes
        </Link>
      </div>
    </div>
  )
}
