import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const adminEmail = process.env.ADMIN_EMAIL
  if (!user || user.email !== adminEmail) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-semibold text-gray-900 flex items-center gap-2">
            <span>💌</span> Admin Panel
          </Link>
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
          <Link href="/admin/posts" className="text-sm text-gray-600 hover:text-gray-900">Posts</Link>
          <Link href="/admin/users" className="text-sm text-gray-600 hover:text-gray-900">Users</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Back to site</Link>
          <span className="text-xs text-gray-400">{user.email}</span>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
