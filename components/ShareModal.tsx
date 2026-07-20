'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  shareId: string
  onClose: () => void
}

export default function ShareModal({ shareId, onClose }: Props) {
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSettingPassword, setIsSettingPassword] = useState(false)

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/letter/${shareId}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied to clipboard!')
  }

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 4) {
      toast.error('Password must be at least 4 characters')
      return
    }
    setIsSettingPassword(true)
    try {
      const res = await fetch(`/api/letters/${shareId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) throw new Error('Failed to set password')
      toast.success('Password protection enabled!')
      setShowPasswordForm(false)
    } catch {
      toast.error('Failed to set password')
    } finally {
      setIsSettingPassword(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 fade-in">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔗</div>
          <h2 className="font-serif text-2xl font-bold text-rose-900">Share Your Letter</h2>
          <p className="text-rose-700/60 text-sm mt-1">Anyone with the link can read this letter</p>
        </div>

        {/* Link display */}
        <div className="bg-rose-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-sm text-rose-800 outline-none font-mono truncate"
            />
            <button
              onClick={copyLink}
              className="flex-shrink-0 bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Password section */}
        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="w-full py-3 px-4 border-2 border-dashed border-rose-200 rounded-2xl text-sm text-rose-600 hover:border-rose-400 hover:bg-rose-50 transition-all flex items-center justify-center gap-2 mb-4"
          >
            🔒 Add Password Protection
          </button>
        ) : (
          <div className="border border-rose-200 rounded-2xl p-4 mb-4">
            <h3 className="font-medium text-rose-900 mb-3 text-sm">Set a Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-rose-200 rounded-xl px-4 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/50"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full border border-rose-200 rounded-xl px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/50"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSetPassword}
                disabled={isSettingPassword}
                className="flex-1 bg-rose-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {isSettingPassword ? 'Setting...' : 'Set Password'}
              </button>
              <button
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 border border-rose-200 rounded-xl text-sm text-rose-700 hover:bg-rose-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-rose-100 text-rose-700 rounded-2xl text-sm font-medium hover:bg-rose-200 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}
