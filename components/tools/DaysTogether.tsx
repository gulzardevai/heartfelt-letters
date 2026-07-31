'use client'
import { useState } from 'react'
import { daysTogether } from '@/lib/tools-result'
import ResultShare from './ResultShare'

export default function DaysTogether({ initial = null }: { initial?: { d?: string } | null }) {
  const [date, setDate] = useState(initial?.d || '')
  const [go, setGo] = useState(!!initial?.d)

  const now = new Date()
  const res = daysTogether(date)
  const valid = !!res

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      <label className="block">
        <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">The day it began</span>
        <input
          type="date"
          value={date}
          max={now.toISOString().slice(0, 10)}
          onChange={e => { setDate(e.target.value); setGo(true) }}
          className="mt-1.5 w-full rounded-xl border border-rose-200 px-4 py-3 text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </label>

      {go && valid && res && (
        <div className="mt-6 border-t border-rose-50 pt-6">
          <div className="text-center">
            <div className="text-6xl font-serif font-bold text-rose-600">{res.days.toLocaleString()}</div>
            <div className="mt-1 text-sm text-rose-700/70">days together</div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="bg-rose-50 rounded-xl py-3">
              <div className="text-2xl font-bold text-rose-700">{res.years}</div>
              <div className="text-xs text-rose-400">years</div>
            </div>
            <div className="bg-rose-50 rounded-xl py-3">
              <div className="text-2xl font-bold text-rose-700">{res.months}</div>
              <div className="text-xs text-rose-400">months</div>
            </div>
            <div className="bg-rose-50 rounded-xl py-3">
              <div className="text-2xl font-bold text-rose-700">{res.remDays}</div>
              <div className="text-xs text-rose-400">days</div>
            </div>
          </div>
          {res.nextMilestone && (
            <p className="mt-5 text-center text-sm text-rose-700/70">
              Next milestone: <strong className="text-rose-900">{res.nextMilestone.label}</strong> in{' '}
              <strong className="text-rose-900">{res.nextMilestone.inDays.toLocaleString()}</strong> day
              {res.nextMilestone.inDays === 1 ? '' : 's'}.
            </p>
          )}
          <ResultShare slug="days-together" state={{ d: date }} label="Share your milestone" />
        </div>
      )}

      {go && date && !valid && (
        <p className="mt-5 text-sm text-rose-500 text-center">Pick a start date that is today or in the past.</p>
      )}
    </div>
  )
}
