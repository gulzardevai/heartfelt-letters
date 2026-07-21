'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Letter } from '@/lib/supabase'

interface Props {
  shareId: string
  onUnlock: (letter: Letter, password: string) => void
}

export default function PasswordGate({ shareId, onUnlock }: Props) {
  const [password, setPassword] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return
    setIsChecking(true)
    setError('')
    try {
      const res = await fetch(`/api/letters/${shareId}?password=${encodeURIComponent(password)}`)
      if (res.ok) {
        const data = await res.json()
        onUnlock(data.letter, password)
      } else if (res.status === 401) {
        setError('Incorrect password. Please try again.')
        toast.error('Incorrect password')
      } else {
        throw new Error('Request failed')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="bg-white rounded-3xl shadow-paper-lg p-8 w-full max-w-md text-center fade-in">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="font-serif text-2xl font-bold text-rose-900 mb-2">This Letter is Private</h2>
        <p className="text-rose-700/60 text-sm mb-6">Enter the password to read this letter</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            autoFocus
            className="w-full border-2 border-rose-200 rounded-2xl px-4 py-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-rose-50/30"
          />
          {error && <p className="text-rose-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isChecking || !password}
            className="w-full bg-rose-600 text-white py-3 rounded-2xl font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            {isChecking ? 'Checking...' : '🔓 Unlock Letter'}
          </button>
        </form>

        <p className="mt-4 text-xs text-rose-400">Ask the sender for the password if you don&apos;t have it</p>
      </div>
    </div>
  )
}
