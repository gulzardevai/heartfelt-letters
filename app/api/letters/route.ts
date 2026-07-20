import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

const FREE_LETTER_LIMIT = 10
const FREE_EXPIRY_DAYS = 30

export async function POST(req: NextRequest) {
  try {
    const serverSupabase = createSupabaseServerClient()
    const { data: { user } } = await serverSupabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const db = getSupabaseAdmin()

    const { count } = await db
      .from('letters')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_deleted', false)

    if ((count ?? 0) >= FREE_LETTER_LIMIT) {
      return NextResponse.json({
        error: 'Free plan limit reached. You can create up to 10 letters on the free plan.',
        code: 'LIMIT_REACHED'
      }, { status: 403 })
    }

    const body = await req.json()
    const { title, type, content, recipient_name, sender_name, password, has_password } = body

    if (!type || !content) {
      return NextResponse.json({ error: 'type and content are required' }, { status: 400 })
    }

    const share_id = nanoid(10)
    let password_hash: string | null = null
    if (has_password && password) {
      password_hash = await bcrypt.hash(password, 10)
    }

    const expires_at = new Date()
    expires_at.setDate(expires_at.getDate() + FREE_EXPIRY_DAYS)

    const { data: letter, error } = await db.from('letters').insert({
      share_id,
      user_id: user.id,
      title: title || null,
      type,
      content,
      recipient_name: recipient_name || null,
      sender_name: sender_name || null,
      has_password: !!(has_password && password),
      password_hash,
      expires_at: expires_at.toISOString(),
    }).select().single()

    if (error) throw error

    try { await db.rpc('increment_letter_count', { uid: user.id }) } catch {}

    return NextResponse.json({ share_id: letter.share_id, id: letter.id }, { status: 201 })
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
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()
    const { share_id, title, type, content, recipient_name, sender_name } = body

    if (!share_id || !type || !content) {
      return NextResponse.json({ error: 'share_id, type and content are required' }, { status: 400 })
    }

    const db = getSupabaseAdmin()

    const { data: letter, error } = await db
      .from('letters')
      .update({
        title: title || null,
        type,
        content,
        recipient_name: recipient_name || null,
        sender_name: sender_name || null,
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
