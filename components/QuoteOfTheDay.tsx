'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { getQuoteOfTheDay, QUOTE_CATEGORIES, type Quote } from '@/lib/quotes'

export default function QuoteOfTheDay() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [copied, setCopied] = useState(false)

  // Computed on client to use the visitor's local date
  useEffect(() => {
    setQuote(getQuoteOfTheDay())
  }, [])

  if (!quote) return null

  const cat = QUOTE_CATEGORIES.find(c => c.id === quote.category)

  const copy = async () => {
    await navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`)
    setCopied(true)
    toast.success('Quote copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-rose-100 shadow-paper p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
          <span className="inline-block bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-6">
            ✨ Quote of the Day
          </span>
          <blockquote className="font-serif text-2xl md:text-3xl text-rose-900 leading-relaxed mb-5">
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <p className="text-rose-500 font-medium mb-1">— {quote.author}</p>
          {cat && (
            <p className="text-xs text-rose-400 mb-7">{cat.emoji} {cat.label}</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={copy}
              className={`text-sm px-5 py-2.5 rounded-full font-medium transition-colors ${
                copied ? 'bg-green-100 text-green-700' : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              {copied ? '✓ Copied' : '📋 Copy Quote'}
            </button>
            <Link
              href="/quotes"
              className="text-sm px-5 py-2.5 rounded-full font-medium border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors"
            >
              Browse 700+ Quotes →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
