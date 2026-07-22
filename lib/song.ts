// "Our song" attachments — link only, no file hosting.
// A letter's `song_url` column stores the original URL the sender pasted.
// Embeds are always rebuilt from a validated id, never from raw user input,
// so an arbitrary URL can never end up as an iframe src.

export type Song = {
  provider: 'spotify' | 'apple' | 'youtube'
  label: string
  embedUrl: string
  linkUrl: string
  height: number
}

const SPOTIFY_KINDS = ['track', 'album', 'playlist', 'episode'] as const
const APPLE_KINDS = ['album', 'song', 'playlist', 'music-video']

const ID_RE = /^[A-Za-z0-9._-]{1,64}$/

function safeUrl(raw: string): URL | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null
  } catch {
    return null
  }
}

export function parseSong(raw: unknown): Song | null {
  if (!raw || typeof raw !== 'string') return null
  const url = safeUrl(raw)
  if (!url) return null

  const host = url.hostname.replace(/^www\./, '').toLowerCase()
  const segments = url.pathname.split('/').filter(Boolean)

  // Spotify — open.spotify.com/track/<id>, optionally with an /intl-xx/ prefix
  if (host === 'open.spotify.com' || host === 'spotify.com') {
    const parts = segments[0]?.startsWith('intl-') ? segments.slice(1) : segments
    const kind = parts[0]
    const id = parts[1]
    if (!kind || !id || !ID_RE.test(id)) return null
    if (!(SPOTIFY_KINDS as readonly string[]).includes(kind)) return null
    return {
      provider: 'spotify',
      label: 'Listen on Spotify',
      embedUrl: `https://open.spotify.com/embed/${kind}/${id}`,
      linkUrl: `https://open.spotify.com/${kind}/${id}`,
      height: kind === 'track' ? 152 : 352,
    }
  }

  // Apple Music — music.apple.com/<country>/<kind>/<slug>/<id>?i=<trackId>
  if (host === 'music.apple.com' || host === 'embed.music.apple.com') {
    const country = segments[0]
    const kind = segments[1]
    if (!country || !/^[a-z]{2}$/i.test(country)) return null
    if (!kind || !APPLE_KINDS.includes(kind)) return null
    if (segments.length < 3) return null
    if (!segments.every(s => ID_RE.test(s))) return null
    const path = segments.join('/')
    const track = url.searchParams.get('i')
    const query = track && ID_RE.test(track) ? `?i=${track}` : ''
    return {
      provider: 'apple',
      label: 'Listen on Apple Music',
      embedUrl: `https://embed.music.apple.com/${path}${query}`,
      linkUrl: `https://music.apple.com/${path}${query}`,
      height: track || kind === 'song' ? 175 : 450,
    }
  }

  // YouTube — youtube.com/watch?v=<id>, youtu.be/<id>, music.youtube.com/watch?v=<id>
  if (host === 'youtube.com' || host === 'music.youtube.com' || host === 'youtu.be') {
    const id = host === 'youtu.be'
      ? segments[0]
      : segments[0] === 'shorts' || segments[0] === 'embed'
        ? segments[1]
        : url.searchParams.get('v')
    if (!id || !ID_RE.test(id)) return null
    return {
      provider: 'youtube',
      label: 'Watch on YouTube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
      linkUrl: `https://www.youtube.com/watch?v=${id}`,
      height: 200,
    }
  }

  return null
}

export function isSupportedSongUrl(raw: string): boolean {
  return parseSong(raw) !== null
}
