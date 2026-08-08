'use client'

import { sendGAEvent } from '@next/third-parties/google'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

interface Props {
  /** Human-readable names of the extras this letter is using, e.g. ['a bouquet', 'a song'] */
  extras: string[]
  /** Publish anyway, dropping the extras. Always available — the gate must never cost a letter. */
  onPublishWithout: () => void
  onClose: () => void
  /** Persist the draft before we navigate away to sign up. */
  onBeforeSignup: () => void
}

export default function FinishingTouchesGate({ extras, onPublishWithout, onClose, onBeforeSignup }: Props) {
  const list =
    extras.length === 1
      ? extras[0]
      : `${extras.slice(0, -1).join(', ')} and ${extras[extras.length - 1]}`

  const goSignup = (method: 'google' | 'email') => {
    onBeforeSignup()
    sendGAEvent('event', 'finishing_touches_signup', { method, extras: extras.join(',') })
    if (method === 'email') {
      window.location.href = '/auth/signup'
      return
    }
    // Google is the only path that returns the writer to their letter in
    // seconds; email signup costs a confirmation click and a mail round trip.
    const supabase = createSupabaseBrowserClient()
    supabase.auth
      .signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/write` },
      })
      .catch(() => {
        window.location.href = '/auth/signup'
      })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 fade-in">
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">💐</div>
          <h2 className="font-serif text-2xl font-bold text-rose-900">One step to keep {list}</h2>
          <p className="text-rose-700/70 text-sm mt-2 leading-relaxed">
            Finishing touches come with a free account. Create one and your letter publishes
            exactly as you made it — your writing is saved either way.
          </p>
        </div>

        <button
          onClick={() => goSignup('google')}
          className="w-full flex items-center justify-center gap-3 bg-rose-600 text-white rounded-2xl py-3 text-sm font-semibold hover:bg-rose-700 transition-colors shadow-sm mb-2"
        >
          <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google — 10 seconds
        </button>

        <button
          onClick={() => goSignup('email')}
          className="w-full border border-rose-200 text-rose-700 rounded-2xl py-2.5 text-sm font-medium hover:bg-rose-50 transition-colors mb-4"
        >
          Sign up with email instead
        </button>

        <button
          onClick={() => {
            sendGAEvent('event', 'finishing_touches_skipped', { extras: extras.join(',') })
            onPublishWithout()
          }}
          className="w-full py-2.5 text-rose-500 text-sm font-medium hover:text-rose-700 transition-colors underline"
        >
          Publish without {list}
        </button>

        <button
          onClick={onClose}
          className="w-full py-2 text-rose-400 text-xs hover:text-rose-600 transition-colors mt-1"
        >
          Back to my letter
        </button>
      </div>
    </div>
  )
}
