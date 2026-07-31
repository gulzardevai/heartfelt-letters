'use client'
import { useState } from 'react'

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

export default function CouplesQuestions() {
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
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(QUESTIONS).map(k => (
          <button
            key={k}
            onClick={() => { setCat(k); setCurrent(null); setUsed([]) }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              cat === k ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
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
    </div>
  )
}
