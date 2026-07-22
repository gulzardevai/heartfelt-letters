import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { OCCASIONS } from '@/lib/occasions'

export const metadata: Metadata = {
  title: 'Letter Templates by Occasion — Free Letters for Every Moment',
  description: 'Free letter templates for every occasion: anniversary, Valentine\'s Day, birthday, apology, thank you, sympathy, farewell and letters to your future self.',
  alternates: { canonical: 'https://www.shareloveletters.com/letters' },
}

export default function LettersIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">
            Letters for every occasion
          </h1>
          <p className="text-rose-700/70 text-lg leading-relaxed">
            Pick the moment you are writing for. Each guide covers what to say, what to skip,
            and gives you templates that open straight into the editor — all free, no account needed.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {OCCASIONS.map(o => (
              <Link
                key={o.slug}
                href={`/letters/${o.slug}`}
                className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm hover:shadow-md hover:border-rose-200 transition-all"
              >
                <div className="text-3xl mb-3">{o.emoji}</div>
                <h2 className="font-serif font-semibold text-rose-900 mb-2">{o.h1}</h2>
                <p className="text-sm text-rose-700/60 leading-relaxed line-clamp-3">{o.intro[0]}</p>
                <span className="inline-block mt-4 text-sm text-rose-600 font-medium">Read the guide →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-4">Not sure which one?</h2>
          <p className="text-rose-700/70 mb-8">
            Start from a blank page and write whatever it is. That works too.
          </p>
          <Link
            href="/write"
            className="inline-block bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Write a Letter — Free
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
