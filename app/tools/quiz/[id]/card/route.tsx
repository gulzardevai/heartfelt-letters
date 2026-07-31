import { ImageResponse } from 'next/og'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { cardElement, loadHeadingFont, OG_SIZE } from '@/lib/tools-og'
import type { CardData } from '@/lib/tools-result'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Branded 1200x630 unfurl card for a quiz share link, so pasting it into
// WhatsApp / iMessage / Discord shows an inviting "take my quiz" card.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  let card: CardData = {
    emoji: '💌',
    heading: 'How well do you know me?',
    big: '',
    sub: 'Take the quiz →',
    footer: 'ShareLove quiz',
  }

  try {
    const db = getSupabaseAdmin()
    const { data } = await db
      .from('quizzes')
      .select('creator_name, questions')
      .eq('id', params.id)
      .single()
    if (data) {
      const count = Array.isArray(data.questions) ? data.questions.length : 0
      card = {
        emoji: '❓💘',
        heading: `How well do you know ${data.creator_name}?`,
        big: '',
        sub: `${count} questions · can you beat the top score?`,
        footer: `A quiz by ${data.creator_name}`,
      }
    }
  } catch {
    /* fall back to the generic card */
  }

  const font = await loadHeadingFont()
  const serif = font ? 'Playfair Display' : 'serif'

  return new ImageResponse(cardElement(card, 'og', serif), {
    ...OG_SIZE,
    fonts: font ? [{ name: 'Playfair Display', data: font, weight: 700, style: 'normal' }] : undefined,
    headers: { 'Cache-Control': 'public, max-age=300' },
  })
}
