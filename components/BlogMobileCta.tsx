'use client'

import { useEffect, useState } from 'react'
import { sendGAEvent } from '@next/third-parties/google'

// Mobile-only sticky CTA for blog posts: most mobile readers never reach the
// end-of-post CTA, so this floats after a bit of scrolling.
export default function BlogMobileCta() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // appear once the reader has actually started reading (~1.5 screens)
      setVisible(window.scrollY > window.innerHeight * 1.2)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (dismissed) return null

  return (
    <div
      className={`lg:hidden fixed bottom-4 left-4 right-4 z-40 transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative bg-white/95 backdrop-blur-md border border-rose-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
        <span className="text-2xl envelope-wiggle shrink-0">💌</span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-rose-900 leading-tight">Someone deserves a letter from you</p>
          <p className="text-[11px] text-rose-500">Free · no account · takes 2 minutes</p>
        </div>
        <a
          href="/write"
          onClick={() => sendGAEvent('event', 'blog_mobile_cta_clicked', {})}
          className="cta-heartbeat shrink-0 bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md whitespace-nowrap"
        >
          Write Now
        </a>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-100 text-rose-500 text-xs leading-none flex items-center justify-center border border-rose-200"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
