'use client'
import { useState } from 'react'

const DAY = 1000 * 60 * 60 * 24

export default function DaysTogether() {
  const [date, setDate] = useState('')
  const [go, setGo] = useState(false)

  const start = date ? new Date(date + 'T00:00:00') : null
  const now = new Date()
  const valid = start && !isNaN(start.getTime()) && start.getTime() <= now.getTime()

  let days = 0
  let years = 0
  let months = 0
  let remDays = 0
  let nextMilestone: { label: string; inDays: number } | null = null

  if (valid && start) {
    days = Math.floor((now.getTime() - start.getTime()) / DAY)

    // whole years + months + days breakdown
    let y = now.getFullYear() - start.getFullYear()
    let m = now.getMonth() - start.getMonth()
    let d = now.getDate() - start.getDate()
    if (d < 0) {
      m -= 1
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate()
      d += prevMonth
    }
    if (m < 0) {
      y -= 1
      m += 12
    }
    years = y
    months = m
    remDays = d

    // Next milestone: next round-hundred day OR next full-year anniversary, whichever is sooner
    const nextHundred = (Math.floor(days / 100) + 1) * 100
    const hundredIn = nextHundred - days
    const nextAnniv = new Date(start)
    nextAnniv.setFullYear(start.getFullYear() + years + 1)
    const annivIn = Math.ceil((nextAnniv.getTime() - now.getTime()) / DAY)
    if (hundredIn <= annivIn) {
      nextMilestone = { label: `${nextHundred.toLocaleString()} days together`, inDays: hundredIn }
    } else {
      nextMilestone = { label: `${years + 1} year${years + 1 === 1 ? '' : 's'} together`, inDays: annivIn }
    }
  }

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

      {go && valid && (
        <div className="mt-6 border-t border-rose-50 pt-6">
          <div className="text-center">
            <div className="text-6xl font-serif font-bold text-rose-600">{days.toLocaleString()}</div>
            <div className="mt-1 text-sm text-rose-700/70">days together</div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="bg-rose-50 rounded-xl py-3">
              <div className="text-2xl font-bold text-rose-700">{years}</div>
              <div className="text-xs text-rose-400">years</div>
            </div>
            <div className="bg-rose-50 rounded-xl py-3">
              <div className="text-2xl font-bold text-rose-700">{months}</div>
              <div className="text-xs text-rose-400">months</div>
            </div>
            <div className="bg-rose-50 rounded-xl py-3">
              <div className="text-2xl font-bold text-rose-700">{remDays}</div>
              <div className="text-xs text-rose-400">days</div>
            </div>
          </div>
          {nextMilestone && (
            <p className="mt-5 text-center text-sm text-rose-700/70">
              Next milestone: <strong className="text-rose-900">{nextMilestone.label}</strong> in{' '}
              <strong className="text-rose-900">{nextMilestone.inDays.toLocaleString()}</strong> day
              {nextMilestone.inDays === 1 ? '' : 's'}.
            </p>
          )}
        </div>
      )}

      {go && date && !valid && (
        <p className="mt-5 text-sm text-rose-500 text-center">Pick a start date that is today or in the past.</p>
      )}
    </div>
  )
}
