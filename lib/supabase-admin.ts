import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// Convenience proxy so existing `supabaseAdmin.from(...)` calls work unchanged
// without triggering createClient at module-import time (which fails at build)
export const supabaseAdmin = new Proxy(
  {} as ReturnType<typeof getSupabaseAdmin>,
  { get: (_t, prop) => (getSupabaseAdmin() as unknown as Record<string, unknown>)[prop as string] }
)
