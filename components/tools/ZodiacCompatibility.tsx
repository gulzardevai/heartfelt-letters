'use client'
import { useState } from 'react'

type Sign = {
  name: string
  emoji: string
  element: 'Fire' | 'Earth' | 'Air' | 'Water'
}

const SIGNS: Sign[] = [
  { name: 'Aries', emoji: '♈', element: 'Fire' },
  { name: 'Taurus', emoji: '♉', element: 'Earth' },
  { name: 'Gemini', emoji: '♊', element: 'Air' },
  { name: 'Cancer', emoji: '♋', element: 'Water' },
  { name: 'Leo', emoji: '♌', element: 'Fire' },
  { name: 'Virgo', emoji: '♍', element: 'Earth' },
  { name: 'Libra', emoji: '♎', element: 'Air' },
  { name: 'Scorpio', emoji: '♏', element: 'Water' },
  { name: 'Sagittarius', emoji: '♐', element: 'Fire' },
  { name: 'Capricorn', emoji: '♑', element: 'Earth' },
  { name: 'Aquarius', emoji: '♒', element: 'Air' },
  { name: 'Pisces', emoji: '♓', element: 'Water' },
]

// Element-pair compatibility base scores and reads.
const PAIR: Record<string, { score: number; read: string }> = {
  'Fire-Fire': { score: 88, read: 'Two flames — passionate, spontaneous and never boring, as long as you take turns leading.' },
  'Fire-Air': { score: 92, read: 'Air feeds fire. This is a lively, inspiring match full of ideas, adventure and easy chemistry.' },
  'Fire-Earth': { score: 68, read: 'Fire wants to leap; earth wants to plan. Grounding meets spark — it works with patience and respect.' },
  'Fire-Water': { score: 62, read: 'Steam or a doused flame. Deeply intense, sometimes stormy — honest words keep it warm, not scalding.' },
  'Earth-Earth': { score: 90, read: 'Steady, loyal and built to last. You share values and quietly build a life that feels safe.' },
  'Earth-Air': { score: 66, read: 'Practical meets playful. Different rhythms, but each teaches the other something they were missing.' },
  'Earth-Water': { score: 93, read: 'A nourishing match. Water softens earth, earth gives water a home — gentle, devoted and secure.' },
  'Air-Air': { score: 85, read: 'Endless conversation and mental sparks. Keep an eye on grounding the feelings behind the ideas.' },
  'Air-Water': { score: 64, read: 'Head meets heart. Fascinating and tender when air slows down to feel and water speaks its needs.' },
  'Water-Water': { score: 91, read: 'Profound emotional intimacy. You feel each other deeply — just remember to come up for air together.' },
}

function pairKey(a: string, b: string) {
  const order = ['Fire', 'Earth', 'Air', 'Water']
  const [x, y] = [a, b].sort((m, n) => order.indexOf(m) - order.indexOf(n))
  return `${x}-${y}`
}

export default function ZodiacCompatibility() {
  const [a, setA] = useState('Aries')
  const [b, setB] = useState('Libra')
  const [result, setResult] = useState<{ score: number; read: string } | null>(null)

  const sa = SIGNS.find(s => s.name === a)!
  const sb = SIGNS.find(s => s.name === b)!

  const check = () => {
    const base = PAIR[pairKey(sa.element, sb.element)]
    // Nudge same-sign pairings and add gentle variance for uniqueness
    const same = a === b ? -4 : 0
    setResult({ score: Math.min(99, Math.max(50, base.score + same)), read: base.read })
  }

  const Select = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl border border-rose-200 px-4 py-3 text-rose-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
    >
      {SIGNS.map(s => (
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
            {sa.emoji} {a} &amp; {b} {sb.emoji}
          </div>
          <p className="mt-2 text-sm text-rose-700/70 max-w-md mx-auto">{result.read}</p>
        </div>
      )}
    </div>
  )
}
