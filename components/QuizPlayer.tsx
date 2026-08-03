'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { AdminQuizQuestion, AdminQuizResult } from '@/lib/admin-quizzes'

// Generic player for admin-authored quizzes (/quizzes/[slug]). Each option
// maps to a result key; the key picked most often wins.
// Phases: intro → questions (slide transitions) → sealing beat → letter-style result.

function track(event: string, params: Record<string, string>) {
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
  'No wrong answers here 💗',
  'Interesting choice 👀',
  'Ooh, noted 📝',
  'You clearly know your heart',
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

type Phase = 'intro' | 'question' | 'sealing' | 'result'

// "Sara, you're a Die-Hard Fan!" — add an article unless the title already
// reads as a full phrase (starts with a/an/the/new/your/…).
function articleFor(title: string): string {
  const first = title.replace(/^[^a-zA-Z]+/, '').split(/\s+/)[0]?.toLowerCase() ?? ''
  if (['a', 'an', 'the', 'new', 'your', 'you', 'just', 'still'].includes(first)) return ''
  return /^[aeiou]/.test(first) ? 'an ' : 'a '
}

export default function QuizPlayer({
  slug,
  title,
  questions,
  results,
}: {
  slug: string
  title: string
  questions: AdminQuizQuestion[]
  results: AdminQuizResult[]
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailHint, setEmailHint] = useState(false)
  const [phase, setPhase] = useState<Phase>('intro')
  const [step, setStep] = useState(0)
  const [tally, setTally] = useState<Record<string, number>>({})
  const [winner, setWinner] = useState<AdminQuizResult | null>(null)
  const [picked, setPicked] = useState<number | null>(null)
  const [leaving, setLeaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const quizUrl = `https://www.shareloveletters.com/quizzes/${slug}`
  const progress = phase === 'question' ? step / questions.length : 1

  const start = () => {
    if (!name.trim()) return
    // Email is optional: only pause for something that is clearly not an email.
    const em = email.trim()
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) {
      setEmailHint(true)
      return
    }
    track('quiz_started', { quiz: slug })
    setPhase('question')
  }

  const finish = (finalTally: Record<string, number>) => {
    const topKey = Object.entries(finalTally).sort((a, b) => b[1] - a[1])[0][0]
    const top = results.find(r => r.key === topKey) ?? results[0]
    track('quiz_completed', { quiz: slug, result: top.key })
    // Fire-and-forget: bumps the completion counter and stores the attempt
    // (name + optional email) server-side. Never blocks the reveal.
    fetch('/api/quizzes/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, name: name.trim(), email: email.trim() || undefined, result_key: top.key }),
    }).catch(() => {})

    if (prefersReducedMotion()) {
      setWinner(top)
      setPhase('result')
      return
    }
    setPhase('sealing')
    setTimeout(() => {
      setWinner(top)
      setPhase('result')
    }, 1100)
  }

  const answer = (key: string, index: number) => {
    if (picked !== null) return
    const next = { ...tally, [key]: (tally[key] ?? 0) + 1 }
    setTally(next)
    setPicked(index)

    const isLast = step + 1 >= questions.length
    const reduced = prefersReducedMotion()

    setTimeout(() => {
      if (isLast) {
        setPicked(null)
        finish(next)
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

  const reset = () => {
    setStep(0)
    setTally({})
    setWinner(null)
    setPicked(null)
    setLeaving(false)
    setCopied(false)
    setPhase('intro')
  }

  const shareText = winner
    ? `I got ${winner.title} 💌 — what about you? ${quizUrl}`
    : quizUrl

  const share = (channel: string) => {
    track('quiz_result_shared', { quiz: slug, channel })
  }

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

  return (
    <div className="relative bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 overflow-hidden">
      {/* Intro screen */}
      {phase === 'intro' && (
        <div className="relative text-center py-6">
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
          <div className="qz-float-emoji text-6xl mb-5" aria-hidden="true">💌</div>
          <h3 className="font-serif text-2xl font-bold text-rose-900 mb-3">{title}</h3>
          <p className="text-sm text-rose-500 mb-6">
            {questions.length} questions · takes ~1 min
          </p>
          <input
            value={name}
            onChange={e => setName(e.target.value.slice(0, 60))}
            onKeyDown={e => e.key === 'Enter' && start()}
            placeholder="Your name"
            aria-label="Your name"
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
            placeholder="Email (optional)"
            aria-label="Email (optional)"
            className={`w-full max-w-xs mx-auto block rounded-xl border px-4 py-2.5 text-base text-center mb-1 focus:outline-none focus:ring-2 focus:ring-rose-300 ${
              emailHint ? 'border-rose-400' : 'border-rose-200'
            }`}
          />
          <p className={`text-[11px] mb-6 ${emailHint ? 'text-rose-500' : 'text-rose-400'}`}>
            {emailHint ? 'That does not look like an email — fix it or leave it blank 💗' : 'Email (optional) — so we can send you your result'}
          </p>
          <button
            onClick={start}
            disabled={!name.trim()}
            className="cta-heartbeat bg-rose-600 text-white px-10 py-4 rounded-full font-semibold text-base hover:bg-rose-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start the quiz →
          </button>
        </div>
      )}

      {/* Questions */}
      {phase === 'question' && (
        <>
          {/* Journey progress bar: envelope travels the rose track */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-rose-400 mb-2">
              <span>Question {step + 1} of {questions.length}</span>
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
            {step > 0 ? MICROCOPY[(step - 1) % MICROCOPY.length] : ' '}
          </p>

          <div key={step} className={leaving ? 'qz-slide-out' : 'qz-slide-in'}>
            <h3 className="font-serif text-xl text-rose-900 mb-5">{questions[step].question}</h3>
            <div className="space-y-3">
              {questions[step].options.map((o, i) => (
                <button
                  key={i}
                  onClick={() => answer(o.result, i)}
                  disabled={picked !== null}
                  className={`qz-option relative w-full text-left px-5 py-4 rounded-2xl border text-rose-800 ${
                    picked === i
                      ? 'qz-picked bg-rose-50 border-rose-400'
                      : 'border-rose-200 bg-white hover:bg-rose-50 hover:border-rose-300'
                  }`}
                >
                  {o.text}
                  {picked === i && (
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

      {/* Sealing beat */}
      {phase === 'sealing' && (
        <div className="text-center py-14">
          <div className="qz-seal-wiggle text-5xl mb-4" aria-hidden="true">💌</div>
          <p className="font-serif text-lg text-rose-800">Sealing your answers…</p>
        </div>
      )}

      {/* Result — opened like a letter */}
      {phase === 'result' && winner && (
        <div className="relative">
          {/* One-shot CSS confetti */}
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
            {winner.emoji && <div className="qz-result-emoji text-6xl mb-3">{winner.emoji}</div>}
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Your result</p>
            <h3 className="font-serif text-3xl font-bold text-rose-900 mt-1 mb-3">
              {name.trim() ? `${name.trim()}, you're ${articleFor(winner.title)}${winner.title}!` : winner.title}
            </h3>
            <p className="text-sm text-rose-700/70 max-w-md mx-auto leading-relaxed">{winner.description}</p>

            <Link
              href={winner.link_href || '/write'}
              className="mt-7 inline-block bg-rose-600 text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-sm"
            >
              {winner.link_label || 'Write them a real letter 💌'}
            </Link>

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

            <div>
              <button onClick={reset} className="mt-5 text-sm text-rose-500 underline hover:text-rose-700">
                Retake the quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
