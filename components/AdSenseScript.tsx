'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Controls where the AdSense loader is allowed to run.
//
// Standing rule: never place an ad on /write, /letter/*, or the auth flow —
// goal 4 (AdSense revenue) never beats goal 1 (a letter actually gets written)
// or goal 3 (the writing flow stays frictionless).
//
// Three things have to hold, and only the first is obvious:
//
// 1. HARD NAVIGATION — the loader must not run when you land on an excluded
//    route directly.
//
// 2. SOFT NAVIGATION — this is an SPA. Once the loader has run on any allowed
//    page, the <script> stays in the DOM and Auto Ads stays live across client
//    route changes. Measured on production 2026-08-18: /about -> click
//    "Write a Letter" landed on /write with the script still present and an
//    <ins class="adsbygoogle"> already injected into the editor. So the units
//    have to be actively removed, and Auto Ads retries, hence the observer.
//
// 3. NAVIGATING BACK OUT — and this is the one that bit the first attempt.
//    We used next/script here. It dedupes by src, so once the tag had been
//    removed on /write it never re-injected, and a user who so much as touched
//    the editor saw no ads for the rest of their session. That is goal 4 thrown
//    away for nothing. Hence plain DOM below: we own the tag, so we can take it
//    out and put it back.
//
// Auto Ads is a checkbox in the AdSense console, so none of this shows up in a
// diff. Turning Auto Ads off is the primary control; this file is what survives
// someone turning it back on.
//
// If you are tempted to move this back into app/layout.tsx to simplify: don't.
const NO_ADS = [
  '/write',      // the letter editor — the whole product
  '/letter',     // /letter/[id], what the recipient opens
  '/auth',       // sign-in and sign-up
  '/dashboard',  // logged-in surfaces, no editorial content to monetise
  '/profile',
  '/admin',
]

const SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1228680334439068'
const UNITS = 'ins.adsbygoogle, iframe[id^="aswift_"], iframe[name^="aswift_"], [id^="google_ads_iframe"]'

export default function AdSenseScript() {
  const pathname = usePathname()
  const blocked = NO_ADS.some(p => pathname === p || pathname.startsWith(`${p}/`))

  useEffect(() => {
    const existing = () => document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`)

    if (!blocked) {
      if (!existing()) {
        const s = document.createElement('script')
        s.src = SRC
        s.async = true
        s.crossOrigin = 'anonymous'
        document.body.appendChild(s)
      }
      return
    }

    const strip = () => document.querySelectorAll(UNITS).forEach(el => el.remove())
    existing()?.remove()
    strip()
    const observer = new MutationObserver(strip)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [blocked, pathname])

  return null
}
