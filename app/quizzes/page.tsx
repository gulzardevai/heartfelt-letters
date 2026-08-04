import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Love & Relationship Quizzes — Free, No Sign-Up',
  description:
    'Free love and relationship quizzes: answer a few quick questions, get your result instantly, then turn the moment into a real letter. No account needed.',
  alternates: { canonical: 'https://www.shareloveletters.com/quizzes' },
}

// The hub is otherwise just a list of cards. These give it something to say.
const HUB_SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'What these quizzes are for',
    body: [
      'Each of these takes a couple of minutes and ends with a description rather than a score. They are not diagnostic instruments and we do not pretend otherwise — what a good quiz does is give you a vocabulary for something you had already noticed but could not name, which is genuinely useful even when the categories are approximate.',
      'The most productive way to use them is in pairs. Take one separately from your partner or your closest friend, compare results, and talk about the gap. Mismatched answers are the ordinary source of "you never say it" arguments, and seeing the mismatch described tends to defuse them faster than having the argument again.',
    ],
  },
  {
    heading: 'Which one to start with',
    body: [
      'If you are not sure what you want to say to someone, start with <a href="/quizzes/what-letter-should-you-write">Which Letter Should You Write?</a> — it sorts a general sense of something owed into one of four specific letters. If you know the feeling but not your own style, <a href="/quizzes/how-romantic-are-you">How Romantic Are You?</a> is the broader one.',
      'For a specific situation: <a href="/quizzes/apology-style-quiz">the apology style quiz</a> if something needs repairing, <a href="/quizzes/long-distance-relationship-quiz">the long-distance quiz</a> if you are apart, and <a href="/quizzes/best-friend-test">the best friend test</a> for the friendship nobody has ever formally acknowledged.',
    ],
  },
  {
    heading: 'Free, and nothing is stored',
    body: [
      'Every quiz is free with no account and no sign-up. They run entirely in your browser — your individual answers are never stored against you or sold to anyone, and we count only how many people started and finished each quiz.',
      'If a result points at something worth saying, you can <a href="/write">write and send a real letter</a> free, encrypted and without an account on either side.',
    ],
  },
]

export default async function QuizzesHubPage() {
  const db = getSupabaseAdmin()
  const { data: quizzes } = await db
    .from('admin_quizzes')
    .select('slug, title, description, questions')
    .eq('published', true)
    .order('created_at', { ascending: false })

  // No published quizzes yet — send visitors to the tools hub instead of a thin page.
  if (!quizzes?.length) redirect('/tools')

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pt-14 pb-16" id="quizzes-hub">
        <div className="text-center mb-10">
          <div className="text-5xl mb-5">💞</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-4">Love quizzes</h1>
          <p className="text-rose-700/70 leading-relaxed">
            Quick, free quizzes about love and relationships. Answer a few questions, get your result instantly — no account, nothing saved.
          </p>
        </div>

        <div className="space-y-4">
          {quizzes.map(q => (
            <Link
              key={q.slug}
              href={`/quizzes/${q.slug}`}
              className="block bg-white rounded-2xl border border-rose-100 p-6 shadow-sm hover:border-rose-300 transition-colors"
            >
              <h2 className="font-serif text-xl font-bold text-rose-900 mb-1.5">{q.title}</h2>
              <p className="text-sm text-rose-700/70 leading-relaxed">{q.description}</p>
              <p className="text-xs text-rose-400 mt-3">
                {Array.isArray(q.questions) ? q.questions.length : 0} questions · takes about a minute →
              </p>
            </Link>
          ))}
        </div>

        {HUB_SECTIONS.map(s => (
          <section key={s.heading} className="mt-12">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-4">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p
                key={i}
                className="text-rose-800/75 leading-relaxed mb-4 [&_a]:text-rose-600 [&_a]:underline hover:[&_a]:text-rose-700"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </section>
        ))}

        <div className="text-center mt-10">
          <Link href="/tools" className="text-sm bg-white border border-rose-100 text-rose-700 px-4 py-2 rounded-full hover:bg-rose-50 transition-colors">
            All love tools
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
