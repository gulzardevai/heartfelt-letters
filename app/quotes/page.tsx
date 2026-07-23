'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { QUOTES, QUOTE_CATEGORIES, QUOTE_CATEGORY_PAGES } from '@/lib/quotes'
import { useAuth } from '@/components/AuthProvider'
import { sendGAEvent } from '@next/third-parties/google'

const FAVORITES_KEY = (userId: string) => `hl_favorites_${userId}`

export default function QuotesPage() {
  const { user } = useAuth()
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showFavOnly, setShowFavOnly] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const PER_PAGE = 24

  // Load favorites from localStorage
  useEffect(() => {
    if (!user) { setFavorites(new Set()); return }
    const stored = localStorage.getItem(FAVORITES_KEY(user.id))
    if (stored) {
      try { setFavorites(new Set(JSON.parse(stored))) } catch { /* ignore */ }
    }
  }, [user])

  const saveFavorites = (next: Set<string>) => {
    if (!user) return
    localStorage.setItem(FAVORITES_KEY(user.id), JSON.stringify(Array.from(next)))
    setFavorites(next)
  }

  const toggleFavorite = (id: string) => {
    if (!user) {
      toast('Sign in to save favorites', { icon: '🔒' })
      return
    }
    const next = new Set(favorites)
    if (next.has(id)) { next.delete(id) } else { next.add(id) }
    saveFavorites(next)
  }

  const copyQuote = async (id: string, text: string, author: string) => {
    await navigator.clipboard.writeText(`"${text}" — ${author}`)
    setCopied(id)
    toast.success('Quote copied!')
    sendGAEvent('event', 'quote_copied', { quote_id: id })
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = useMemo(() => {
    return QUOTES.filter(q => {
      if (activeCategory !== 'all' && q.category !== activeCategory) return false
      if (showFavOnly && !favorites.has(q.id)) return false
      if (search) {
        const s = search.toLowerCase()
        return q.text.toLowerCase().includes(s) || q.author.toLowerCase().includes(s)
      }
      return true
    })
  }, [activeCategory, search, showFavOnly, favorites])

  // Reset to first page whenever filters change
  useEffect(() => { setPage(1) }, [activeCategory, search, showFavOnly])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const goToPage = (p: number) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categoryInfo = QUOTE_CATEGORIES.find(c => c.id === activeCategory)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 py-16 text-center">
          <span className="inline-block bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-5">
            Quote Library
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-4 leading-tight">
            Words That Move Hearts
          </h1>
          <p className="text-rose-700/70 text-lg max-w-xl mx-auto">
            Find the perfect words for your letter. Copy any quote or save your favorites for later.
          </p>

          {/* Category landing links (crawlable per-category pages) */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-8">
            {QUOTE_CATEGORY_PAGES.map(c => (
              <Link
                key={c.slug}
                href={`/quotes/${c.slug}`}
                className="bg-white border border-rose-100 rounded-full px-4 py-2 text-sm text-rose-700 hover:border-rose-300 hover:text-rose-900 transition-colors shadow-sm"
              >
                {c.emoji} {c.name} quotes
              </Link>
            ))}
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 pb-24">
          {/* Search + Favorites toggle */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 text-sm">🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search quotes or authors..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-rose-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 shadow-sm"
              />
            </div>
            {user && (
              <button
                onClick={() => setShowFavOnly(p => !p)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium border transition-all shadow-sm whitespace-nowrap ${
                  showFavOnly
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white text-rose-700 border-rose-100 hover:bg-rose-50'
                }`}
              >
                ♥ {showFavOnly ? 'Showing Favorites' : 'My Favorites'} ({favorites.size})
              </button>
            )}
          </div>

          {/* Category filter — horizontally scrollable */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
            {QUOTE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setShowFavOnly(false) }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white text-rose-700 border-rose-100 hover:bg-rose-50'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Result count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-rose-600/60">
              {filtered.length} quote{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'all' && ` in ${categoryInfo?.label}`}
              {search && ` matching "${search}"`}
            </p>
            {!user && (
              <p className="text-xs text-rose-400">
                <Link href="/auth/login" className="underline hover:text-rose-600">Sign in</Link> to save favorites
              </p>
            )}
          </div>

          {/* Quotes grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-rose-400">
              <div className="text-5xl mb-4">💭</div>
              <p className="font-serif text-lg">No quotes found</p>
              <p className="text-sm mt-1">Try a different category or search term</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {paginated.map(quote => {
                const cat = QUOTE_CATEGORIES.find(c => c.id === quote.category)
                const isFav = favorites.has(quote.id)
                const isCopied = copied === quote.id
                return (
                  <div
                    key={quote.id}
                    className="break-inside-avoid bg-white rounded-2xl border border-rose-100 p-6 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {/* Category badge */}
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full mb-4">
                      {cat?.emoji} {cat?.label}
                    </span>

                    {/* Quote text */}
                    <blockquote className="font-serif text-rose-900 text-[15px] leading-relaxed mb-4">
                      &ldquo;{quote.text}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <p className="text-xs text-rose-500 font-medium mb-4">— {quote.author}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-rose-50">
                      <button
                        onClick={() => copyQuote(quote.id, quote.text, quote.author)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
                          isCopied
                            ? 'bg-green-100 text-green-700'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                      >
                        {isCopied ? '✓ Copied' : '📋 Copy'}
                      </button>

                      <button
                        onClick={() => toggleFavorite(quote.id)}
                        title={user ? (isFav ? 'Remove from favorites' : 'Add to favorites') : 'Sign in to favorite'}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all font-medium ml-auto ${
                          isFav
                            ? 'bg-rose-600 text-white'
                            : 'bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600'
                        }`}
                      >
                        {isFav ? '♥ Saved' : '♡ Save'}
                      </button>

                      <Link
                        href={`/write?type=${quote.category === 'love' ? 'love' : quote.category === 'friendship' ? 'friendship' : 'appreciation'}`}
                        className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all font-medium"
                        title="Use in a letter"
                      >
                        ✍️ Use
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full text-sm font-medium border border-rose-100 bg-white text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center gap-2">
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-rose-300 text-sm">…</span>}
                    <button
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                        p === currentPage
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white text-rose-700 border border-rose-100 hover:bg-rose-50'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full text-sm font-medium border border-rose-100 bg-white text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
