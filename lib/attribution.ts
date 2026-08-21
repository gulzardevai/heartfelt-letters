/**
 * First-touch acquisition attribution, persisted in Postgres.
 *
 * GA4 answers "where did the session come from"; this answers "where did THIS
 * ACCOUNT come from", queryable from SQL and independent of any analytics
 * vendor (or of any Google API being enabled).
 *
 * Capture happens once, client-side, on the visitor's first page view and is
 * stored in localStorage — reading document.referrer at signup time is
 * worthless, because by then the referrer is almost always one of our own
 * pages. First touch wins: a stored value is never overwritten.
 *
 * Privacy: the referrer is stored origin + pathname only (query string and hash
 * stripped, so no tokens ever land in the database), same-origin referrers are
 * dropped, and only the UTM parameters are kept from our own URL. Nothing here
 * touches letters, and nothing here adds a step to writing one.
 */

export type Attribution = {
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  landing_path: string | null
  first_seen_at: string | null
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

const STORAGE_KEY = 'sll_attribution'
const SYNC_FLAG = 'sll_attribution_synced'
// Never attribute an account that already existed before this page view: an old
// profile picking up today's referrer would be a guess, not a record.
export const ATTRIBUTION_MAX_PROFILE_AGE_MS = 24 * 60 * 60 * 1000

const clean = (value: unknown, max: number): string | null => {
  const s = String(value ?? '').trim()
  return s ? s.slice(0, max) : null
}

/** origin + pathname only — query strings (and any token in them) are dropped. */
const stripQuery = (url: string): string | null => {
  try {
    const u = new URL(url)
    if (!/^https?:$/.test(u.protocol)) return null
    return `${u.origin}${u.pathname}`.replace(/\/$/, '') || u.origin
  } catch {
    return null
  }
}

/** Shapes untrusted client input into exactly the columns we store. */
export function sanitizeAttribution(input: unknown): Attribution | null {
  if (!input || typeof input !== 'object') return null
  const raw = input as Record<string, unknown>

  const referrer = raw.referrer ? stripQuery(String(raw.referrer)) : null
  const landingPath = clean(raw.landing_path, 300)
  const firstSeen = raw.first_seen_at ? new Date(String(raw.first_seen_at)) : null

  const out: Attribution = {
    referrer: referrer ? referrer.slice(0, 500) : null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    landing_path: landingPath && landingPath.startsWith('/') ? landingPath.split('?')[0] : null,
    first_seen_at:
      firstSeen && !Number.isNaN(firstSeen.getTime()) && firstSeen.getTime() <= Date.now() + 60_000
        ? firstSeen.toISOString()
        : new Date().toISOString(),
  }
  for (const key of UTM_KEYS) out[key] = clean(raw[key], 200)
  return out
}

/** Client — records the first touch. No-op once a value is stored. */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return
  try {
    if (window.localStorage.getItem(STORAGE_KEY)) return

    const params = new URLSearchParams(window.location.search)
    const ref = document.referrer || ''
    const refHost = ref ? stripQuery(ref) : null
    // Same-origin referrers carry no acquisition signal.
    const external = refHost && !refHost.startsWith(window.location.origin) ? refHost : null

    const attribution: Attribution = {
      referrer: external,
      utm_source: clean(params.get('utm_source'), 200),
      utm_medium: clean(params.get('utm_medium'), 200),
      utm_campaign: clean(params.get('utm_campaign'), 200),
      utm_content: clean(params.get('utm_content'), 200),
      utm_term: clean(params.get('utm_term'), 200),
      landing_path: window.location.pathname.slice(0, 300),
      first_seen_at: new Date().toISOString(),
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    /* private mode / storage disabled — attribution is best-effort */
  }
}

/** Client — the stored first touch. */
export function readAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attribution) : null
  } catch {
    return null
  }
}

/**
 * Client — writes the first touch onto a freshly created profile row (the row
 * is created by the on_auth_user_created trigger, so it cannot carry this, and
 * a write placed in either sign-in handler would miss the other path).
 * Fires at most once per browser session, and only for an account created in
 * the last 24h that has no attribution yet, so returning users never cost an
 * extra request.
 */
export function syncAttributionToProfile(profile: { created_at?: string | null; first_seen_at?: string | null }): void {
  if (typeof window === 'undefined') return
  if (profile.first_seen_at) return
  const createdAt = profile.created_at ? new Date(profile.created_at).getTime() : NaN
  if (Number.isNaN(createdAt) || Date.now() - createdAt > ATTRIBUTION_MAX_PROFILE_AGE_MS) return
  try {
    if (window.sessionStorage.getItem(SYNC_FLAG)) return
    window.sessionStorage.setItem(SYNC_FLAG, '1')
  } catch {
    /* ignore */
  }
  const attribution = readAttribution() || {
    referrer: null,
    landing_path: window.location.pathname,
    first_seen_at: new Date().toISOString(),
  }
  fetch('/api/attribution', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attribution),
    keepalive: true,
  }).catch(() => {})
}
