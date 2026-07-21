import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { LETTER_TYPES } from '@/lib/templates'
import AdminCharts from '@/components/AdminCharts'

export const dynamic = 'force-dynamic'

type Stats = {
  total_letters: number
  letters_this_week: number
  total_users: number
  signups_this_week: number
  total_posts: number
  total_views: number
  anon_letters: number
  account_letters: number
  letters_per_day: { day: string; count: number }[]
  signups_per_day: { day: string; count: number }[]
  letters_by_type: { type: string; count: number }[]
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</div>
      {sub && <div className="text-xs text-rose-600 mt-1">{sub}</div>}
    </div>
  )
}

export default async function AdminDashboardPage() {
  const db = getSupabaseAdmin()
  const { data, error } = await db.rpc('admin_dashboard_stats')

  if (error || !data) {
    return <div className="text-center py-16 text-gray-400">Failed to load stats: {error?.message}</div>
  }

  const stats = data as Stats
  const typeLabel = (id: string) => LETTER_TYPES.find((t) => t.id === id)?.label ?? id
  const lettersByType = stats.letters_by_type.map((t) => ({ ...t, type: typeLabel(t.type) }))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">A look at how ShareLove Letters is doing.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total letters" value={stats.total_letters} sub={`+${stats.letters_this_week} this week`} />
        <StatCard label="Total users" value={stats.total_users} sub={`+${stats.signups_this_week} this week`} />
        <StatCard label="Letter views" value={stats.total_views} />
        <StatCard label="Blog posts" value={stats.total_posts} />
        <StatCard label="Registered letters" value={stats.account_letters} />
        <StatCard label="Anonymous letters" value={stats.anon_letters} />
        <StatCard label="Letters this week" value={stats.letters_this_week} />
        <StatCard label="Signups this week" value={stats.signups_this_week} />
      </div>

      <AdminCharts
        lettersPerDay={stats.letters_per_day}
        signupsPerDay={stats.signups_per_day}
        lettersByType={lettersByType}
        anonLetters={stats.anon_letters}
        accountLetters={stats.account_letters}
      />
    </div>
  )
}
