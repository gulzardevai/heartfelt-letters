'use client'

import { useEffect, useState } from 'react'
import { Bouquet } from '@/lib/bouquets'
import BouquetArt from '@/components/BouquetArt'

interface Props {
  bouquet: Bouquet
  senderName?: string | null
  recipientName?: string | null
  onContinue: () => void
}

const PETALS = [
  { left: '8%', delay: '0s' }, { left: '24%', delay: '1.4s' }, { left: '41%', delay: '0.6s' },
  { left: '58%', delay: '2.1s' }, { left: '74%', delay: '1s' }, { left: '90%', delay: '2.8s' },
]

export default function BouquetReveal({ bouquet, senderName, recipientName, onContinue }: Props) {
  const [showCta, setShowCta] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowCta(true), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-rose-50 via-cream to-pink-50">
      {/* Drifting petals */}
      {PETALS.map((p, i) => (
        <span key={i} className="bouquet-petal-fall" style={{ left: p.left, animationDelay: p.delay }} aria-hidden="true">
          {bouquet.emoji}
        </span>
      ))}

      <div className="relative text-center max-w-md w-full">
        <p className="text-xs uppercase tracking-[0.2em] text-rose-400 mb-4 fade-in">
          Flowers arrived first
        </p>

        <BouquetArt bouquet={bouquet} animate className="w-56 sm:w-64 h-auto mx-auto drop-shadow-lg" />

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-rose-900 mt-8 mb-2 fade-in" style={{ animationDelay: '0.7s', opacity: 0 }}>
          {senderName ? `${senderName} sent you ${bouquet.label.toLowerCase()}` : `Someone sent you ${bouquet.label.toLowerCase()}`}
        </h1>
        <p className="text-rose-700/60 text-sm fade-in" style={{ animationDelay: '0.9s', opacity: 0 }}>
          {recipientName ? `For you, ${recipientName}` : 'For you'} — and there&apos;s a letter with them.
        </p>

        <button
          onClick={onContinue}
          className={`mt-10 bg-rose-600 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-rose-700 transition-all shadow-md ${
            showCta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          Read the letter →
        </button>
      </div>
    </div>
  )
}
