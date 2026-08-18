'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

// The AdSense loader is deliberately NOT in the root layout.
//
// Standing rule: never place an ad on /write, /letter/*, or the auth flow —
// goal 4 (AdSense revenue) never beats goal 1 (a letter actually gets written)
// or goal 3 (the writing flow stays frictionless).
//
// The rule cannot be enforced by "just don't add an <ins> unit there", because
// Auto Ads is a checkbox in the AdSense console, not a line of code: switching
// it on injects units into every page this script runs on, with no commit and
// nothing for a reviewer to see in a diff. So the enforcement has to live here,
// at the point where the script is loaded at all.
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

export default function AdSenseScript() {
  const pathname = usePathname()
  if (NO_ADS.some(p => pathname === p || pathname.startsWith(`${p}/`))) return null

  return (
    <Script
      async
      strategy="lazyOnload"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1228680334439068"
      crossOrigin="anonymous"
    />
  )
}
