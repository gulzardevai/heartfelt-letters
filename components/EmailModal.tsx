'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  shareId: string
  senderName: string | null
  onClose: () => void
}

export default function EmailModal({ shareId, senderName, onClose }: Props) {
  const [toEmail, setToEmail] = useState('')
  const [toName, setToName] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!toEmail) {
      toast.error('Please enter a recipient email')
      return
    }
    setIsSending(true)
    try {
      const res = await fetch(`/api/letters/${shareId}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_email: toEmail, to_name: toName, message }),
      })
      if (!res.ok) throw new Error('Failed to send email')
      toast.success('Letter sent successfully!')
      onClose()
    } catch {
      toast.error('Failed to send email. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 fade-in">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📧</div>
          <h2 className="font-serif text-2xl font-bold text-rose-900">Send via Email</h2>
          <p className="text-rose-700/60 text-sm mt-1">Deliver this letter straight to their inbox</p>
        </div>

        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-xs font-medium text-rose-700 mb-1">Recipient&apos;s Name (optional)</label>
            <input
              type="text"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              placeholder="Their name"
              className="w-full border border-rose-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-rose-700 mb-1">Recipient&apos;s Email *</label>
            <input
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="their@email.com"
              className="w-full border border-rose-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-rose-700 mb-1">Personal Note (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a short note to accompany the letter..."
              rows={3}
              className="w-full border border-rose-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-rose-200 text-rose-700 rounded-2xl text-sm font-medium hover:bg-rose-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || !toEmail}
            className="flex-1 bg-rose-600 text-white py-3 rounded-2xl text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            {isSending ? 'Sending...' : '✉️ Send Letter'}
          </button>
        </div>
      </div>
    </div>
  )
}
