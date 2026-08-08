import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// Mirrors FREE_EXPIRY_DAYS in app/api/letters/route.ts — the free-plan window a
// letter earns once it belongs to an account.
const FREE_EXPIRY_DAYS = 30

// Attach a guest letter to the account that just signed up.
//
// The share_id is the capability here: it is a 10-char nanoid that only the
// person who wrote the letter (or someone they sent it to) has seen. That is
// the same secret that already grants read access to /letter/[id], so claiming
// grants no access the caller did not already have — it only records ownership
// so the sender can watch opens and replies from the dashboard.
//
// Only unowned letters can be claimed. A letter that already has a user_id is
// never reassigned, so a recipient cannot take a letter away from its author.
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serverSupabase = createSupabaseServerClient()
    const { data: { user } } = await serverSupabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getSupabaseAdmin()
    const { data: letter, error } = await db
      .from('letters')
      .select('id, user_id, is_deleted, created_at, open_at')
      .eq('share_id', params.id)
      .single()

    if (error || !letter || letter.is_deleted === true) {
      return NextResponse.json({ error: 'Letter not found' }, { status: 404 })
    }

    if (letter.user_id === user.id) {
      return NextResponse.json({ claimed: true, alreadyOwned: true })
    }

    if (letter.user_id) {
      return NextResponse.json({ error: 'This letter already belongs to an account' }, { status: 409 })
    }

    // A guest letter is written with ANON_EXPIRY_DAYS (7); once it belongs to
    // an account it earns the free-plan window (30), measured from the same
    // base the POST route uses so a scheduled letter still outlives its own
    // opening date. Without this the offer would promise a longer life than it
    // actually delivers.
    const base = letter.open_at ? new Date(letter.open_at) : new Date(letter.created_at)
    base.setDate(base.getDate() + FREE_EXPIRY_DAYS)

    // Re-check ownership inside the write so two tabs racing the same claim
    // cannot both succeed.
    const { data: updated, error: updateError } = await db
      .from('letters')
      .update({ user_id: user.id, expires_at: base.toISOString() })
      .eq('id', letter.id)
      .is('user_id', null)
      .select('id')

    if (updateError) {
      return NextResponse.json({ error: 'Could not claim this letter' }, { status: 500 })
    }

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: 'This letter already belongs to an account' }, { status: 409 })
    }

    return NextResponse.json({ claimed: true })
  } catch {
    return NextResponse.json({ error: 'Could not claim this letter' }, { status: 500 })
  }
}
