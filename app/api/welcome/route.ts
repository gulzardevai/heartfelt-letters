import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { sendWelcomeEmailIfNew } from '@/lib/email'

export const dynamic = 'force-dynamic'

// Fallback trigger for signups that never pass through /auth/callback
// (e.g. email/password confirmation links). Dedup is handled in
// sendWelcomeEmailIfNew via a race-safe welcome_sent_at claim.
export async function POST() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await sendWelcomeEmailIfNew(user.id)
  return NextResponse.json({ ok: true })
}
