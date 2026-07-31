'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CHALLENGE_QUESTIONS, scoreLabel } from '@/lib/tools-result'
import ResultShare from './ResultShare'

type Initial =
  | null
  | { m: 'challenge'; n?: string; qs: number[]; as: number[] }
  | { m: 'score'; n?: string; g?: string; score: number; total: number }

const QUESTIONS: Record<string, string[]> = {
  deep: [
    'When did you first know you were falling for me?',
    'What does love feel like to you now, compared to when we met?',
    'What’s a fear you’ve never told me about?',
    'When do you feel most understood by me?',
    'What does our future look like on your best days imagining it?',
    'What’s something I do that makes you feel safe?',
    'What part of your past shaped who you are today?',
    'What do you hope people say about our relationship?',
    'When have you felt proudest of us?',
    'What does “home” mean to you — and am I part of it?',
    'What’s a dream you’ve set aside that you’d like to pick back up?',
    'How do you most like to be comforted when you’re hurting?',
  ],
  fun: [
    'If we could teleport anywhere right now, where are we going?',
    'What’s the most ridiculous thing you find adorable about me?',
    'If our relationship had a theme song, what would it be?',
    'What fictional couple are we most like?',
    'What’s a tiny habit of mine you’d secretly miss?',
    'If we swapped lives for a day, what would surprise you most?',
    'What’s the best meal we’ve ever shared?',
    'What would our reality-TV show be called?',
    'What emoji describes our relationship perfectly?',
    'If you had to describe me to an alien, what would you say?',
    'What’s a silly inside joke only we understand?',
    'What superpower would make us an unstoppable couple?',
  ],
  'date-night': [
    'What’s a memory from this year you never want to forget?',
    'What’s one thing you’d love us to try together soon?',
    'What made you smile most this week?',
    'If we planned the perfect weekend, what’s on it?',
    'What’s something new you learned about me lately?',
    'What tradition should we start as a couple?',
    'Where do you picture us on our tenth anniversary?',
    'What song instantly reminds you of us?',
    'What’s the nicest thing I’ve done that you never mentioned?',
    'If we wrote a bucket list tonight, what’s number one?',
    'What’s your favourite way we spend an ordinary evening?',
    'What would you want to relive from the day we met?',
  ],
}

const LABELS: Record<string, string> = {
  deep: '💗 Deep',
  fun: '😄 Fun',
  'date-night': '🕯️ Date night',
}

// The 6 fixed multiple-choice questions used by the challenge.
const CHALLENGE_SET = [0, 1, 2, 3, 4, 5]

export default function CouplesQuestions({ initial = null }: { initial?: Initial }) {
  if (initial?.m === 'challenge') return <GuessFlow challenge={initial} />
  if (initial?.m === 'score') return <ScoreView result={initial} />
  return <BaseTool />
}

/* ---------------- Base tool: draw generator + challenge entry ---------------- */
function BaseTool() {
  const [mode, setMode] = useState<'draw' | 'build'>('draw')

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      <div className="flex gap-2 justify-center mb-6">
        <button
          onClick={() => setMode('draw')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'draw' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
        >
          Draw questions
        </button>
        <button
          onClick={() => setMode('build')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'build' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
        >
          Who knows who better? 🏆
        </button>
      </div>
      {mode === 'draw' ? <DrawQuestions /> : <BuildChallenge />}
    </div>
  )
}

function DrawQuestions() {
  const [cat, setCat] = useState('deep')
  const [current, setCurrent] = useState<string | null>(null)
  const [used, setUsed] = useState<string[]>([])

  const draw = (category: string) => {
    const pool = QUESTIONS[category].filter(q => !used.includes(q))
    const source = pool.length ? pool : QUESTIONS[category]
    const nextUsed = pool.length ? used : []
    const pick = source[Math.floor(Math.random() * source.length)]
    setCurrent(pick)
    setUsed([...nextUsed, pick])
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(QUESTIONS).map(k => (
          <button
            key={k}
            onClick={() => { setCat(k); setCurrent(null); setUsed([]) }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === k ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
          >
            {LABELS[k]}
          </button>
        ))}
      </div>
      <div className="mt-6 min-h-[7rem] flex items-center justify-center text-center border-t border-rose-50 pt-6">
        {current ? (
          <p className="font-serif text-xl sm:text-2xl text-rose-900 leading-snug">{current}</p>
        ) : (
          <p className="text-sm text-rose-400">Tap below to draw a {LABELS[cat].replace(/^[^ ]+ /, '').toLowerCase()} question.</p>
        )}
      </div>
      <button
        onClick={() => draw(cat)}
        className="mt-5 w-full bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors"
      >
        {current ? 'Next question 🔁' : 'Draw a question 💬'}
      </button>
    </>
  )
}

/* ---------------- Challenge builder (you answer about yourself) ---------------- */
function BuildChallenge() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [name, setName] = useState('')
  const [done, setDone] = useState(false)

  const total = CHALLENGE_SET.length

  const pick = (optIdx: number) => {
    const next = [...answers, optIdx]
    setAnswers(next)
    if (step + 1 >= total) setDone(true)
    else setStep(step + 1)
  }

  if (done) {
    return (
      <div className="text-center border-t border-rose-50 pt-6">
        <div className="text-4xl mb-2">🏆</div>
        <h3 className="font-serif text-2xl font-bold text-rose-900">Challenge ready!</h3>
        <p className="text-sm text-rose-700/70 mt-2 max-w-sm mx-auto">
          Send this to your partner. They’ll guess your answers and get a score for how well they know you.
        </p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={24}
          className="mt-4 w-full rounded-xl border border-rose-200 px-4 py-2.5 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
        />
        <ResultShare
          slug="couples-questions"
          state={{ m: 'challenge', n: name.trim() || undefined, qs: CHALLENGE_SET, as: answers }}
          label="Send your challenge"
        />
      </div>
    )
  }

  const qIdx = CHALLENGE_SET[step]
  const q = CHALLENGE_QUESTIONS[qIdx]

  return (
    <div className="border-t border-rose-50 pt-6">
      <div className="flex items-center justify-between text-xs text-rose-400 mb-4">
        <span>About you · {step + 1} of {total}</span>
        <div className="flex-1 mx-3 h-1.5 bg-rose-100 rounded-full overflow-hidden">
          <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${(step / total) * 100}%` }} />
        </div>
      </div>
      <h3 className="font-serif text-xl text-rose-900 mb-5">{q.q}</h3>
      <div className="space-y-2.5">
        {q.options.map((o, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className="w-full text-left px-4 py-3 rounded-xl border border-rose-200 text-rose-800 hover:bg-rose-50 hover:border-rose-300 transition-colors"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Guess flow (partner guesses your answers) ---------------- */
function GuessFlow({ challenge }: { challenge: { n?: string; qs: number[]; as: number[] } }) {
  const total = challenge.qs.length
  const [step, setStep] = useState(0)
  const [guesses, setGuesses] = useState<number[]>([])
  const [guesser, setGuesser] = useState('')

  const who = challenge.n || 'them'

  const pick = (optIdx: number) => {
    const next = [...guesses, optIdx]
    setGuesses(next)
    if (step + 1 < total) setStep(step + 1)
    else setStep(total) // move to name/score
  }

  const finished = guesses.length === total

  if (finished) {
    const score = challenge.qs.reduce((acc, _q, i) => acc + (guesses[i] === challenge.as[i] ? 1 : 0), 0)
    const pct = Math.round((score / total) * 100)
    return (
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 text-center">
        <div className="text-5xl mb-2">💬</div>
        <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide">How well you know {who}</p>
        <div className="text-6xl font-serif font-bold text-rose-600 mt-2">{score}/{total}</div>
        <p className="mt-2 font-semibold text-rose-900">{pct}% — {scoreLabel(pct)}</p>
        <input
          value={guesser}
          onChange={e => setGuesser(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={24}
          className="mt-5 w-full rounded-xl border border-rose-200 px-4 py-2.5 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
        />
        <ResultShare
          slug="couples-questions"
          state={{ m: 'score', n: challenge.n, g: guesser.trim() || undefined, score, total }}
          label="Share your score"
        />
        <Link
          href="/write?type=love"
          className="mt-5 inline-block text-sm text-rose-600 underline hover:text-rose-800"
        >
          Now write {who} a real letter →
        </Link>
      </div>
    )
  }

  const qIdx = challenge.qs[step]
  const q = CHALLENGE_QUESTIONS[qIdx]

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      <div className="mb-4 rounded-2xl bg-rose-50 border border-rose-100 p-3 text-center">
        <p className="text-sm text-rose-700">Guess how <strong className="text-rose-900">{who}</strong> answered 👀</p>
      </div>
      <div className="flex items-center justify-between text-xs text-rose-400 mb-4">
        <span>Question {step + 1} of {total}</span>
        <div className="flex-1 mx-3 h-1.5 bg-rose-100 rounded-full overflow-hidden">
          <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${(step / total) * 100}%` }} />
        </div>
      </div>
      <h3 className="font-serif text-xl text-rose-900 mb-5">{q.q}</h3>
      <div className="space-y-2.5">
        {q.options.map((o, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className="w-full text-left px-4 py-3 rounded-xl border border-rose-200 text-rose-800 hover:bg-rose-50 hover:border-rose-300 transition-colors"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Score view (opened from a shared score link) ---------------- */
function ScoreView({ result }: { result: { n?: string; g?: string; score: number; total: number } }) {
  const pct = result.total ? Math.round((result.score / result.total) * 100) : 0
  const who = result.n || 'them'
  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 text-center">
      <div className="text-5xl mb-2">💬</div>
      <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide">
        {result.g ? `${result.g} knows ${who}` : `How well you know ${who}`}
      </p>
      <div className="text-6xl font-serif font-bold text-rose-600 mt-2">{result.score}/{result.total}</div>
      <p className="mt-2 font-semibold text-rose-900">{pct}% — {scoreLabel(pct)}</p>
      <p className="mt-4 text-sm text-rose-700/70 max-w-sm mx-auto">
        Think you can do better? Start your own “who knows who better?” challenge.
      </p>
      <Link
        href="/tools/couples-questions"
        className="mt-4 inline-block bg-rose-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-sm"
      >
        Make your own challenge 🏆
      </Link>
    </div>
  )
}
