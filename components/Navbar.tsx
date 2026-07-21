'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
          <span className="font-serif text-lg sm:text-xl font-bold text-rose-900 whitespace-nowrap">
            ShareLove<span className="hidden sm:inline"> Letters</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-rose-700">
          <Link href="/" className="hover:text-rose-900 transition-colors">Home</Link>
          <Link href="/write" className="hover:text-rose-900 transition-colors">Write a Letter</Link>
          <Link href="/quotes" className="hover:text-rose-900 transition-colors">Quotes</Link>
          <Link href="/blog" className="hover:text-rose-900 transition-colors">Blog</Link>
          <Link href="/compare" className="hover:text-rose-900 transition-colors">Why Us</Link>
          <Link href="/about" className="hover:text-rose-900 transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
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
                className="text-xs sm:text-sm font-medium text-rose-700 hover:text-rose-900 transition-colors px-2 sm:px-3 py-2 whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="text-xs sm:text-sm font-medium bg-rose-600 text-white px-3 sm:px-4 py-2 rounded-full hover:bg-rose-700 transition-colors shadow-sm whitespace-nowrap"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-rose-50 transition-colors gap-[5px]"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className={`block w-5 h-0.5 bg-rose-700 rounded transition-transform ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-rose-700 rounded transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-rose-700 rounded transition-transform ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white/95 backdrop-blur-md px-6 py-3">
          <div className="flex flex-col text-sm font-medium text-rose-700">
            <Link href="/" onClick={() => setMobileOpen(false)} className="py-2.5 border-b border-rose-50">Home</Link>
            <Link href="/write" onClick={() => setMobileOpen(false)} className="py-2.5 border-b border-rose-50">Write a Letter</Link>
            <Link href="/quotes" onClick={() => setMobileOpen(false)} className="py-2.5 border-b border-rose-50">Quotes</Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="py-2.5 border-b border-rose-50">Blog</Link>
            <Link href="/compare" onClick={() => setMobileOpen(false)} className="py-2.5 border-b border-rose-50">Why Us</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="py-2.5">About</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
