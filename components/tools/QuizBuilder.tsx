'use client'
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { QUIZ_LIMITS, shareLink, scoreboardLink } from '@/lib/quiz'
import { QUIZ_BANK, pickRandomQuestions, type BankQuestion } from '@/lib/quiz-bank'
import { saveQuiz } from './quizStore'

// Bank-based builder: the creator never writes questions. They answer 10 random
// predefined questions about themselves (their tap = the correct answer), can
// swap any question for a fresh one, then seal + share.

const QUESTION_COUNT = 10

type Card = { question: BankQuestion; answer: number | null }

function track(event: string, params: Record<string, string> = {}) {
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void }
    if (typeof w.gtag === 'function') w.gtag('event', event, params)
  } catch {
    /* analytics must never break the builder */
  }
}

const CONFETTI_COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#f5c26b', '#e8b04b', '#fecdd3']

type Created = { id: string; ownerToken: string; title: string; creatorName: string }

export default function QuizBuilder() {
  const [creatorName, setCreatorName] = useState('')
  const [title, setTitle] = useState('')
  const [cards, setCards] = useState<Card[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState<Created | null>(null)

  const begin = () => {
    if (!creatorName.trim()) return toast.error('Add your name first.')
    setCards(pickRandomQuestions(QUESTION_COUNT).map(question => ({ question, answer: null })))
    track('ugc_quiz_started')
  }

  const pick = (ci: number, choice: number) =>
    setCards(cs => cs && cs.map((c, i) => (i === ci ? { ...c, answer: choice } : c)))

  // Replace card ci with a random bank question not already on screen; its answer resets.
  const swap = (ci: number) =>
    setCards(cs => {
      if (!cs) return cs
      const used = new Set(cs.map(c => c.question.id))
      const pool = QUIZ_BANK.filter(q => !used.has(q.id))
      if (pool.length === 0) {
        toast('You have seen every question in the bank! 🎉')
        return cs
      }
      const next = pool[Math.floor(Math.random() * pool.length)]
      return cs.map((c, i) => (i === ci ? { question: next, answer: null } : c))
    })

  const answered = cards ? cards.filter(c => c.answer !== null).length : 0
  const allAnswered = cards !== null && answered === cards.length

  const submit = async () => {
    if (!cards || !allAnswered) return toast.error('Answer all the questions first — it is about you!')
    setSaving(true)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          creator_name: creatorName,
          questions: cards.map(c => ({
            q: c.question.question,
            options: c.question.choices,
            correct_index: c.answer,
            emoji: c.question.emoji,
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

  // ===== Step 1: who is this quiz about? =====
  if (!cards) {
    return (
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-rose-900 mb-1.5">Your name</label>
          <input
            value={creatorName}
            onChange={e => setCreatorName(e.target.value.slice(0, QUIZ_LIMITS.creatorName))}
            onKeyDown={e => e.key === 'Enter' && begin()}
            placeholder="e.g. Sara"
            className="w-full rounded-xl border border-rose-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-300"
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
            onKeyDown={e => e.key === 'Enter' && begin()}
            placeholder={creatorName ? `How well do you know ${creatorName}?` : 'How well do you know me?'}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <div className="text-center pt-2">
          <button
            onClick={begin}
            className="cta-heartbeat inline-block bg-rose-600 text-white px-10 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Get my 10 questions →
          </button>
          <p className="text-xs text-rose-400 mt-3">
            We pick 10 fun questions — you tap your true answer, friends guess it. No writing needed.
          </p>
        </div>
      </div>
    )
  }

  // ===== Step 2: answer your 10 questions =====
  return (
    <div className="space-y-6">
      {/* Sticky-ish progress */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between text-xs text-rose-400 mb-2">
          <span className="font-semibold text-rose-700">{answered}/{cards.length} answered</span>
          <span>Tap your true answer on each card</span>
        </div>
        <div className="h-1.5 bg-rose-100 rounded-full overflow-hidden">
          <div
            className="qz-track-fill h-full bg-gradient-to-r from-rose-300 to-rose-500 rounded-full"
            style={{ width: `${(answered / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {cards.map((card, ci) => (
        <div key={card.question.id} className="qz-row-in bg-white rounded-3xl border border-rose-100 shadow-sm p-5 sm:p-6 overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="qz-float-emoji text-4xl shrink-0" aria-hidden="true">{card.question.emoji}</span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wide">Question {ci + 1}</p>
                <h3 className="font-serif text-lg font-bold text-rose-900 leading-snug break-words">{card.question.question}</h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => swap(ci)}
              className="shrink-0 min-h-[44px] px-3 rounded-full border border-rose-200 bg-white text-rose-500 text-xs font-semibold hover:bg-rose-50 hover:text-rose-700 transition-colors"
              aria-label="Swap this question for another"
            >
              🔄 Swap
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {card.question.choices.map((choice, oi) => (
              <button
                key={oi}
                type="button"
                onClick={() => pick(ci, oi)}
                className={`qz-option relative w-full min-h-[44px] text-left px-4 py-3 rounded-2xl border text-sm text-rose-800 break-words ${
                  card.answer === oi
                    ? 'qz-picked bg-rose-50 border-rose-400 font-semibold'
                    : 'border-rose-200 bg-white hover:bg-rose-50 hover:border-rose-300'
                }`}
              >
                {choice}
                {card.answer === oi && (
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
      ))}

      <div className="text-center pt-2">
        <button
          onClick={submit}
          disabled={saving || !allAnswered}
          className="cta-heartbeat inline-block bg-rose-600 text-white px-10 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Sealing your quiz… 💌' : allAnswered ? 'Create my quiz →' : `Answer ${cards.length - answered} more to create`}
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
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <input
              readOnly
              value={share}
              onFocus={e => e.target.select()}
              className="flex-1 rounded-xl border border-rose-200 px-3.5 py-2.5 text-base text-rose-700 bg-rose-50/40 min-w-0"
            />
            <button
              onClick={() => {
                track('ugc_quiz_shared', { channel: 'copy' })
                copy(share, 'Share link copied')
              }}
              className="shrink-0 min-h-[44px] bg-white border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-50 transition-colors"
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
          <div className="flex flex-wrap items-center gap-2">
            <input
              readOnly
              value={owner}
              onFocus={e => e.target.select()}
              className="flex-1 rounded-xl border border-rose-200 px-3.5 py-2.5 text-base text-rose-700 bg-rose-50/40 min-w-0"
            />
            <button
              onClick={() => copy(owner, 'Scoreboard link copied — keep it safe')}
              className="shrink-0 min-h-[44px] bg-white border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-50 transition-colors"
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
