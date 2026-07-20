import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const password = req.nextUrl.searchParams.get('password')
    const db = getSupabaseAdmin()

    const { data: letter, error } = await db
      .from('letters')
      .select('*')
      .eq('share_id', params.id)
      .single()

    if (error || !letter) {
      return NextResponse.json({ error: 'Letter not found' }, { status: 404 })
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

    // Never expose the hash to the client
    const { password_hash: _, ...safeLetter } = letter
    return NextResponse.json({ letter: safeLetter })
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
    const { password } = body

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const password_hash = await bcrypt.hash(password, 12)
    const db = getSupabaseAdmin()

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
