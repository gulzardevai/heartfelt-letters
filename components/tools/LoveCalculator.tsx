'use client'
import { useState } from 'react'
import { loveScore, loveBand } from '@/lib/tools-result'
import ResultShare from './ResultShare'

export default function LoveCalculator({ initial = null }: { initial?: { a?: string; b?: string } | null }) {
  const [a, setA] = useState(initial?.a || '')
  const [b, setB] = useState(initial?.b || '')
  const [result, setResult] = useState<{ a: string; b: string; n: number } | null>(
    initial?.a && initial?.b ? { a: initial.a, b: initial.b, n: loveScore(initial.a, initial.b) } : null
  )

  const calc = () => {
    if (!a.trim() || !b.trim()) return
    setResult({ a: a.trim(), b: b.trim(), n: loveScore(a, b) })
  }

  const info = result ? loveBand(result.n) : null

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

      {result && info && (
        <div className="mt-6 text-center border-t border-rose-50 pt-6">
          <div className="text-6xl font-serif font-bold text-rose-600">{result.n}%</div>
          <div className="mt-2 font-semibold text-rose-900">
            {result.a} &amp; {result.b} — {info.label}
          </div>
          <p className="mt-1 text-sm text-rose-700/70 max-w-md mx-auto">{info.note}</p>
          <ResultShare slug="love-calculator" state={{ a: result.a, b: result.b }} />
        </div>
      )}
    </div>
  )
}
