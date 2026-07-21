import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import bcrypt from 'bcryptjs'
import { encryptContent, decryptContent } from '@/lib/crypto'

export const dynamic = 'force-dynamic'

const MAX_REPLY_LENGTH = 1000
const REPLIES_PER_IP_PER_DAY = 5

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim()
}

async function getLetterWithPasswordCheck(shareId: string, password: string | null) {
  const db = getSupabaseAdmin()
  const { data: letter, error } = await db
    .from('letters')
    .select('id, has_password, password_hash, is_deleted')
    .eq('share_id', shareId)
    .single()

  if (error || !letter || letter.is_deleted) {
    return { error: NextResponse.json({ error: 'Letter not found' }, { status: 404 }) }
  }

  if (letter.has_password) {
    if (!password) {
      return { error: NextResponse.json({ error: 'Password required' }, { status: 401 }) }
    }
    const valid = await bcrypt.compare(password, letter.password_hash!)
    if (!valid) {
      return { error: NextResponse.json({ error: 'Incorrect password' }, { status: 401 }) }
    }
  }

  return { letter }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const password = req.nextUrl.searchParams.get('password')
    const { letter, error } = await getLetterWithPasswordCheck(params.id, password)
    if (error) return error

    const db = getSupabaseAdmin()
    const { data: replies, error: repliesError } = await db
      .from('letter_replies')
      .select('id, author_name, content, created_at')
      .eq('letter_id', letter.id)
      .order('created_at', { ascending: true })

    if (repliesError) throw repliesError

    return NextResponse.json({
      replies: (replies || []).map(r => ({
        id: r.id,
        author_name: r.author_name,
        content: decryptContent(r.content),
        created_at: r.created_at,
      })),
    })
  } catch (err) {
    console.error('Error fetching replies:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const content = stripHtml(String(body.content || ''))

    if (!content) {
      return NextResponse.json({ error: 'Reply cannot be empty' }, { status: 400 })
    }
    if (content.length > MAX_REPLY_LENGTH) {
      return NextResponse.json({ error: `Reply must be under ${MAX_REPLY_LENGTH} characters` }, { status: 400 })
    }

    const { letter, error } = await getLetterWithPasswordCheck(params.id, body.password || null)
    if (error) return error

    const db = getSupabaseAdmin()
    const ip = getClientIp(req)

    // Rate limit: 5 replies per IP per letter per day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count } = await db
      .from('letter_replies')
      .select('id', { count: 'exact', head: true })
      .eq('letter_id', letter.id)
      .eq('ip_address', ip)
      .gte('created_at', oneDayAgo)

    if ((count || 0) >= REPLIES_PER_IP_PER_DAY) {
      return NextResponse.json(
        { error: 'You\'ve reached the reply limit for this letter today. Come back tomorrow 💌' },
        { status: 429 }
      )
    }

    // Author identity from session (if any)
    const serverSupabase = createSupabaseServerClient()
    const { data: { user } } = await serverSupabase.auth.getUser()
    let authorName: string | null = null
    if (user) {
      const { data: profile } = await db
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
      authorName = profile?.full_name || user.email?.split('@')[0] || null
    }

    const { data: reply, error: insertError } = await db
      .from('letter_replies')
      .insert({
        letter_id: letter.id,
        user_id: user?.id || null,
        author_name: authorName,
        content: encryptContent(content),
        ip_address: ip,
      })
      .select('id, author_name, created_at')
      .single()

    if (insertError) throw insertError

    return NextResponse.json({
      reply: {
        id: reply.id,
        author_name: reply.author_name,
        content,
        created_at: reply.created_at,
      },
    })
  } catch (err) {
    console.error('Error posting reply:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
