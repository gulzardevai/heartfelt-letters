'use client'
import { useState } from 'react'

function score(a: string, b: string): number {
  const s = (a + b).toLowerCase().replace(/[^a-z]/g, '')
  if (!s) return 0
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) % 100000
  }
  // Bias gently upward so it feels warm, then clamp to 40–99
  return 40 + (h % 60)
}

function band(n: number): { label: string; note: string } {
  if (n >= 90) return { label: 'A rare kind of match', note: 'The letters practically finish each other’s sentences. Go tell them.' }
  if (n >= 75) return { label: 'Seriously strong', note: 'There’s real warmth here. This is the kind you write letters about.' }
  if (n >= 60) return { label: 'Sweet and promising', note: 'A lovely spark — worth nurturing with a little more honesty out loud.' }
  return { label: 'A slow-burn', note: 'Numbers don’t know your story. The words you choose to say do.' }
}

export default function LoveCalculator() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const calc = () => {
    if (!a.trim() || !b.trim()) return
    setResult(score(a, b))
  }

  const info = result !== null ? band(result) : null

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Your name</span>
          <input
            value={a}
            onChange={e => setA(e.target.value)}
            placeholder="e.g. Alex"
            className="mt-1.5 w-full rounded-xl border border-rose-200 px-4 py-3 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Their name</span>
          <input
            value={b}
            onChange={e => setB(e.target.value)}
            placeholder="e.g. Sam"
            className="mt-1.5 w-full rounded-xl border border-rose-200 px-4 py-3 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </label>
      </div>
      <button
        onClick={calc}
        disabled={!a.trim() || !b.trim()}
        className="mt-5 w-full bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Calculate our love ❤️
      </button>

      {info && (
        <div className="mt-6 text-center border-t border-rose-50 pt-6">
          <div className="text-6xl font-serif font-bold text-rose-600">{result}%</div>
          <div className="mt-2 font-semibold text-rose-900">
            {a.trim()} &amp; {b.trim()} — {info.label}
          </div>
          <p className="mt-1 text-sm text-rose-700/70 max-w-md mx-auto">{info.note}</p>
        </div>
      )}
    </div>
  )
}
