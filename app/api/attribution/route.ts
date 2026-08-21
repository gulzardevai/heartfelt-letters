import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sanitizeAttribution, ATTRIBUTION_MAX_PROFILE_AGE_MS } from '@/lib/attribution'

export const dynamic = 'force-dynamic'

/**
 * Stamps the signup's first touch onto the caller's own profiles row. The row
 * itself is created by the on_auth_user_created trigger, so the app can only
 * update it — and only ever its own (the id comes from the session, never the
 * request body).
 *
 * Write-once, and only for an account created within the last 24h: an older
 * profile picking up today's referrer would be a fabricated cohort, and rows
 * that predate this feature must stay NULL rather than be guessed at.
 */
export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const attribution = sanitizeAttribution(await request.json().catch(() => null))
  if (!attribution) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('created_at, first_seen_at')
    .eq('id', user.id)
    .single()

  if (!profile || profile.first_seen_at) return NextResponse.json({ ok: true, written: false })
  const createdAt = profile.created_at ? new Date(profile.created_at).getTime() : NaN
  if (Number.isNaN(createdAt) || Date.now() - createdAt > ATTRIBUTION_MAX_PROFILE_AGE_MS) {
    return NextResponse.json({ ok: true, written: false })
  }

  // is('first_seen_at', null) keeps a double-fire idempotent: only NULL columns
  // are ever written, an existing attribution is never overwritten.
  await supabaseAdmin.from('profiles').update(attribution).eq('id', user.id).is('first_seen_at', null)

  return NextResponse.json({ ok: true, written: true })
}
