'use client'

import { useEffect, useState } from 'react'
import { BADGES, BADGE_ROTATE_MS } from '@/lib/badges'

// Every badge is always mounted and always in the SSR HTML — see lib/badges.ts.
// Rotation only toggles opacity. Do not "optimise" this into conditional rendering.
export default function BadgeStrip() {
  const rotates = BADGES.length > 1
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!rotates) return

    let timer: ReturnType<typeof setInterval> | null = null

    const stop = () => {
      if (timer) clearInterval(timer)
      timer = null
    }
    const start = () => {
      stop()
      timer = setInterval(() => {
        setActive((i) => (i + 1) % BADGES.length)
      }, BADGE_ROTATE_MS)
    }

    const onVisibility = () => (document.hidden ? stop() : start())

    if (!document.hidden) start()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [rotates])

  if (!BADGES.length) return null

  return (
    <div className="border-t border-rose-100 pt-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
      <h4 className="text-xs uppercase tracking-wide text-rose-400 shrink-0">Featured on</h4>
      <div
        aria-live="off"
        className={
          rotates
            ? 'relative h-[54px] w-[207px] motion-reduce:h-auto motion-reduce:w-auto motion-reduce:flex motion-reduce:flex-wrap motion-reduce:items-center motion-reduce:gap-4'
            : 'flex flex-wrap items-center gap-4'
        }
      >
        {BADGES.map((badge, i) => (
          <a
            key={badge.listingUrl}
            href={badge.listingUrl}
            target="_blank"
            rel="noopener"
            aria-label={`Featured on ${badge.name}`}
            className={
              rotates
                ? `absolute inset-0 transition-opacity duration-[400ms] motion-reduce:static motion-reduce:opacity-100 motion-reduce:pointer-events-auto motion-reduce:transition-none ${
                    i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`
                : 'inline-block'
            }
          >
            <img
              src={badge.imgSrc}
              alt={badge.name}
              width={badge.width}
              height={badge.height}
              loading="lazy"
              className="h-[54px] w-auto max-w-full"
            />
          </a>
        ))}
      </div>
    </div>
  )
}
