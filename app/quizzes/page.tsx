import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { breadcrumbLd, itemListLd } from '@/lib/schema'

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
    heading: 'Answer quickly, and answer honestly',
    body: [
      'Every quiz here is eight or nine multiple-choice questions and takes about a minute, which is deliberate. Long questionnaires invite you to deliberate, and deliberating produces the answer that describes the person you would like to be rather than the one you are. The first option you reach for is nearly always the more accurate one.',
      'The other thing worth knowing is that none of these are scored against a norm. There is no right result and nothing is being diagnosed — you get a description, and the value of it is whether you recognise yourself in it. If a result feels wrong, that reaction is itself useful information, and it is usually the fastest route to working out what you actually think.',
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

// One line under each quiz card saying who it is actually for. Keyed by slug;
// a quiz with no entry simply shows its own description.
const QUIZ_BLURBS: Record<string, string> = {
  'what-letter-should-you-write':
    'For the vague sense that you owe someone something and no idea which someone. Sorts it into one of four specific letters you could write this evening.',
  'how-romantic-are-you':
    'For anyone who suspects they are either far more or far less romantic than their partner. Describes your style rather than scoring it out of ten.',
  'apology-style-quiz':
    'For when something needs repairing and previous attempts have not landed. Most bad apologies are the right sentiment delivered in the wrong shape.',
  'long-distance-relationship-quiz':
    'For couples in different cities or time zones. Identifies what you are already doing well, which is usually the thing worth protecting when it gets hard.',
  'best-friend-test':
    'For the friendship nobody has ever formally acknowledged. Take it together — comparing answers is most of the fun and occasionally the point.',
}

const STEPS = [
  { t: 'Pick one', d: 'Each quiz is eight or nine multiple-choice questions and takes about a minute. Nothing to install, no email step.' },
  { t: 'Answer on instinct', d: 'Take the first option you reach for. Deliberating gives you a tidier result and a less accurate one.' },
  { t: 'Compare with someone', d: 'Send the same quiz to your partner or best friend and read both results. The gap between them is the useful part.' },
]

const FAQS = [
  {
    q: 'Are these love quizzes free?',
    a: 'Yes — every quiz is free, with no sign-up, no email and no result page to unlock. You answer the questions and the result appears immediately.',
  },
  {
    q: 'How long does each quiz take?',
    a: 'About a minute. Each one is eight or nine multiple-choice questions, deliberately short so you answer on instinct rather than deliberating your way to a flattering result.',
  },
  {
    q: 'Are my answers saved or shared?',
    a: 'No. The quizzes run in your browser and your individual answers are never stored against you or sold to anyone. We count only how many people started and finished each quiz, which tells us which ones are worth improving.',
  },
  {
    q: 'Can I take a quiz with my partner or a friend?',
    a: 'That is the best way to use them. Take the same quiz separately, then compare results and talk about where they differ — a described mismatch is far easier to discuss than an argument about the same thing.',
  },
  {
    q: 'Are these quizzes scientifically accurate?',
    a: 'No, and we would rather say so plainly. They are not diagnostic instruments and nothing here is validated research. What a good quiz does is give you a vocabulary for something you had already noticed, which is genuinely useful even when the categories are approximate.',
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

  const jsonLd = [
    breadcrumbLd([
      { name: 'Home', path: '' },
      { name: 'Quizzes', path: '/quizzes' },
    ]),
    itemListLd(
      'Love and relationship quizzes',
      quizzes.map(q => ({ name: q.title as string, path: `/quizzes/${q.slug}` }))
    ),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pt-14 pb-16" id="quizzes-hub">
        <div className="text-center mb-10">
          <div className="text-5xl mb-5">💞</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-4">Love quizzes</h1>
          <p className="text-rose-700/70 leading-relaxed">
            Quick, free quizzes about love and relationships. Answer a few questions, get your result instantly — no account, nothing saved.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.t} className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm text-center">
              <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center mx-auto mb-3">{i + 1}</div>
              <h2 className="font-semibold text-rose-900 mb-1.5 text-sm">{s.t}</h2>
              <p className="text-xs text-rose-700/70 leading-relaxed">{s.d}</p>
            </div>
          ))}
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
              {QUIZ_BLURBS[q.slug as string] && (
                <p className="text-sm text-rose-700/60 leading-relaxed mt-2">{QUIZ_BLURBS[q.slug as string]}</p>
              )}
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

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6">Questions people ask</h2>
          <div className="space-y-4">
            {FAQS.map(f => (
              <div key={f.q} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                <h3 className="font-semibold text-rose-900 mb-2 text-sm">{f.q}</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

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
