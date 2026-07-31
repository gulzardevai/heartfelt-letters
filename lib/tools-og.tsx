// Server-only branded result card, rendered by Satori (next/og) for both the
// social-unfurl image (landscape 1200x630) and the downloadable IG/TikTok
// Story image (portrait 1080x1920). Matches the site's rose/cream palette.
import type { CardData } from './tools-result'

export const OG_SIZE = { width: 1200, height: 630 }
export const STORY_SIZE = { width: 1080, height: 1920 }

const CREAM = '#fdf8f0'
const ROSE_600 = '#e11d48'
const ROSE_700 = '#be123c'
const ROSE_900 = '#881337'
const ROSE_400 = '#fb7185'

// Google Fonts .ttf for Playfair Display 700 — fetched once per lambda, with a
// graceful null fallback so the card still renders if the fetch fails.
let fontCache: ArrayBuffer | null | undefined
export async function loadHeadingFont(): Promise<ArrayBuffer | null> {
  if (fontCache !== undefined) return fontCache
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    ).then(r => r.text())
    const url = css.match(/src:\s*url\((.+?)\)\s*format/)?.[1]
    fontCache = url ? await fetch(url).then(r => r.arrayBuffer()) : null
  } catch {
    fontCache = null
  }
  return fontCache ?? null
}

export function cardElement(card: CardData, format: 'og' | 'story', serif: string) {
  const story = format === 'story'
  const pad = story ? 96 : 72
  const emojiSize = story ? 150 : 96
  const headingSize = story ? 84 : 60
  const bigSize = story ? 260 : 180
  const subSize = story ? 44 : 34
  const brandSize = story ? 40 : 30

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: pad,
        background: `linear-gradient(150deg, ${CREAM} 0%, #fdeef0 55%, #fce7ea 100%)`,
        color: ROSE_900,
      }}
    >
      {/* Brand wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: ROSE_600, fontSize: brandSize, fontWeight: 700 }}>
        <span style={{ fontSize: brandSize + 6 }}>💌</span>
        <span style={{ fontFamily: serif }}>ShareLove Letters</span>
      </div>

      {/* Result */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 }}>
        <div style={{ fontSize: emojiSize, lineHeight: 1 }}>{card.emoji}</div>
        {card.footer ? (
          <div style={{ fontSize: subSize - 8, letterSpacing: 3, textTransform: 'uppercase', color: ROSE_400, marginTop: story ? 28 : 18 }}>
            {card.footer}
          </div>
        ) : null}
        <div style={{ display: 'flex', fontFamily: serif, fontSize: headingSize, fontWeight: 700, color: ROSE_900, marginTop: 12, maxWidth: story ? 900 : 1000, lineHeight: 1.1 }}>
          {card.heading}
        </div>
        {card.big ? (
          <div style={{ display: 'flex', fontFamily: serif, fontSize: bigSize, fontWeight: 700, color: ROSE_600, lineHeight: 1, marginTop: story ? 24 : 8 }}>
            {card.big}
          </div>
        ) : null}
        {card.sub ? (
          <div style={{ display: 'flex', fontSize: subSize, color: ROSE_700, marginTop: story ? 28 : 16, maxWidth: story ? 880 : 980 }}>
            {card.sub}
          </div>
        ) : null}
      </div>

      {/* Footer / CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        {story ? (
          <div style={{ display: 'flex', fontSize: subSize - 2, color: ROSE_700, fontWeight: 600 }}>
            Write them a real letter — free 💌
          </div>
        ) : null}
        <div style={{ display: 'flex', fontSize: brandSize - 4, color: ROSE_400 }}>shareloveletters.com</div>
      </div>
    </div>
  )
}
