import { getSupabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import AdminUsersTable from '@/components/AdminUsersTable'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 25

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string; sort?: string }
}) {
  const q = (searchParams.q ?? '').trim()
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1)
  const sort = searchParams.sort === 'asc' ? 'asc' : 'desc'

  const db = getSupabaseAdmin()
  let query = db
    .from('profiles')
    .select('id, email, full_name, plan, created_at', { count: 'exact' })
    .order('created_at', { ascending: sort === 'asc' })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (q) {
    query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
  }

  const { data: profiles, count } = await query
  const ids = (profiles ?? []).map((p) => p.id as string)

  // Letter stats for the users on this page only (metadata, never content)
  const byUser: Record<string, { total: number; last: string | null; types: Record<string, number> }> = {}
  if (ids.length) {
    const { data: letters } = await db
      .from('letters')
      .select('user_id, type, created_at')
      .in('user_id', ids)
    for (const l of letters ?? []) {
      const uid = l.user_id as string
      const entry = (byUser[uid] ??= { total: 0, last: null, types: {} })
      entry.total += 1
      entry.types[l.type as string] = (entry.types[l.type as string] ?? 0) + 1
      if (!entry.last || (l.created_at as string) > entry.last) entry.last = l.created_at as string
    }
  }

  const rows = (profiles ?? []).map((p) => ({
    id: p.id as string,
    email: (p.email as string) ?? '—',
    full_name: (p.full_name as string) ?? null,
    plan: ((p.plan as string) === 'pro' ? 'pro' : 'free') as 'free' | 'pro',
    created_at: p.created_at as string,
    letter_count: byUser[p.id as string]?.total ?? 0,
    last_letter_at: byUser[p.id as string]?.last ?? null,
    type_breakdown: byUser[p.id as string]?.types ?? {},
  }))

  const total = count ?? rows.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pageLink = (p: number) =>
    `/admin/users?${new URLSearchParams({ ...(q ? { q } : {}), sort, page: String(p) }).toString()}`

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total users</p>
        </div>
      </div>

      <form method="GET" action="/admin/users" className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by email or name..."
          className="flex-1 min-w-[200px] max-w-sm px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
        <select name="sort" defaultValue={sort} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
        <button type="submit" className="bg-rose-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors">
          Search
        </button>
      </form>

      <AdminUsersTable users={rows} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={pageLink(page - 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">← Prev</Link>
            )}
            {page < totalPages && (
              <Link href={pageLink(page + 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">Next →</Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
