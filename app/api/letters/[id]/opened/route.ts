import { NextRequest, NextResponse } from 'next/server'
import { notifyLetterOpened } from '@/lib/email'

export const dynamic = 'force-dynamic'

// Pinged by the envelope the moment a reader breaks the seal.
//
// Deliberately unauthenticated: the share_id is the capability, exactly as it
// is for reading the letter, and the only effect is the one email the author
// was promised. notifyLetterOpened() sends at most once per letter (it claims
// letters.opened_notified_at), only for letters that belong to an account, and
// never for the author's own opens — so this cannot be used to generate mail.
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await notifyLetterOpened(params.id, req.headers.get('user-agent'))
  return NextResponse.json({ ok: true })
}
