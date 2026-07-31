'use client'
import { useState } from 'react'
import { ZODIAC_SIGNS, signByName, zodiacResult } from '@/lib/tools-result'
import ResultShare from './ResultShare'

export default function ZodiacCompatibility({ initial = null }: { initial?: { a?: string; b?: string } | null }) {
  const validA = initial?.a && signByName(initial.a) ? initial.a : 'Aries'
  const validB = initial?.b && signByName(initial.b) ? initial.b : 'Libra'
  const [a, setA] = useState(validA)
  const [b, setB] = useState(validB)
  const [result, setResult] = useState<{ a: string; b: string; score: number; read: string } | null>(
    initial?.a && initial?.b && signByName(initial.a) && signByName(initial.b)
      ? { a: initial.a, b: initial.b, ...zodiacResult(initial.a, initial.b) }
      : null
  )

  const sa = signByName(a)!
  const sb = signByName(b)!

  const check = () => setResult({ a, b, ...zodiacResult(a, b) })

  const Select = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl border border-rose-200 px-4 py-3 text-rose-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
    >
      {ZODIAC_SIGNS.map(s => (
        <option key={s.name} value={s.name}>{s.emoji} {s.name}</option>
      ))}
    </select>
  )

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Your sign</span>
          <div className="mt-1.5"><Select value={a} onChange={setA} /></div>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Their sign</span>
          <div className="mt-1.5"><Select value={b} onChange={setB} /></div>
        </label>
      </div>
      <button
        onClick={check}
        className="mt-5 w-full bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors"
      >
        Check compatibility ✨
      </button>

      {result && (
        <div className="mt-6 border-t border-rose-50 pt-6 text-center">
          <div className="text-6xl font-serif font-bold text-rose-600">{result.score}%</div>
          <div className="mt-2 font-semibold text-rose-900">
            {signByName(result.a)?.emoji} {result.a} &amp; {result.b} {signByName(result.b)?.emoji}
          </div>
          <p className="mt-2 text-sm text-rose-700/70 max-w-md mx-auto">{result.read}</p>
          <ResultShare slug="zodiac-compatibility" state={{ a: result.a, b: result.b }} />
        </div>
      )}
    </div>
  )
}
