'use client'
import { useState } from 'react'

type Lang = 'words' | 'time' | 'gifts' | 'acts' | 'touch'

const LANG_INFO: Record<Lang, { label: string; emoji: string; blurb: string }> = {
  words: { label: 'Words of Affirmation', emoji: '💬', blurb: 'You feel most loved through kind, honest, spoken and written words. A heartfelt letter lands deeper for you than almost anything.' },
  time: { label: 'Quality Time', emoji: '⏳', blurb: 'Undivided attention is everything. You feel loved when someone chooses to be fully present with you.' },
  gifts: { label: 'Receiving Gifts', emoji: '🎁', blurb: 'It’s the thought made visible. A small, meaningful token tells you that you were on someone’s mind.' },
  acts: { label: 'Acts of Service', emoji: '🤲', blurb: 'Actions speak loudest for you. When someone eases your load without being asked, you feel truly cared for.' },
  touch: { label: 'Physical Touch', emoji: '🤗', blurb: 'A hug, a hand held, closeness — physical warmth is how love feels most real to you.' },
}

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

export default function LoveLanguageQuiz() {
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState<Record<Lang, number>>({ words: 0, time: 0, gifts: 0, acts: 0, touch: 0 })
  const [done, setDone] = useState(false)

  const answer = (lang: Lang) => {
    const next = { ...scores, [lang]: scores[lang] + 1 }
    setScores(next)
    if (step + 1 >= QUESTIONS.length) {
      setDone(true)
    } else {
      setStep(step + 1)
    }
  }

  const reset = () => {
    setStep(0)
    setScores({ words: 0, time: 0, gifts: 0, acts: 0, touch: 0 })
    setDone(false)
  }

  const winner = (Object.entries(scores) as [Lang, number][]).sort((a, b) => b[1] - a[1])[0][0]
  const info = LANG_INFO[winner]

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      {!done ? (
        <>
          <div className="flex items-center justify-between text-xs text-rose-400 mb-4">
            <span>Question {step + 1} of {QUESTIONS.length}</span>
            <div className="flex-1 mx-3 h-1.5 bg-rose-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${((step) / QUESTIONS.length) * 100}%` }} />
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
      ) : (
        <div className="text-center">
          <div className="text-5xl mb-3">{info.emoji}</div>
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Your primary love language</p>
          <h3 className="font-serif text-3xl font-bold text-rose-900 mt-1 mb-3">{info.label}</h3>
          <p className="text-sm text-rose-700/70 max-w-md mx-auto">{info.blurb}</p>
          <button
            onClick={reset}
            className="mt-6 text-sm text-rose-600 underline hover:text-rose-800"
          >
            Take the quiz again
          </button>
        </div>
      )}
    </div>
  )
}
