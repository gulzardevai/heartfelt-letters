import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import bcrypt from 'bcryptjs'
import { decryptContent } from '@/lib/crypto'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const password = req.nextUrl.searchParams.get('password')
    const ownerFetch = req.nextUrl.searchParams.get('owner') === '1'
    const db = getSupabaseAdmin()

    const { data: letter, error } = await db
      .from('letters')
      .select('*')
      .eq('share_id', params.id)
      .single()

    if (error || !letter) {
      return NextResponse.json({ error: 'Letter not found' }, { status: 404 })
    }

    // Owner bypass: verify session and ownership
    if (ownerFetch) {
      const serverSupabase = createSupabaseServerClient()
      const { data: { user } } = await serverSupabase.auth.getUser()
      if (!user || letter.user_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const { password_hash: _, ...safeLetter } = letter
      return NextResponse.json({ letter: { ...safeLetter, content: decryptContent(safeLetter.content) } })
    }

    if (letter.has_password) {
      if (!password) {
        return NextResponse.json({ error: 'Password required' }, { status: 401 })
      }
      const valid = await bcrypt.compare(password, letter.password_hash!)
      if (!valid) {
        return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
      }
    }

    const { password_hash: _, ...safeLetter } = letter
    return NextResponse.json({ letter: { ...safeLetter, content: decryptContent(safeLetter.content) } })
  } catch (err) {
    console.error('Error fetching letter:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { password, remove_password } = body
    const db = getSupabaseAdmin()

    if (remove_password) {
      const { error } = await db
        .from('letters')
        .update({ has_password: false, password_hash: null })
        .eq('share_id', params.id)
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const password_hash = await bcrypt.hash(password, 12)
    const { error } = await db
      .from('letters')
      .update({ has_password: true, password_hash })
      .eq('share_id', params.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error updating letter:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
