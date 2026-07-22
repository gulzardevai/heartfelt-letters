'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const LETTER_TYPE_EMOJIS: Record<string, string> = {
  love: '💌',
  apology: '🙏',
  gratitude: '🌸',
  birthday: '🎂',
  farewell: '👋',
  friendship: '🤝',
  encouragement: '⭐',
  anniversary: '💍',
  congratulations: '🎉',
  sympathy: '🕊️',
  future_self: '🕰️',
}

type Letter = {
  id: string
  share_id: string
  title: string | null
  type: string
  recipient_name: string | null
  created_at: string
  expires_at: string | null
  open_at: string | null
  is_deleted: boolean
}

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const [letters, setLetters] = useState<Letter[]>([])
  const [fetching, setFetching] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const supabase = createSupabaseBrowserClient()
    supabase
      .from('letters')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setLetters((data as Letter[]) ?? [])
        setFetching(false)
      })
  }, [user])

  const handleCopyLink = (shareId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/letter/${shareId}`)
    setCopiedId(shareId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    const supabase = createSupabaseBrowserClient()
    await supabase.from('letters').update({ is_deleted: true }).eq('id', id)
    setLetters(prev => prev.filter(l => l.id !== id))
  }

  const count = letters.length
  const remaining = 10 - count

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-rose-400 text-sm">Loading your letters...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-rose-900 mb-1">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 💌
          </h1>
          <p className="text-rose-600/70">Here are your heartfelt letters</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm text-center">
            <div className="text-3xl font-bold text-rose-700">{count}</div>
            <div className="text-xs text-rose-500 mt-1">Letters Written</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm text-center">
            <div className="text-3xl font-bold text-rose-700">{remaining}</div>
            <div className="text-xs text-rose-500 mt-1">Letters Remaining</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm text-center">
            <div className="text-sm font-bold text-rose-700 mt-1">{profile?.plan === 'pro' ? '⭐ Pro' : 'Free'}</div>
            <div className="text-xs text-rose-500 mt-1">Current Plan</div>
          </div>
        </div>

        {count >= 8 && remaining > 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-5 py-3 text-sm mb-6">
            ⚠️ You&apos;ve used {count}/10 letters on the free plan. {remaining} remaining.
          </div>
        )}

        {count === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">No letters yet</h2>
            <p className="text-rose-600/70 mb-6">Write your first heartfelt letter and make someone&apos;s day.</p>
            <Link href="/write" className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md">
              Write a Letter
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-semibold text-rose-900">Your Letters</h2>
              <Link href="/write" className="text-sm bg-rose-600 text-white px-4 py-2 rounded-full hover:bg-rose-700 transition-colors shadow-sm">
                + New Letter
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {letters.map(letter => (
                <div key={letter.id} className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">{LETTER_TYPE_EMOJIS[letter.type] ?? '📄'}</div>
                    <span className="text-xs bg-rose-50 text-rose-500 px-2 py-1 rounded-full capitalize">{letter.type}</span>
                  </div>
                  <h3 className="font-serif font-semibold text-rose-900 mb-1 truncate">
                    {letter.title || 'Untitled Letter'}
                  </h3>
                  {letter.recipient_name && (
                    <p className="text-xs text-rose-500 mb-3">To: {letter.recipient_name}</p>
                  )}
                  {letter.open_at && new Date(letter.open_at) > new Date() && (
                    <p className="inline-block text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full mb-3">
                      ⏳ Opens {new Date(letter.open_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                  <div className="text-xs text-rose-400 mb-4">
                    <div>Created {new Date(letter.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    {letter.expires_at && (
                      <div>Expires {new Date(letter.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      href={`/letter/${letter.share_id}`}
                      target="_blank"
                      className="text-xs px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/write?edit=${letter.share_id}`}
                      className="text-xs px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleCopyLink(letter.share_id)}
                      className="text-xs px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      {copiedId === letter.share_id ? '✓ Copied!' : 'Copy Link'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this letter? This cannot be undone.')) handleDelete(letter.id)
                      }}
                      className="text-xs px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
