'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth()
  const router = useRouter()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError(null)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.from('profiles').update({ full_name: fullName, updated_at: new Date().toISOString() }).eq('id', user.id)
    if (error) {
      setError(error.message)
    } else {
      await refreshProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-rose-400 text-sm">Loading...</div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  const initial = (profile?.full_name ?? user.email ?? 'U').charAt(0).toUpperCase()
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full">
        <h1 className="font-serif text-4xl font-bold text-rose-900 mb-8">Your Profile</h1>

        {/* Avatar + info */}
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 mb-6 flex items-center gap-6">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-rose-200" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {initial}
            </div>
          )}
          <div>
            <h2 className="font-serif text-2xl font-semibold text-rose-900">{profile?.full_name ?? 'Anonymous'}</h2>
            <p className="text-rose-500 text-sm">{user.email}</p>
            <p className="text-rose-400 text-xs mt-1">Member since {memberSince}</p>
          </div>
        </div>

        {/* Edit profile */}
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 mb-6">
          <h3 className="font-serif text-lg font-semibold text-rose-900 mb-4">Edit Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-rose-700 mb-1.5">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-rose-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Plan info */}
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 mb-6">
          <h3 className="font-serif text-lg font-semibold text-rose-900 mb-4">Plan & Usage</h3>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-rose-100 text-rose-700 text-sm font-semibold px-3 py-1 rounded-full">
              {profile?.plan === 'pro' ? '⭐ Pro Plan' : 'Free Plan'}
            </span>
          </div>
          <ul className="text-sm text-rose-600/80 space-y-1.5">
            <li>✓ Up to 10 letters</li>
            <li>✓ Letters expire after 30 days</li>
            <li>✓ Password protection</li>
            <li>✓ Shareable links</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-rose-50">
            <p className="text-sm text-rose-700">
              Letters created: <strong>{profile?.letter_count ?? 0}</strong> / 10
            </p>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-6">
          <h3 className="font-serif text-lg font-semibold text-red-800 mb-2">Account</h3>
          <p className="text-sm text-red-500/70 mb-4">
            To permanently delete your account, please contact us at{' '}
            <a href="mailto:hello@shareloveletters.com" className="underline">hello@shareloveletters.com</a>.
          </p>
          <button
            onClick={async () => {
              if (confirm('Sign out of your account?')) {
                await signOut()
                router.push('/')
              }
            }}
            className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
