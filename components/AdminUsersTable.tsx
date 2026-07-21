'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LETTER_TYPES } from '@/lib/templates'

type UserRow = {
  id: string
  email: string
  full_name: string | null
  plan: 'free' | 'pro'
  created_at: string
  letter_count: number
  last_letter_at: string | null
  type_breakdown: Record<string, number>
}

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

export default function AdminUsersTable({ users }: { users: UserRow[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  async function togglePlan(user: UserRow) {
    const next = user.plan === 'pro' ? 'free' : 'pro'
    if (!confirm(`Change ${user.email} from ${user.plan} to ${next}?`)) return
    setBusy(user.id)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: next }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        alert(j.error || 'Failed to update plan')
      }
      router.refresh()
    } finally {
      setBusy(null)
    }
  }

  const typeLabel = (id: string) => {
    const t = LETTER_TYPES.find((t) => t.id === id)
    return t ? `${t.emoji} ${t.label}` : id
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {!users.length ? (
        <div className="text-center py-16 text-gray-400">No users found.</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-600">User</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Plan</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Letters</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Joined</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Last letter</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <>
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{user.full_name || '—'}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${
                      user.plan === 'pro' ? 'bg-rose-50 text-rose-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.plan === 'pro' ? 'Pro' : 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{user.letter_count}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{fmtDate(user.created_at)}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{fmtDate(user.last_letter_at)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                      <button
                        onClick={() => setExpanded(expanded === user.id ? null : user.id)}
                        className="text-gray-500 hover:text-gray-800 text-xs"
                      >
                        {expanded === user.id ? 'Hide breakdown' : 'Breakdown'}
                      </button>
                      <button
                        onClick={() => togglePlan(user)}
                        disabled={busy === user.id}
                        className="text-rose-600 hover:text-rose-800 text-xs font-medium disabled:opacity-50"
                      >
                        {user.plan === 'pro' ? 'Set Free' : 'Set Pro'}
                      </button>
                    </div>
                  </td>
                </tr>
                {expanded === user.id && (
                  <tr key={`${user.id}-breakdown`} className="bg-gray-50">
                    <td colSpan={6} className="px-6 py-3">
                      {Object.keys(user.type_breakdown).length === 0 ? (
                        <span className="text-xs text-gray-400">No letters yet.</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(user.type_breakdown)
                            .sort((a, b) => b[1] - a[1])
                            .map(([type, count]) => (
                              <span key={type} className="bg-white border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                                {typeLabel(type)} · {count}
                              </span>
                            ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
