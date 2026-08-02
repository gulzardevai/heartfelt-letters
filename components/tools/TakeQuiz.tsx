'use client'
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { QUIZ_LIMITS, type PublicQuiz } from '@/lib/quiz'

// UGC "how well do you know me?" player. Same delight language as the admin
// QuizPlayer: intro → one question at a time (slide transitions) → sealing
// beat while the attempt is scored server-side → confetti score reveal.

type Result = { score: number; total: number; creatorName: string }
type Phase = 'intro' | 'question' | 'sealing' | 'result'

function track(event: string, params: Record<string, string | number>) {
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void }
    if (typeof w.gtag === 'function') w.gtag('event', event, params)
  } catch {
    /* analytics must never break the quiz */
  }
}

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

const MICROCOPY = [
  'Trust your gut 💗',
  'Interesting choice 👀',
  'They would be impressed…',
  'Ooh, bold answer 📝',
  'This is getting good…',
  'Almost there…',
]

const SPARKLES = [
  { char: '💗', top: '8%', left: '6%', size: 14, delay: '0s' },
  { char: '✨', top: '18%', left: '88%', size: 12, delay: '1.4s' },
  { char: '💌', top: '70%', left: '4%', size: 13, delay: '2.8s' },
  { char: '✨', top: '80%', left: '90%', size: 11, delay: '0.9s' },
  { char: '💗', top: '45%', left: '94%', size: 12, delay: '3.6s' },
]

const CONFETTI_COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#f5c26b', '#e8b04b', '#fecdd3']

// Playful tier copy by score percentage.
function tier(pct: number, creator: string): { title: string; note: string } {
  if (pct === 100)
    return {
      title: 'Perfect score 💘',
      note: `Flawless. ${creator} has no secrets from you — you two share one brain (and probably one playlist).`,
    }
  if (pct >= 71)
    return {
      title: `You really know ${creator} 💕`,
      note: `So close to perfect. ${creator} would be genuinely touched — the little things you missed are just an excuse to talk more.`,
    }
  if (pct >= 41)
    return {
      title: 'Pretty good… but there is more to learn 👀',
      note: `You know the highlights, not yet the fine print. Sounds like ${creator} owes you a long coffee and some stories.`,
    }
  return {
    title: 'Well, this is awkward 😅',
    note: `Do not panic — ${creator} is clearly full of surprises. Consider this quiz your official invitation to get to know them properly.`,
  }
}

export default function TakeQuiz({ quiz }: { quiz: PublicQuiz }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailHint, setEmailHint] = useState(false)
  const [phase, setPhase] = useState<Phase>('intro')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(quiz.questions.length).fill(-1))
  const [picked, setPicked] = useState<number | null>(null)
  const [leaving, setLeaving] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [copied, setCopied] = useState(false)

  const total = quiz.questions.length
  const progress = phase === 'question' ? step / total : 1
  const quizUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : ''

  const start = () => {
    if (!name.trim()) return toast.error('Enter your name to begin.')
    // Email is optional: only stop for something that is clearly not an email.
    const em = email.trim()
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) {
      setEmailHint(true)
      return
    }
    setPhase('question')
  }

  const submit = async (finalAnswers: number[]) => {
    setPhase('sealing')
    try {
      const res = await fetch(`/api/quiz/${quiz.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taker_name: name, email: email.trim() || undefined, answers: finalAnswers }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not save your answers.')
        setPhase('question')
        return
      }
      const pct = data.total ? Math.round((data.score / data.total) * 100) : 0
      track('ugc_quiz_completed', { quiz: quiz.id, score_pct: pct })
      const reveal = () => {
        setResult({ score: data.score, total: data.total, creatorName: data.creator_name })
        setPhase('result')
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      // Hold the sealing beat a moment so it reads as intentional, not a spinner.
      if (prefersReducedMotion()) reveal()
      else setTimeout(reveal, 900)
    } catch {
      toast.error('Something went wrong. Please try again.')
      setPhase('question')
    }
  }

  const answer = (oi: number) => {
    if (picked !== null) return
    const next = answers.map((v, i) => (i === step ? oi : v))
    setAnswers(next)
    setPicked(oi)

    const isLast = step + 1 >= total
    const reduced = prefersReducedMotion()

    setTimeout(() => {
      if (isLast) {
        setPicked(null)
        submit(next)
        return
      }
      setLeaving(true)
      setTimeout(() => {
        setStep(s => s + 1)
        setPicked(null)
        setLeaving(false)
      }, reduced ? 0 : 250)
    }, reduced ? 0 : 350)
  }

  const shareText = result
    ? `I scored ${result.score}/${result.total} on ${result.creatorName}'s quiz — beat me: ${quizUrl}`
    : quizUrl

  const share = (channel: string) => track('ugc_quiz_shared', { quiz: quiz.id, channel })

  const copyLink = async () => {
    share('copy')
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  }

  // ===== Result — confetti score reveal =====
  if (phase === 'result' && result) {
    const pct = result.total ? Math.round((result.score / result.total) * 100) : 0
    const band = tier(pct, result.creatorName)
    return (
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
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

        <div
          className="qz-result-reveal text-center rounded-2xl border border-rose-100 shadow-paper px-6 py-8 sm:px-10"
          style={{ background: '#fdf8f0' }}
        >
          <div className="qz-result-emoji text-6xl mb-3" aria-hidden="true">💞</div>
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide">
            How well {name.trim()} knows {result.creatorName}
          </p>
          <div className="font-serif text-6xl font-bold text-rose-600 mt-2 mb-2">
            {result.score}/{result.total}
          </div>
          <p className="font-serif text-xl font-bold text-rose-900 mb-2">{band.title}</p>
          <p className="text-sm text-rose-700/70 max-w-md mx-auto leading-relaxed mb-7">{band.note}</p>

          <p className="text-sm text-rose-700/80 font-medium mb-3">
            Know them that well? They deserve a letter 💌
          </p>
          <Link
            href="/write?type=love"
            className="inline-block bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Write {result.creatorName} a real letter →
          </Link>
          <p className="text-xs text-rose-400 mt-3">Free, private and encrypted — no account needed.</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => share('whatsapp')}
              className="px-4 py-2 rounded-full border border-rose-200 bg-white text-rose-700 text-xs font-semibold hover:bg-rose-50 transition-colors"
            >
              Share on WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => share('x')}
              className="px-4 py-2 rounded-full border border-rose-200 bg-white text-rose-700 text-xs font-semibold hover:bg-rose-50 transition-colors"
            >
              Share on X
            </a>
            <button
              onClick={copyLink}
              className="px-4 py-2 rounded-full border border-rose-200 bg-white text-rose-700 text-xs font-semibold hover:bg-rose-50 transition-colors"
            >
              {copied ? 'Copied! ✓' : 'Copy link'}
            </button>
          </div>

          <div className="border-t border-rose-100 mt-7 pt-6">
            <p className="text-sm text-rose-700/70 mb-3">Think your friends know you better?</p>
            <Link
              href="/tools/quiz/create"
              className="inline-block bg-white border border-rose-200 text-rose-700 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-rose-50 transition-colors"
            >
              Make your own quiz
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 overflow-hidden">
      {/* Intro */}
      {phase === 'intro' && (
        <div className="relative text-center py-4">
          {SPARKLES.map((s, i) => (
            <span
              key={i}
              className="qz-bg-sparkle"
              style={{ top: s.top, left: s.left, fontSize: s.size, animationDelay: s.delay }}
              aria-hidden="true"
            >
              {s.char}
            </span>
          ))}
          <div className="qz-float-emoji text-6xl mb-5" aria-hidden="true">🧠💘</div>
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-2">
            How well do you know {quiz.creator_name}?
          </h2>
          <p className="text-sm text-rose-700/70 mb-6 max-w-sm mx-auto">
            {quiz.creator_name} made this quiz about themselves — think you know them? {total} quick questions.
          </p>
          <input
            value={name}
            onChange={e => setName(e.target.value.slice(0, QUIZ_LIMITS.takerName))}
            onKeyDown={e => e.key === 'Enter' && start()}
            placeholder="Your name"
            className="w-full max-w-xs mx-auto block rounded-xl border border-rose-200 px-4 py-2.5 text-base text-center mb-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              if (emailHint) setEmailHint(false)
            }}
            onKeyDown={e => e.key === 'Enter' && start()}
            placeholder={`So ${quiz.creator_name} can reach you 💌`}
            aria-label="Email (optional)"
            className={`w-full max-w-xs mx-auto block rounded-xl border px-4 py-2.5 text-base text-center mb-1 focus:outline-none focus:ring-2 focus:ring-rose-300 ${
              emailHint ? 'border-rose-400' : 'border-rose-200'
            }`}
          />
          <p className={`text-[11px] mb-2 ${emailHint ? 'text-rose-500' : 'text-rose-400'}`}>
            {emailHint ? 'That does not look like an email — fix it or leave it blank 💗' : 'Email (optional)'}
          </p>
          <p className="text-[11px] text-rose-400 mb-6">
            Your name and score are shared with {quiz.creator_name} (the quiz creator).
          </p>
          <button
            onClick={start}
            className="cta-heartbeat inline-block bg-rose-600 text-white px-10 py-4 rounded-full font-semibold text-base hover:bg-rose-700 transition-colors shadow-md"
          >
            Start the quiz →
          </button>
        </div>
      )}

      {/* Questions — one at a time */}
      {phase === 'question' && (
        <>
          {/* Journey progress bar: envelope travels the rose track */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-rose-400 mb-2">
              <span>Question {step + 1} of {total}</span>
            </div>
            <div className="relative h-6">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-rose-100 rounded-full overflow-hidden">
                <div
                  className="qz-track-fill h-full bg-gradient-to-r from-rose-300 to-rose-500 rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span
                className="qz-track-envelope absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-base"
                style={{ left: `${4 + progress * 92}%` }}
                aria-hidden="true"
              >
                💌
              </span>
            </div>
          </div>
          <p className="text-xs text-rose-400/80 italic mb-4 min-h-[1rem]">
            {step > 0 ? MICROCOPY[(step - 1) % MICROCOPY.length] : ' '}
          </p>

          <div key={step} className={leaving ? 'qz-slide-out' : 'qz-slide-in'}>
            {quiz.questions[step].emoji && (
              <div className="qz-float-emoji text-5xl text-center mb-3" aria-hidden="true">
                {quiz.questions[step].emoji}
              </div>
            )}
            <h3 className="font-serif text-xl text-rose-900 mb-5 break-words">{quiz.questions[step].q}</h3>
            <div className="space-y-3">
              {quiz.questions[step].options.map((o, oi) => (
                <button
                  key={oi}
                  type="button"
                  onClick={() => answer(oi)}
                  disabled={picked !== null}
                  className={`qz-option relative w-full min-h-[44px] text-left px-5 py-4 rounded-2xl border text-rose-800 break-words ${
                    picked === oi
                      ? 'qz-picked bg-rose-50 border-rose-400'
                      : 'border-rose-200 bg-white hover:bg-rose-50 hover:border-rose-300'
                  }`}
                >
                  {o}
                  {picked === oi && (
                    <>
                      <span className="qz-burst-heart" style={{ left: '30%', animationDelay: '0s' }} aria-hidden="true">💗</span>
                      <span className="qz-burst-heart" style={{ left: '55%', animationDelay: '0.08s' }} aria-hidden="true">💕</span>
                      <span className="qz-burst-heart" style={{ left: '75%', animationDelay: '0.15s' }} aria-hidden="true">💗</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Sealing beat while the server scores the attempt */}
      {phase === 'sealing' && (
        <div className="text-center py-14">
          <div className="qz-seal-wiggle text-5xl mb-4" aria-hidden="true">💌</div>
          <p className="font-serif text-lg text-rose-800">Sealing your answers…</p>
        </div>
      )}
    </div>
  )
}
