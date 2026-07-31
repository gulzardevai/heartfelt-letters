import { ImageResponse } from 'next/og'
import { decodeState } from '@/lib/tools-share'
import { cardFor } from '@/lib/tools-result'
import { cardElement, loadHeadingFont, OG_SIZE } from '@/lib/tools-og'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

// Landscape 1200x630 social-unfurl card for a result permalink.
export async function GET(_req: Request, { params }: { params: { slug: string; data: string } }) {
  const state = decodeState(params.data)
  const card = cardFor(params.slug, state)
  const font = await loadHeadingFont()
  const serif = font ? 'Playfair Display' : 'serif'

  return new ImageResponse(cardElement(card, 'og', serif), {
    ...OG_SIZE,
    fonts: font ? [{ name: 'Playfair Display', data: font, weight: 700, style: 'normal' }] : undefined,
    headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
  })
}
