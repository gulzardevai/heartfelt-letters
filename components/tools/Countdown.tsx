'use client'
import { useEffect, useState } from 'react'
import ResultShare from './ResultShare'

export default function Countdown({ initial = null }: { initial?: { t?: string; label?: string } | null }) {
  const [target, setTarget] = useState(initial?.t || '')
  const [label, setLabel] = useState(initial?.label || '')
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const targetMs = target ? new Date(target).getTime() : NaN
  const valid = !isNaN(targetMs)
  const diff = valid ? targetMs - now : 0
  const passed = valid && diff <= 0

  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24))
  const mins = Math.max(0, Math.floor((diff / (1000 * 60)) % 60))
  const secs = Math.max(0, Math.floor((diff / 1000) % 60))

  const cell = (n: number, l: string) => (
    <div className="bg-rose-50 rounded-xl py-4 flex-1">
      <div className="text-3xl sm:text-4xl font-bold text-rose-600 tabular-nums">{String(n).padStart(2, '0')}</div>
      <div className="text-xs text-rose-400 mt-0.5">{l}</div>
    </div>
  )

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      <label className="block">
        <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">What are you counting down to?</span>
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="e.g. Our anniversary"
          maxLength={40}
          className="mt-1.5 w-full rounded-xl border border-rose-200 px-4 py-3 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </label>
      <label className="block mt-4">
        <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Count down to…</span>
        <input
          type="datetime-local"
          value={target}
          onChange={e => setTarget(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-rose-200 px-4 py-3 text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </label>

      {valid && !passed && (
        <div className="mt-6 border-t border-rose-50 pt-6">
          {label.trim() && <p className="text-center font-serif text-lg text-rose-900 mb-3">{label.trim()}</p>}
          <div className="flex gap-2.5 sm:gap-3 text-center">
            {cell(days, 'days')}
            {cell(hours, 'hours')}
            {cell(mins, 'minutes')}
            {cell(secs, 'seconds')}
          </div>
          <ResultShare slug="countdown" state={{ t: target, label: label.trim() || undefined }} label="Count down together" />
        </div>
      )}

      {passed && (
        <div className="mt-6 border-t border-rose-50 pt-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-serif text-xl text-rose-900">{label.trim() || 'The day'} is here!</p>
          <p className="text-sm text-rose-700/70 mt-1">What a moment to have a letter waiting for someone.</p>
        </div>
      )}
    </div>
  )
}
