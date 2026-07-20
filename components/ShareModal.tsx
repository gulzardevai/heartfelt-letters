'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  shareId: string
  onClose: () => void
  showPasswordSetup?: boolean
}

export default function ShareModal({ shareId, onClose, showPasswordSetup = false }: Props) {
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/letter/${shareId}`
    : `/letter/${shareId}`

  const [copied, setCopied] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [settingPw, setSettingPw] = useState(false)
  const [passwordSet, setPasswordSet] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSetPassword = async () => {
    if (!password) return
    setSettingPw(true)
    try {
      const res = await fetch(`/api/letters/${shareId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) throw new Error()
      setPasswordSet(true)
      setShowPasswordForm(false)
      toast.success('Password set!')
    } catch {
      toast.error('Failed to set password')
    } finally {
      setSettingPw(false)
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
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                copied ? 'bg-green-500 text-white' : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Password section — only shown when relevant */}
        {showPasswordSetup && (
          <div className="mb-4">
            {passwordSet ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                🔒 Letter is password protected
              </div>
            ) : !showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="w-full py-3 px-4 border-2 border-dashed border-rose-200 rounded-2xl text-sm text-rose-600 hover:border-rose-400 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
              >
                🔒 Add Password Protection (optional)
              </button>
            ) : (
              <div className="border border-rose-200 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-medium text-rose-700">Only people with the password can open this letter</p>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter a password..."
                    autoFocus
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
                <div className="flex gap-2">
                  <button
                    onClick={handleSetPassword}
                    disabled={!password || settingPw}
                    className="flex-1 bg-rose-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-50"
                  >
                    {settingPw ? 'Setting...' : '🔒 Set Password'}
                  </button>
                  <button
                    onClick={() => { setShowPasswordForm(false); setPassword('') }}
                    className="px-4 py-2 border border-rose-200 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    Skip
                  </button>
                </div>
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
