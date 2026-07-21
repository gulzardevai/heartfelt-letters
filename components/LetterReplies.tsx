'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { sendGAEvent } from '@next/third-parties/google'
import { useAuth } from '@/components/AuthProvider'

interface Reply {
  id: string
  author_name: string | null
  content: string
  created_at: string
}

interface Props {
  shareId: string
  unlockPassword?: string
}

const MAX_LENGTH = 1000

function formatDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function LetterReplies({ shareId, unlockPassword }: Props) {
  const { user } = useAuth()
  const [replies, setReplies] = useState<Reply[]>([])
  const [loaded, setLoaded] = useState(false)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const params = unlockPassword ? `?password=${encodeURIComponent(unlockPassword)}` : ''
    fetch(`/api/letters/${shareId}/replies${params}`)
      .then(res => (res.ok ? res.json() : { replies: [] }))
      .then(data => setReplies(data.replies || []))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [shareId, unlockPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/letters/${shareId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed, password: unlockPassword || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not send your reply')
        return
      }
      setReplies(prev => [...prev, data.reply])
      setContent('')
      toast.success('Reply sent 💌')
      sendGAEvent('event', 'letter_reply_posted', { anonymous: !user })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div id="letter-replies" className="no-print mt-10 bg-white/80 border border-rose-100 rounded-2xl p-6 sm:p-8 shadow-sm fade-in scroll-mt-8">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-rose-900 mb-5">
        💬 Replies{loaded && replies.length > 0 ? ` (${replies.length})` : ''}
      </h2>

      {/* Reply list */}
      {loaded && replies.length === 0 && (
        <p className="text-sm text-rose-700/60 mb-6">
          Be the first to reply — let them know this letter reached your heart.
        </p>
      )}
      {replies.length > 0 && (
        <div className="space-y-3 mb-6">
          {replies.map(reply => (
            <div key={reply.id} className="bg-rose-50/70 border border-rose-100 rounded-2xl px-4 py-3">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-sm font-semibold text-rose-800">
                  {reply.author_name || <span title="Posted anonymously">🕶️ Anonymous</span>}
                </span>
                <span className="text-[11px] text-rose-400 whitespace-nowrap">{formatDate(reply.created_at)}</span>
              </div>
              <p className="text-sm text-rose-900/80 whitespace-pre-wrap break-words">{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Composer */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="Write a reply…"
          rows={3}
          className="w-full border-2 border-rose-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-rose-50/30 resize-none"
        />
        <div className="flex items-center justify-between mt-2 gap-3">
          <span className="text-[11px] text-rose-400">{content.length}/{MAX_LENGTH}</span>
          <button
            type="submit"
            disabled={sending || !content.trim()}
            className="bg-rose-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 shadow-md"
          >
            {sending ? 'Sending…' : 'Send Reply'}
          </button>
        </div>
        {!user && (
          <p className="text-[11px] text-rose-400 mt-2">
            Replying anonymously — <a href="/auth/login" className="underline hover:text-rose-600">sign in</a> to reply with your name
          </p>
        )}
      </form>
    </div>
  )
}
