import { createClient } from '@supabase/supabase-js'

export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        // Opt out of Next.js Data Cache so reads are always fresh
        fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }),
      },
    }
  )
}

export const supabase = new Proxy(
  {} as ReturnType<typeof getSupabase>,
  { get: (_t, prop) => (getSupabase() as unknown as Record<string, unknown>)[prop as string] }
)

export type Letter = {
  id: string
  share_id: string
  title: string | null
  type: string
  content: string
  recipient_name: string | null
  sender_name: string | null
  theme: string
  has_password: boolean
  password_hash: string | null
  open_at: string | null
  bouquet: string | null
  song_url: string | null
  created_at: string
  view_count: number
}
