'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// The AdSense loader is deliberately NOT in the root layout.
//
// Standing rule: never place an ad on /write, /letter/*, or the auth flow —
// goal 4 (AdSense revenue) never beats goal 1 (a letter actually gets written)
// or goal 3 (the writing flow stays frictionless).
//
// Two separate things have to be true, and the second is easy to miss:
//
// 1. HARD NAVIGATION — don't load the script at all on an excluded route.
//    Handled by the conditional render below.
//
// 2. SOFT NAVIGATION — this is an SPA. Once the loader has run on, say, /about,
//    the <script> tag stays in the DOM and the Auto Ads logic stays live across
//    client-side route changes. Verified on production 2026-08-18: clicking a
//    "Write a Letter" link from /about landed on /write with the script still
//    present AND an <ins class="adsbygoogle"> unit already injected into the
//    editor. Not rendering the component is NOT enough — the units have to be
//    actively removed, and Auto Ads keeps trying, so it needs an observer
//    rather than a one-shot cleanup.
//
// Auto Ads is a checkbox in the AdSense console, so none of this shows up in a
// diff. Turning Auto Ads off in the console is the primary control; this file
// is the belt-and-braces that survives someone turning it back on.
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

const AD_SELECTOR = 'ins.adsbygoogle, iframe[id^="aswift_"], iframe[name^="aswift_"], [id^="google_ads_iframe"]'

function stripAds() {
  document.querySelectorAll(AD_SELECTOR).forEach(el => el.remove())
}

export default function AdSenseScript() {
  const pathname = usePathname()
  const blocked = NO_ADS.some(p => pathname === p || pathname.startsWith(`${p}/`))

  useEffect(() => {
    if (!blocked) return
    // Drop the loader so a later route change cannot re-run it, then keep
    // removing anything Auto Ads injects for as long as we are on this route.
    document
      .querySelectorAll('script[src*="adsbygoogle"]')
      .forEach(el => el.remove())
    stripAds()
    const observer = new MutationObserver(stripAds)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [blocked, pathname])

  if (blocked) return null

  return (
    <Script
      async
      strategy="lazyOnload"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1228680334439068"
      crossOrigin="anonymous"
    />
  )
}
