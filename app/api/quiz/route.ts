import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { validateQuizInput } from '@/lib/quiz'

export const dynamic = 'force-dynamic'

// Anonymous UGC endpoint — cap how many quizzes a single IP can spin up per day.
const CREATE_DAILY_LIMIT = 20

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const parsed = validateQuizInput(body)
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const db = getSupabaseAdmin()
    const ip = getClientIp(req)

    if (ip !== 'unknown') {
      const since = new Date()
      since.setHours(since.getHours() - 24)
      const { count } = await db
        .from('quizzes')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .gte('created_at', since.toISOString())
      if ((count ?? 0) >= CREATE_DAILY_LIMIT) {
        return NextResponse.json(
          { error: 'You have created a lot of quizzes today — please try again tomorrow.' },
          { status: 429 }
        )
      }
    }

    const id = nanoid(8)
    const owner_token = nanoid(24)

    const { error } = await db.from('quizzes').insert({
      id,
      owner_token,
      title: parsed.data.title,
      creator_name: parsed.data.creator_name,
      questions: parsed.data.questions,
      ip_address: ip,
    })
    if (error) throw error

    return NextResponse.json({ id, owner_token }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create quiz.' }, { status: 500 })
  }
}
