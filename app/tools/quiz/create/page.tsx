import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import QuizBuilder from '@/components/tools/QuizBuilder'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Create Your "How Well Do You Know Me?" Quiz',
  description: 'Build a free "how well do you know me?" quiz to share with friends and partners.',
  alternates: { canonical: 'https://www.shareloveletters.com/tools/quiz' },
  robots: { index: false, follow: true },
}

export default function CreateQuizPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />
      <main className="flex-1">
        <section className="max-w-2xl mx-auto px-6 pt-14 pb-6 text-center">
          <nav className="text-xs text-rose-400 mb-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/tools/quiz" className="hover:text-rose-600 transition-colors">Quiz</Link>
            <span className="mx-2">›</span>
            <span className="text-rose-500">Create</span>
          </nav>
          <div className="text-5xl mb-5">✍️</div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-rose-900 mb-3 leading-tight">
            Build your quiz
          </h1>
          <p className="text-rose-700/70 leading-relaxed">
            Add your name and your questions. Mark your own answer as the correct one — that is what friends will be scored against.
          </p>
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-20">
          <QuizBuilder />
        </section>
      </main>
      <Footer />
    </div>
  )
}
