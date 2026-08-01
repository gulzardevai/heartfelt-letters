import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// Anonymous completion counter for admin-authored quizzes. No PII — just bumps
// completed_count on the published quiz row.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const slug = String(body?.slug ?? '').trim().toLowerCase()
    if (!slug || slug.length > 60) {
      return NextResponse.json({ error: 'Invalid quiz.' }, { status: 400 })
    }

    const db = getSupabaseAdmin()
    const { error } = await db.rpc('increment_admin_quiz_completions', { quiz_slug: slug })
    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}
