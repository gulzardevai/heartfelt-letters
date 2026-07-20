'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    setDropdownOpen(false)
    await signOut()
    router.push('/')
  }

  const initial = profile?.full_name
    ? profile.full_name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💌</span>
          <span className="font-serif text-xl font-bold text-rose-900">Heartfelt Letters</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-rose-700">
          <Link href="/" className="hover:text-rose-900 transition-colors">Home</Link>
          <Link href="/write" className="hover:text-rose-900 transition-colors">Write a Letter</Link>
          <Link href="/blog" className="hover:text-rose-900 transition-colors">Blog</Link>
          <Link href="/compare" className="hover:text-rose-900 transition-colors">Why Us?</Link>
          <Link href="/about" className="hover:text-rose-900 transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full bg-rose-600 text-white font-semibold text-sm flex items-center justify-center hover:bg-rose-700 transition-colors shadow-sm"
              >
                {initial}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-rose-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-rose-50">
                    <p className="text-xs text-rose-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-rose-800 hover:bg-rose-50 transition-colors"
                  >
                    My Letters
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-rose-800 hover:bg-rose-50 transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-rose-700 hover:text-rose-900 transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-medium bg-rose-600 text-white px-4 py-2 rounded-full hover:bg-rose-700 transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
