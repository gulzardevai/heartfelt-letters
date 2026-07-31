'use client'
import { useState } from 'react'

const POOLS: Record<string, string[]> = {
  sweet: ['Love', 'Sweetheart', 'Darling', 'Honey', 'Angel', 'Sunshine', 'My love', 'Dearest', 'Sweetpea', 'Treasure', 'Precious', 'Beloved'],
  playful: ['Goober', 'Bug', 'Muffin', 'Nugget', 'Boo', 'Bubba', 'Doodle', 'Peanut', 'Snickerdoodle', 'Cuddlebug', 'Sillyhead', 'Munchkin'],
  cute: ['Cutie', 'Honeybee', 'Pumpkin', 'Buttercup', 'Cupcake', 'Sugar', 'Bunny', 'Dumpling', 'Marshmallow', 'Sweet cheeks', 'Little bear', 'Duckling'],
  romantic: ['My heart', 'Amor', 'Mon amour', 'My everything', 'Soulmate', 'My one', 'Starlight', 'My moon', 'Forever', 'My person', 'Lovebird', 'My world'],
}

const LABELS: Record<string, string> = {
  sweet: 'Sweet & classic',
  playful: 'Playful & silly',
  cute: 'Cute & soft',
  romantic: 'Deeply romantic',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function NicknameGenerator() {
  const [vibe, setVibe] = useState('sweet')
  const [picks, setPicks] = useState<string[]>([])

  const generate = () => setPicks(shuffle(POOLS[vibe]).slice(0, 6))

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="flex-1">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Pick a vibe</span>
          <select
            value={vibe}
            onChange={e => setVibe(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-rose-200 px-4 py-3 text-rose-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            {Object.keys(POOLS).map(k => (
              <option key={k} value={k}>{LABELS[k]}</option>
            ))}
          </select>
        </label>
        <button
          onClick={generate}
          className="sm:self-end bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors whitespace-nowrap"
        >
          {picks.length ? 'Give me more 🔁' : 'Generate names 🥰'}
        </button>
      </div>

      {picks.length > 0 && (
        <div className="mt-6 border-t border-rose-50 pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {picks.map((n, i) => (
            <div
              key={i}
              className="bg-rose-50 rounded-xl py-3 px-3 text-center font-serif text-rose-800 font-semibold"
            >
              {n}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
