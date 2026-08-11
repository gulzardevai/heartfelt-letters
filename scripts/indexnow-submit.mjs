#!/usr/bin/env node
/**
 * IndexNow backfill — submit every URL in the live sitemap to Bing/Yandex.
 *
 *   node scripts/indexnow-submit.mjs               # submit the whole sitemap
 *   node scripts/indexnow-submit.mjs --dry-run     # print what would be sent
 *   node scripts/indexnow-submit.mjs /blog/foo     # submit specific URLs
 *   node scripts/indexnow-submit.mjs --self-test   # assert the exclusion rules
 *
 * Runtime submissions happen automatically from lib/indexnow.ts when a blog
 * post is published or edited. This script is for the initial backfill and for
 * any time the sitemap gains URLs without a write going through the app — e.g.
 * posts inserted straight into Postgres, which is the normal publishing path.
 *
 * The key must stay in sync with INDEXNOW_KEY in lib/indexnow.ts and with the
 * filename of public/<key>.txt.
 */
const SITE_URL = 'https://www.shareloveletters.com'
const KEY = process.env.INDEXNOW_KEY || '81508be3380da8b0c16747a4adb348bd'
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const BATCH_SIZE = 10000

// Mirrors PRIVATE_PREFIXES in lib/indexnow.ts. /letter is non-negotiable:
// letter pages are permanently noindex and contain a real person's private
// letter, so submitting one would leak its URL to a search engine.
const PRIVATE_PREFIXES = ['/api', '/auth', '/dashboard', '/profile', '/admin', '/letter']

const isPrivate = pathname =>
  PRIVATE_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`))

const DRY = process.argv.includes('--dry-run')
const explicit = process.argv.slice(2).filter(a => !a.startsWith('--'))

async function sitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`, { headers: { 'User-Agent': 'ShareLoveBot/1.0' } })
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`)
  const xml = await res.text()
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1].trim())
}

function selfTest() {
  const cases = [
    // [url, expected isPrivate]
    ['/letter/abc123', true],
    ['/letter', true],
    ['/letter/abc123/reply', true],
    ['/api/letters', true],
    ['/auth/login', true],
    ['/dashboard', true],
    ['/profile', true],
    ['/admin/blog', true],
    // Public pages that must NOT be caught by the /letter rule.
    ['/letters', false],
    ['/letters/love', false],
    ['/letter-themes', false],
    ['/printable-letter-templates', false],
    ['/blog/anonymous-love-letter-online', false],
    ['/', false],
  ]
  let failed = 0
  for (const [path, expected] of cases) {
    const actual = isPrivate(new URL(path, SITE_URL).pathname)
    const ok = actual === expected
    if (!ok) failed++
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${path} -> excluded=${actual} (expected ${expected})`)
  }
  console.log(failed === 0 ? '\nall exclusion assertions passed' : `\n${failed} assertion(s) FAILED`)
  process.exit(failed === 0 ? 0 : 1)
}

async function main() {
  if (process.argv.includes('--self-test')) return selfTest()

  const host = new URL(SITE_URL).host
  const raw = explicit.length ? explicit.map(u => new URL(u, SITE_URL).toString()) : await sitemapUrls()
  const urls = Array.from(new Set(raw)).filter(u => {
    try {
      const parsed = new URL(u)
      return parsed.host === host && !isPrivate(parsed.pathname)
    } catch {
      return false
    }
  })

  console.log(`${urls.length} URL(s) for ${host}`)
  if (DRY) {
    urls.forEach(u => console.log('  ' + u))
    console.log('\n[dry run] nothing submitted')
    return
  }

  // Prove the key file resolves before asking a search engine to fetch it.
  const keyRes = await fetch(`${SITE_URL}/${KEY}.txt`)
  const keyBody = keyRes.ok ? (await keyRes.text()).trim() : ''
  if (keyBody !== KEY) {
    throw new Error(`key file ${SITE_URL}/${KEY}.txt did not return the key (status ${keyRes.status})`)
  }

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE)
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE_URL}/${KEY}.txt`, urlList: batch }),
    })
    // 200 = accepted, 202 = accepted but key still being validated.
    // 403 SiteVerificationNotCompleted right after first deploy is normal —
    // Bing has not fetched the key file yet; re-run in a day.
    console.log(`batch ${i / BATCH_SIZE + 1}: ${batch.length} URL(s) -> HTTP ${res.status}`)
    if (res.status >= 400) console.log(await res.text())
  }
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
