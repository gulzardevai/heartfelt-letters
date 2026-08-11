/**
 * IndexNow — push new or changed URLs to Bing / Yandex / Seznam the moment they
 * change instead of waiting to be crawled. (Google does not consume IndexNow;
 * this is free upside on the engines that feed Copilot and assistant search,
 * not a replacement for authority building.)
 *
 * The key is PUBLIC by design: ownership is proven by serving it as plain text
 * at https://<host>/<key>.txt. `public/<INDEXNOW_KEY>.txt` must therefore stay
 * in sync with this constant — rename the file if the key ever changes.
 */
const SITE_URL = 'https://www.shareloveletters.com'

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '81508be3380da8b0c16747a4adb348bd'

export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`

const ENDPOINT = 'https://api.indexnow.org/indexnow'
const BATCH_SIZE = 10_000
const TIMEOUT_MS = 4000

/** Set INDEXNOW=off in the environment to mute submissions without a deploy. */
const isEnabled = () => (process.env.INDEXNOW ?? 'on').toLowerCase() !== 'off'

/**
 * Never announce a URL that is gated, private or noindex — an IndexNow
 * submission must only ever mirror the sitemap.
 *
 * `/letter` is the load-bearing one: letter pages are permanently noindex and
 * hold a real person's private letter, so submitting one would hand its URL to
 * a search engine. Note the prefix match is exact-segment (`/letter` itself or
 * `/letter/...`), so the public `/letters` and `/letters/<occasion>` landing
 * pages are unaffected and still submittable.
 */
const PRIVATE_PREFIXES = ['/api', '/auth', '/dashboard', '/profile', '/admin', '/letter']

/**
 * Accepts absolute URLs or site-relative paths, returns absolute, deduped,
 * same-host, publicly indexable URLs. Exported so the exclusion rules above can
 * be asserted directly rather than only through a network call.
 */
export function normalizeIndexNowUrls(input: string[]): string[] {
  const host = new URL(SITE_URL).host
  const out = new Set<string>()
  for (const raw of input) {
    if (!raw) continue
    let url: URL
    try {
      url = new URL(raw, SITE_URL)
    } catch {
      continue
    }
    if (url.host !== host) continue
    if (PRIVATE_PREFIXES.some(p => url.pathname === p || url.pathname.startsWith(`${p}/`))) continue
    url.hash = ''
    url.search = ''
    out.add(url.toString())
  }
  return Array.from(out)
}

/**
 * Submit URLs to IndexNow. Fire-and-forget by contract: it resolves on every
 * path, never throws, and is time-bounded, so a caller can await it without
 * risking the mutation it just performed.
 */
export async function submitToIndexNow(urls: string[]): Promise<void> {
  try {
    if (!isEnabled()) return
    const urlList = normalizeIndexNowUrls(urls)
    if (urlList.length === 0) return

    const host = new URL(SITE_URL).host
    for (let i = 0; i < urlList.length; i += BATCH_SIZE) {
      const batch = urlList.slice(i, i + BATCH_SIZE)
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
        await fetch(ENDPOINT, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({
            host,
            key: INDEXNOW_KEY,
            keyLocation: INDEXNOW_KEY_LOCATION,
            urlList: batch,
          }),
        })
        clearTimeout(timer)
      } catch {
        // Search-engine pings are best-effort housekeeping; the sitemap remains
        // the source of truth, so a failure here must never surface to the user.
      }
    }
  } catch {
    // Belt and braces: nothing in this module may ever reject a caller.
  }
}

/** The public URLs a published blog post touches. */
export const blogIndexNowUrls = (slug: string): string[] => [
  `${SITE_URL}/blog/${slug}`,
  `${SITE_URL}/blog`,
]
