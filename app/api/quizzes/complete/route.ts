import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { cleanEmail, cleanText } from '@/lib/quiz'

export const dynamic = 'force-dynamic'

// Cap stored attempts per IP per quiz per day — the counter still increments.
const ATTEMPT_DAILY_LIMIT = 10

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

// Completion endpoint for admin-authored quizzes: bumps completed_count and,
// when a name + result are provided, stores the attempt (lead capture).
// Email is always optional — an invalid email becomes null, never a rejection.
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

    // Store the attempt row (best-effort — the counter above already succeeded).
    const name = cleanText(body?.name, 60)
    const result_key = String(body?.result_key ?? '').trim().toLowerCase().slice(0, 32)
    if (name && result_key) {
      const { data: quiz } = await db
        .from('admin_quizzes')
        .select('id')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (quiz) {
        const ip = getClientIp(req)
        let allowed = true
        if (ip !== 'unknown') {
          const since = new Date()
          since.setDate(since.getDate() - 1)
          const { count } = await db
            .from('admin_quiz_attempts')
            .select('*', { count: 'exact', head: true })
            .eq('quiz_id', quiz.id)
            .eq('ip_address', ip)
            .gte('created_at', since.toISOString())
          if ((count ?? 0) >= ATTEMPT_DAILY_LIMIT) allowed = false
        }
        if (allowed) {
          await db.from('admin_quiz_attempts').insert({
            quiz_id: quiz.id,
            name,
            email: cleanEmail(body?.email),
            result_key,
            ip_address: ip,
          })
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}
