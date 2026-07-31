// URL-encoded shareable result state for the /tools result permalinks.
// No backend / no DB: a result encodes its inputs into a single base64url path
// segment, so opening /tools/<slug>/r/<data> re-renders the exact result.
// Isomorphic (client, node and edge runtimes) — uses global btoa/atob +
// TextEncoder/TextDecoder, never Buffer.

export const SITE = 'https://www.shareloveletters.com'

function toB64url(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

export function encodeState(state: unknown): string {
  return toB64url(new TextEncoder().encode(JSON.stringify(state)))
}

export function decodeState<T = any>(data: string): T | null {
  try {
    return JSON.parse(new TextDecoder().decode(fromB64url(data))) as T
  } catch {
    return null
  }
}

// The shareable result page (what a person opens).
export function resultPermalink(slug: string, state: unknown): string {
  return `${SITE}/tools/${slug}/r/${encodeState(state)}`
}

// Same route + /card (landscape 1200x630 for social unfurl) or /story
// (portrait 1080x1920 for IG / TikTok Stories download).
export function cardImageUrl(slug: string, state: unknown): string {
  return `${SITE}/tools/${slug}/r/${encodeState(state)}/card`
}

export function storyImageUrl(slug: string, state: unknown): string {
  return `${SITE}/tools/${slug}/r/${encodeState(state)}/story`
}
