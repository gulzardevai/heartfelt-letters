'use client'
import { useState } from 'react'
import Link from 'next/link'
import { LANG_INFO, LOVE_BETTER, type Lang } from '@/lib/tools-result'
import ResultShare from './ResultShare'

type Person = { n?: string; lang: Lang }
type Initial =
  | null
  | { m: 'invite'; a: Person }
  | { m: 'couple'; a: Person; b: Person }
  | { m: 'solo'; lang: Lang; n?: string }

const QUESTIONS: { q: string; options: { text: string; lang: Lang }[] }[] = [
  {
    q: 'The gesture that makes you feel most loved is…',
    options: [
      { text: 'Being told exactly why they appreciate me', lang: 'words' },
      { text: 'A whole evening with their full attention', lang: 'time' },
      { text: 'A little gift they picked just for me', lang: 'gifts' },
      { text: 'Them quietly handling something for me', lang: 'acts' },
      { text: 'A long hug when I walk in', lang: 'touch' },
    ],
  },
  {
    q: 'A rough day is best fixed by…',
    options: [
      { text: 'Encouraging words that remind me who I am', lang: 'words' },
      { text: 'Them clearing the evening to just be with me', lang: 'time' },
      { text: 'A surprise treat waiting for me', lang: 'gifts' },
      { text: 'Them taking a chore off my plate', lang: 'acts' },
      { text: 'Curling up together on the couch', lang: 'touch' },
    ],
  },
  {
    q: 'You know a relationship is thriving when…',
    options: [
      { text: 'You say sweet things to each other often', lang: 'words' },
      { text: 'You protect real time together', lang: 'time' },
      { text: 'You mark moments with thoughtful tokens', lang: 'gifts' },
      { text: 'You show up for each other in practical ways', lang: 'acts' },
      { text: 'You’re still affectionate and close', lang: 'touch' },
    ],
  },
  {
    q: 'The compliment that would mean the most is…',
    options: [
      { text: '“I’m so proud of you.”', lang: 'words' },
      { text: '“I love just spending time with you.”', lang: 'time' },
      { text: '“I saw this and thought of you.”', lang: 'gifts' },
      { text: '“I already took care of it for you.”', lang: 'acts' },
      { text: '“Come here.” (and they pull you close)', lang: 'touch' },
    ],
  },
  {
    q: 'When you miss someone, you most wish for…',
    options: [
      { text: 'A message that says how they feel', lang: 'words' },
      { text: 'A long, unhurried call or visit', lang: 'time' },
      { text: 'Something in the post from them', lang: 'gifts' },
      { text: 'Them doing something helpful from afar', lang: 'acts' },
      { text: 'A hug the moment you reunite', lang: 'touch' },
    ],
  },
  {
    q: 'Your ideal anniversary is…',
    options: [
      { text: 'Exchanging heartfelt letters', lang: 'words' },
      { text: 'A whole day, just the two of you', lang: 'time' },
      { text: 'Meaningful gifts you’ve each chosen', lang: 'gifts' },
      { text: 'Them planning every detail so you can relax', lang: 'acts' },
      { text: 'Slow dancing, close, all evening', lang: 'touch' },
    ],
  },
]

const EMPTY: Record<Lang, number> = { words: 0, time: 0, gifts: 0, acts: 0, touch: 0 }

function winnerOf(scores: Record<Lang, number>): Lang {
  return (Object.entries(scores) as [Lang, number][]).sort((a, b) => b[1] - a[1])[0][0]
}

export default function LoveLanguageQuiz({ initial = null }: { initial?: Initial }) {
  const inviteFrom = initial?.m === 'invite' ? initial.a : null
  const initPhase: 'quiz' | 'solo' | 'combined' =
    initial?.m === 'couple' ? 'combined' : initial?.m === 'solo' ? 'solo' : 'quiz'

  const [phase, setPhase] = useState<'quiz' | 'solo' | 'combined'>(initPhase)
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState<Record<Lang, number>>(EMPTY)
  const [name, setName] = useState('')
  const [myLang, setMyLang] = useState<Lang | null>(initial?.m === 'solo' ? initial.lang : null)
  const [partner, setPartner] = useState<Person | null>(initial?.m === 'couple' ? initial.b : null)

  const answer = (lang: Lang) => {
    const next = { ...scores, [lang]: scores[lang] + 1 }
    setScores(next)
    if (step + 1 >= QUESTIONS.length) {
      const w = winnerOf(next)
      setMyLang(w)
      if (inviteFrom) {
        setPartner({ lang: w })
        setPhase('combined')
      } else {
        setPhase('solo')
      }
    } else {
      setStep(step + 1)
    }
  }

  const reset = () => {
    setPhase('quiz')
    setStep(0)
    setScores(EMPTY)
    setMyLang(null)
  }

  // Combined view: person A + person B (order: inviter is A, this person is B).
  const combA: Person | null =
    initial?.m === 'couple' ? initial.a : inviteFrom ? inviteFrom : null
  const combB: Person | null =
    initial?.m === 'couple'
      ? initial.b
      : myLang
        ? { n: name.trim() || undefined, lang: myLang }
        : partner

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      {/* Invite banner when a partner opened your link */}
      {inviteFrom && phase === 'quiz' && (
        <div className="mb-5 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-center">
          <p className="text-sm text-rose-700">
            <strong className="text-rose-900">{inviteFrom.n || 'Your partner'}</strong>’s love language is{' '}
            <strong className="text-rose-900">{LANG_INFO[inviteFrom.lang].label}</strong> {LANG_INFO[inviteFrom.lang].emoji}
          </p>
          <p className="text-xs text-rose-500 mt-1">Now take the quiz to discover yours — you’ll see them side by side.</p>
        </div>
      )}

      {phase === 'quiz' && (
        <>
          <div className="flex items-center justify-between text-xs text-rose-400 mb-4">
            <span>Question {step + 1} of {QUESTIONS.length}</span>
            <div className="flex-1 mx-3 h-1.5 bg-rose-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
            </div>
          </div>
          <h3 className="font-serif text-xl text-rose-900 mb-5">{QUESTIONS[step].q}</h3>
          <div className="space-y-2.5">
            {QUESTIONS[step].options.map((o, i) => (
              <button
                key={i}
                onClick={() => answer(o.lang)}
                className="w-full text-left px-4 py-3 rounded-xl border border-rose-200 text-rose-800 hover:bg-rose-50 hover:border-rose-300 transition-colors"
              >
                {o.text}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === 'solo' && myLang && (
        <div className="text-center">
          <div className="text-5xl mb-3">{LANG_INFO[myLang].emoji}</div>
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Your primary love language</p>
          <h3 className="font-serif text-3xl font-bold text-rose-900 mt-1 mb-3">{LANG_INFO[myLang].label}</h3>
          <p className="text-sm text-rose-700/70 max-w-md mx-auto">{LANG_INFO[myLang].blurb}</p>

          <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-100 p-5">
            <p className="font-serif text-lg text-rose-900 mb-1">💞 Couple mode</p>
            <p className="text-sm text-rose-700/80 mb-3">
              Send this to your partner — they take the quiz, then you both see your languages side by side.
            </p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name (so they know it’s you)"
              maxLength={24}
              className="w-full rounded-xl border border-rose-200 px-4 py-2.5 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
            />
            <ResultShare
              slug="love-language-quiz"
              state={{ m: 'invite', a: { n: name.trim() || undefined, lang: myLang } }}
              label="Send this to your partner"
            />
          </div>

          <button onClick={reset} className="mt-5 text-sm text-rose-600 underline hover:text-rose-800">
            Take the quiz again
          </button>
        </div>
      )}

      {phase === 'combined' && combA && combB && (
        <div className="text-center">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Your love languages</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[combA, combB].map((p, i) => (
              <div key={i} className="rounded-2xl bg-rose-50 border border-rose-100 p-4">
                <div className="text-3xl">{LANG_INFO[p.lang].emoji}</div>
                <div className="text-sm font-semibold text-rose-900 mt-1">{p.n || (i === 0 ? 'Them' : 'You')}</div>
                <div className="text-xs text-rose-600 mt-0.5">{LANG_INFO[p.lang].label}</div>
              </div>
            ))}
          </div>

          {/* Editable name for the partner who just finished */}
          {!initial && myLang && (
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Add your name to the card"
              maxLength={24}
              className="mt-4 w-full rounded-xl border border-rose-200 px-4 py-2.5 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
            />
          )}

          <div className="mt-5 space-y-3 text-left">
            <p className="text-center text-sm font-semibold text-rose-900">How to love each other better</p>
            <div className="rounded-xl border border-rose-100 p-4">
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wide mb-1">
                To love {combA.n || 'them'} ({LANG_INFO[combA.lang].label})
              </div>
              <p className="text-sm text-rose-700/80 leading-relaxed">{LOVE_BETTER[combA.lang]}</p>
            </div>
            <div className="rounded-xl border border-rose-100 p-4">
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wide mb-1">
                To love {combB.n || 'you'} ({LANG_INFO[combB.lang].label})
              </div>
              <p className="text-sm text-rose-700/80 leading-relaxed">{LOVE_BETTER[combB.lang]}</p>
            </div>
          </div>

          <Link
            href="/write?type=love"
            className="mt-6 inline-block bg-rose-600 text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-sm"
          >
            Write them a letter in their language 💌
          </Link>

          <ResultShare
            slug="love-language-quiz"
            state={{ m: 'couple', a: combA, b: { n: name.trim() || combB.n, lang: combB.lang } }}
            label="Share your combined result"
          />
        </div>
      )}
    </div>
  )
}
