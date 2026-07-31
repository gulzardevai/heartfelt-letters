'use client'
import { useState } from 'react'
import { ANNIVERSARY_GIFTS, ordinal } from '@/lib/tools-result'
import ResultShare from './ResultShare'

const YEARS = Object.keys(ANNIVERSARY_GIFTS).map(Number)

export default function AnniversaryGifts({ initial = null }: { initial?: { y?: number } | null }) {
  const [year, setYear] = useState<number | ''>(initial?.y && ANNIVERSARY_GIFTS[initial.y] ? initial.y : '')
  const g = typeof year === 'number' ? ANNIVERSARY_GIFTS[year] : null

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      <label className="block">
        <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Which anniversary?</span>
        <select
          value={year}
          onChange={e => setYear(e.target.value ? Number(e.target.value) : '')}
          className="mt-1.5 w-full rounded-xl border border-rose-200 px-4 py-3 text-rose-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <option value="">Choose a year…</option>
          {YEARS.map(y => (
            <option key={y} value={y}>{ordinal(y)} anniversary</option>
          ))}
        </select>
      </label>

      {g && typeof year === 'number' && (
        <div className="mt-6 border-t border-rose-50 pt-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-rose-50 rounded-xl p-4">
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Traditional</div>
              <div className="text-lg font-serif font-bold text-rose-800 mt-0.5">{g.traditional}</div>
            </div>
            <div className="bg-rose-50 rounded-xl p-4">
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Modern</div>
              <div className="text-lg font-serif font-bold text-rose-800 mt-0.5">{g.modern}</div>
            </div>
          </div>
          <div className="rounded-xl border border-rose-100 p-4">
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wide mb-1">Gift idea</div>
            <p className="text-sm text-rose-700/80 leading-relaxed">{g.idea}</p>
          </div>
          <ResultShare slug="anniversary-gifts" state={{ y: year }} label="Share the gift idea" />
        </div>
      )}
    </div>
  )
}
