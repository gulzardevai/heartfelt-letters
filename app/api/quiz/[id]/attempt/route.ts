import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { cleanEmail, cleanText, scoreAttempt, QUIZ_LIMITS, type Quiz } from '@/lib/quiz'

export const dynamic = 'force-dynamic'

// Cap attempts per IP per hour to contain spam of an anonymous UGC endpoint.
const ATTEMPT_HOURLY_LIMIT = 60

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }
    const b = (body ?? {}) as Record<string, unknown>

    const taker_name = cleanText(b.taker_name, QUIZ_LIMITS.takerName)
    if (!taker_name) {
      return NextResponse.json({ error: 'Please enter your name first.' }, { status: 400 })
    }

    const db = getSupabaseAdmin()
    const ip = getClientIp(req)

    if (ip !== 'unknown') {
      const since = new Date()
      since.setHours(since.getHours() - 1)
      const { count } = await db
        .from('quiz_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .gte('created_at', since.toISOString())
      if ((count ?? 0) >= ATTEMPT_HOURLY_LIMIT) {
        return NextResponse.json(
          { error: 'Too many attempts right now — please try again shortly.' },
          { status: 429 }
        )
      }
    }

    const { data: quiz, error: qErr } = await db
      .from('quizzes')
      .select('id, owner_token, title, creator_name, questions, created_at')
      .eq('id', params.id)
      .single()
    if (qErr || !quiz) {
      return NextResponse.json({ error: 'That quiz could not be found.' }, { status: 404 })
    }

    const { score, total, answers } = scoreAttempt(quiz as Quiz, b.answers)

    const { error } = await db.from('quiz_attempts').insert({
      quiz_id: quiz.id,
      taker_name,
      // Optional — invalid/empty emails become null; never reject the attempt.
      email: cleanEmail(b.email),
      answers,
      score,
      total,
      ip_address: ip,
    })
    if (error) throw error

    return NextResponse.json({ score, total, creator_name: quiz.creator_name }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to save your answers.' }, { status: 500 })
  }
}
