'use client'
import { useState } from 'react'

const GIFTS: Record<number, { traditional: string; modern: string; idea: string }> = {
  1: { traditional: 'Paper', modern: 'Clocks', idea: 'A heartfelt letter — the ultimate paper gift — recalling your first year together.' },
  2: { traditional: 'Cotton', modern: 'China', idea: 'Matching cotton pyjamas, plus a note tucked into the pocket.' },
  3: { traditional: 'Leather', modern: 'Crystal / Glass', idea: 'A leather-bound journal to fill with your favourite memories.' },
  4: { traditional: 'Fruit / Flowers', modern: 'Appliances', idea: 'A picnic of their favourite fruit and a bouquet that never wilts.' },
  5: { traditional: 'Wood', modern: 'Silverware', idea: 'A carved keepsake box — for letters and small treasures.' },
  6: { traditional: 'Candy / Iron', modern: 'Wood', idea: 'A sweet hamper of the candy that reminds you of them.' },
  7: { traditional: 'Wool / Copper', modern: 'Desk sets', idea: 'A cosy wool blanket for the nights in you both love.' },
  8: { traditional: 'Pottery / Bronze', modern: 'Linens / Lace', idea: 'A handmade ceramic mug pair for slow morning coffees.' },
  9: { traditional: 'Pottery / Willow', modern: 'Leather', idea: 'A leather photo album of nine years, with a letter inside the cover.' },
  10: { traditional: 'Tin / Aluminium', modern: 'Diamond jewellery', idea: 'A decade deserves a letter naming ten things you still adore.' },
  11: { traditional: 'Steel', modern: 'Fashion jewellery', idea: 'An engraved steel keychain with a date only you two know.' },
  12: { traditional: 'Silk / Linen', modern: 'Pearls', idea: 'A silk scarf or tie, with a note about how you’ve grown together.' },
  13: { traditional: 'Lace', modern: 'Textiles / Furs', idea: 'A delicate lace keepsake and an evening reminiscing.' },
  14: { traditional: 'Ivory', modern: 'Gold jewellery', idea: 'A gold piece engraved with your anniversary date.' },
  15: { traditional: 'Crystal', modern: 'Watches', idea: 'A crystal keepsake, plus a letter marking fifteen years.' },
  20: { traditional: 'China', modern: 'Platinum', idea: 'A fine china set for the dinners you’ll keep sharing — and a letter.' },
  25: { traditional: 'Silver', modern: 'Silver', idea: 'A silver frame holding a photo from year one, with a letter behind it.' },
  30: { traditional: 'Pearl', modern: 'Diamond', idea: 'Pearls and a letter tracing three decades of your story.' },
  40: { traditional: 'Ruby', modern: 'Ruby', idea: 'A ruby token and a letter about the love that only deepened.' },
  50: { traditional: 'Gold', modern: 'Gold', idea: 'Golden anniversary — a letter here becomes a family heirloom.' },
}

const YEARS = Object.keys(GIFTS).map(Number)

export default function AnniversaryGifts() {
  const [year, setYear] = useState<number | ''>('')
  const g = typeof year === 'number' ? GIFTS[year] : null

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
            <option key={y} value={y}>{y}{y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'} anniversary</option>
          ))}
        </select>
      </label>

      {g && (
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
        </div>
      )}
    </div>
  )
}
