'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getTheme, envelopeCssVars } from '@/lib/themes'

interface Props {
  openAt: string
  recipientName?: string | null
  senderName?: string | null
  theme?: string
}

const TWO_DIGITS = (n: number) => String(n).padStart(2, '0')

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

export default function SealedUntil({ openAt, recipientName, senderName, theme: themeId }: Props) {
  const router = useRouter()
  const target = new Date(openAt).getTime()
  const [remaining, setRemaining] = useState<number | null>(null)

  const theme = getTheme(themeId)
  const themed = theme.id !== 'classic'

  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now()
      setRemaining(diff)
      if (diff <= 0) router.refresh()
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [target, router])

  const { days, hours, minutes, seconds } = parts(remaining ?? 0)

  // Rendered on the server too — keep the date string stable and locale-fixed.
  const openDate = new Date(openAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-rose-50 via-cream to-pink-50"
      style={themed ? (envelopeCssVars(theme) as React.CSSProperties) : undefined}
    >
      <div className="max-w-md w-full text-center fade-in">
        <div className="text-6xl mb-6">⏳</div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-rose-900 mb-3">
          {recipientName ? `${recipientName}, this letter isn't ready yet` : 'This letter is still sealed'}
        </h1>

        <p className="text-rose-700/70 leading-relaxed mb-8">
          {senderName ? <><strong>{senderName}</strong> wrote it for you</> : 'Someone wrote it for you'} and
          asked us to keep it sealed until <strong>{openDate}</strong>. Come back then — the link stays the same.
        </p>

        {/* Countdown */}
        <div className="bg-white border border-rose-100 rounded-2xl shadow-paper px-4 py-6 mb-8">
          <div className="grid grid-cols-4 gap-2">
            {[
              { v: days, l: days === 1 ? 'day' : 'days' },
              { v: hours, l: 'hours' },
              { v: minutes, l: 'mins' },
              { v: seconds, l: 'secs' },
            ].map(({ v, l }) => (
              <div key={l}>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-rose-800 tabular-nums">
                  {remaining === null ? '--' : TWO_DIGITS(v)}
                </div>
                <div className="text-[11px] uppercase tracking-widest text-rose-400 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-rose-400 mb-8">
          🔐 The letter stays AES-256 encrypted until it opens — nobody can read it early.
        </p>

        <Link
          href="/write"
          className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
        >
          Write a Letter of Your Own — Free
        </Link>
      </div>
    </div>
  )
}
