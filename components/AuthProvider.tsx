'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { captureAttribution, syncAttributionToProfile } from '@/lib/attribution'

type Profile = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  plan: 'free' | 'pro'
  letter_count: number
  welcome_sent_at: string | null
  created_at?: string | null
  first_seen_at?: string | null
}

type AuthCtx = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

// Module-level guard so the fallback welcome request fires at most once per page load
let welcomeRequested = false

const AuthContext = createContext<AuthCtx>({ user: null, profile: null, loading: true, signOut: async () => {}, refreshProfile: async () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  const fetchProfile = async (uid: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
    if (data) {
      setProfile(data as Profile)
      // Fallback welcome-email trigger for signups that skip /auth/callback
      // (e.g. email confirmation links). Server dedupes via welcome_sent_at.
      if (!(data as Profile).welcome_sent_at && !welcomeRequested) {
        welcomeRequested = true
        fetch('/api/welcome', { method: 'POST' }).catch(() => {})
      }
      // Brand-new account? Stamp its first touch. The profiles row is created
      // by the on_auth_user_created trigger, so this has to happen on the first
      // authenticated profile fetch — a write in either sign-in handler would
      // miss the other path (OAuth vs. email confirmation link).
      syncAttributionToProfile(data as Profile)
    }
  }

  useEffect(() => {
    // Record the visitor's first touch (referrer + UTM) in localStorage before
    // they browse away from the landing page. No request, no third-party script.
    captureAttribution()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) fetchProfile(user.id)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
