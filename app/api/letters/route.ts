import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import { encryptContent } from '@/lib/crypto'
import { BOUQUETS } from '@/lib/bouquets'
import { parseSong } from '@/lib/song'

export const dynamic = 'force-dynamic'

const FREE_MONTHLY_LIMIT = 10
const ANON_DAILY_LIMIT = 1
const FREE_EXPIRY_DAYS = 30
const ANON_EXPIRY_DAYS = 7

const MAX_SCHEDULE_YEARS = 10

// Returns a validated future ISO date, or null if not scheduled / invalid.
function parseOpenAt(value: unknown): string | null {
  if (!value || typeof value !== 'string') return null
  const when = new Date(value)
  if (isNaN(when.getTime())) return null
  if (when.getTime() <= Date.now()) return null
  const max = new Date()
  max.setFullYear(max.getFullYear() + MAX_SCHEDULE_YEARS)
  if (when > max) return null
  return when.toISOString()
}

// Only ids we actually know how to draw make it into the database.
function parseBouquet(value: unknown): string | null {
  if (!value || typeof value !== 'string') return null
  return BOUQUETS.some(b => b.id === value) ? value : null
}

// Only links we can actually embed are stored; anything else is dropped.
function parseSongUrl(value: unknown): string | null {
  return parseSong(value) ? (value as string).trim() : null
}

// A scheduled letter must outlive its own opening date.
function expiryFor(openAt: string | null, days: number): string {
  const base = openAt ? new Date(openAt) : new Date()
  base.setDate(base.getDate() + days)
  return base.toISOString()
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  try {
    const db = getSupabaseAdmin()
    const serverSupabase = createSupabaseServerClient()
    const { data: { user } } = await serverSupabase.auth.getUser()

    const body = await req.json()
    const { title, type, content, recipient_name, sender_name, password, has_password, theme } = body

    if (!type || !content) {
      return NextResponse.json({ error: 'type and content are required' }, { status: 400 })
    }

    const open_at = parseOpenAt(body.open_at)
    const bouquet = parseBouquet(body.bouquet)
    const song_url = parseSongUrl(body.song_url)
    const share_id = nanoid(10)
    let password_hash: string | null = null
    if (has_password && password) {
      password_hash = await bcrypt.hash(password, 10)
    }

    if (user) {
      // Logged-in user: 10 letters per rolling 30 days
      const since = new Date()
      since.setDate(since.getDate() - 30)

      const { count } = await db
        .from('letters')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .gte('created_at', since.toISOString())

      if ((count ?? 0) >= FREE_MONTHLY_LIMIT) {
        return NextResponse.json({
          error: 'You\'ve reached 10 letters this month. Your limit resets on a rolling 30-day basis.',
          code: 'LIMIT_REACHED'
        }, { status: 403 })
      }

      const expires_at = expiryFor(open_at, FREE_EXPIRY_DAYS)

      const { data: letter, error } = await db.from('letters').insert({
        share_id,
        user_id: user.id,
        ip_address: getClientIp(req),
        title: title || null,
        type,
        content: encryptContent(content),
        recipient_name: recipient_name || null,
        sender_name: sender_name || null,
        theme: theme || 'classic',
        bouquet,
        song_url,
        has_password: !!(has_password && password),
        password_hash,
        open_at,
        expires_at,
      }).select().single()

      if (error) throw error

      try { await db.rpc('increment_letter_count', { uid: user.id }) } catch {}

      return NextResponse.json({ share_id: letter.share_id, id: letter.id }, { status: 201 })

    } else {
      // Anonymous: 1 letter per IP per day
      const ip = getClientIp(req)
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)

      const { count } = await db
        .from('letters')
        .select('*', { count: 'exact', head: true })
        .is('user_id', null)
        .eq('ip_address', ip)
        .gte('created_at', startOfDay.toISOString())

      if ((count ?? 0) >= ANON_DAILY_LIMIT) {
        return NextResponse.json({
          error: 'Anonymous users can create 1 letter per day. Sign up free for 10 letters per month.',
          code: 'ANON_LIMIT_REACHED'
        }, { status: 429 })
      }

      const expires_at = expiryFor(open_at, ANON_EXPIRY_DAYS)

      const { data: letter, error } = await db.from('letters').insert({
        share_id,
        user_id: null,
        ip_address: ip,
        title: title || null,
        type,
        content: encryptContent(content),
        recipient_name: recipient_name || null,
        sender_name: sender_name || null,
        theme: theme || 'classic',
        bouquet,
        song_url,
        has_password: !!(has_password && password),
        password_hash,
        open_at,
        expires_at,
      }).select().single()

      if (error) throw error

      return NextResponse.json({ share_id: letter.share_id, id: letter.id }, { status: 201 })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to save letter' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const serverSupabase = createSupabaseServerClient()
    const { data: { user } } = await serverSupabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to edit letters' }, { status: 401 })
    }

    const body = await req.json()
    const { share_id, title, type, content, recipient_name, sender_name, theme } = body

    if (!share_id || !type || !content) {
      return NextResponse.json({ error: 'share_id, type and content are required' }, { status: 400 })
    }

    const db = getSupabaseAdmin()
    const open_at = parseOpenAt(body.open_at)
    const bouquet = parseBouquet(body.bouquet)
    const song_url = parseSongUrl(body.song_url)

    const { data: letter, error } = await db
      .from('letters')
      .update({
        title: title || null,
        type,
        content: encryptContent(content),
        recipient_name: recipient_name || null,
        sender_name: sender_name || null,
        theme: theme || 'classic',
        bouquet,
        song_url,
        open_at,
        ...(open_at ? { expires_at: expiryFor(open_at, FREE_EXPIRY_DAYS) } : {}),
      })
      .eq('share_id', share_id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ share_id: letter.share_id, id: letter.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update letter' }, { status: 500 })
  }
}
