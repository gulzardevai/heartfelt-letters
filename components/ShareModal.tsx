'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  shareId: string
  onClose: () => void
  showPasswordSetup?: boolean
  initialHasPassword?: boolean
}

export default function ShareModal({ shareId, onClose, showPasswordSetup = false, initialHasPassword = false }: Props) {
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/letter/${shareId}`
    : `/letter/${shareId}`

  const [copied, setCopied] = useState(false)
  const [hasPassword, setHasPassword] = useState(initialHasPassword)
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [saving, setSaving] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleToggle = async () => {
    if (hasPassword) {
      // Remove password
      setSaving(true)
      try {
        const res = await fetch(`/api/letters/${shareId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ remove_password: true }),
        })
        if (!res.ok) throw new Error()
        setHasPassword(false)
        setPassword('')
        toast.success('Password removed')
      } catch {
        toast.error('Failed to remove password')
      } finally {
        setSaving(false)
      }
    } else {
      setHasPassword(true)
    }
  }

  const handleSavePassword = async () => {
    if (!password) return
    setSaving(true)
    try {
      const res = await fetch(`/api/letters/${shareId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) throw new Error()
      toast.success(initialHasPassword ? 'Password updated!' : 'Password set!')
      setPassword('')
    } catch {
      toast.error('Failed to set password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 fade-in">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="font-serif text-2xl font-bold text-rose-900">Your Letter is Ready!</h2>
          <p className="text-rose-700/60 text-sm mt-1">Share this link with your recipient</p>
        </div>

        {/* Link */}
        <div className="bg-rose-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-sm text-rose-800 outline-none font-mono truncate"
            />
            <button
              onClick={copyLink}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                copied ? 'bg-green-500 text-white' : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Password protection */}
        {showPasswordSetup && (
          <div className="border border-rose-100 rounded-2xl p-4 mb-4 space-y-3">
            {/* Toggle row */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-rose-900">
                  {hasPassword ? '🔒 Password protected' : '🔓 No password'}
                </p>
                <p className="text-xs text-rose-400 mt-0.5">
                  {hasPassword ? 'Only people with the password can open this letter' : 'Anyone with the link can read this'}
                </p>
              </div>
              <button
                onClick={handleToggle}
                disabled={saving}
                style={{
                  display: 'inline-flex',
                  width: 44,
                  height: 24,
                  borderRadius: 999,
                  backgroundColor: hasPassword ? '#e11d48' : '#d1d5db',
                  position: 'relative',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  flexShrink: 0,
                  opacity: saving ? 0.5 : 1,
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: 4,
                  left: hasPassword ? 23 : 4,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>

            {/* Password input — shown when enabled */}
            {hasPassword && (
              <div className="space-y-2 pt-1 border-t border-rose-50">
                <label className="text-xs font-medium text-rose-600">
                  {initialHasPassword ? 'Update password' : 'Set a password'}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={initialHasPassword ? 'Enter new password...' : 'Enter a password...'}
                    className="w-full border border-rose-200 rounded-xl px-4 py-2.5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 hover:text-rose-600 text-xs font-medium"
                  >
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
                <button
                  onClick={handleSavePassword}
                  disabled={!password || saving}
                  className="w-full bg-rose-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-40"
                >
                  {saving ? 'Saving...' : initialHasPassword ? 'Update Password' : 'Set Password'}
                </button>
              </div>
            )}
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
