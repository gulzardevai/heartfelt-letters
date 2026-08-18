import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MyQuizzes from '@/components/tools/MyQuizzes'

export const dynamic = 'force-static'

const URL = 'https://www.shareloveletters.com/tools/quiz'

export const metadata: Metadata = {
  title: 'How Well Do You Know Me Quiz Maker — Free, No Sign-Up',
  description:
    'Free "how well do you know me?" quiz maker: build a quiz, share the link, and see everyone\'s scores on a private scoreboard. Great for couples & friends.',
  alternates: { canonical: URL },
  openGraph: {
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'ShareLove Letters — write a letter they will keep' }],
    title: 'How Well Do You Know Me Quiz Maker — Free & Shareable',
    description:
      'Build a "how well do you know me?" quiz, share it with your partner, friends and family, and watch their scores land on your private scoreboard. Free, no account.',
    url: URL,
    type: 'website',
  },
}

const faqs = [
  {
    q: 'How do I make a "how well do you know me?" quiz?',
    a: 'Click Create your quiz, add your name, then write 3 to 15 multiple-choice questions about yourself and mark your own answer as the correct one. When you are done you get a share link to send to friends and a private scoreboard link that only you can see.',
  },
  {
    q: 'Is it free? Do I need an account?',
    a: 'It is completely free and there is no sign-up. You do not need an account to build a quiz or to take one — just create it and share the link.',
  },
  {
    q: 'How do I see who took my quiz and their scores?',
    a: 'When you create a quiz you get a private scoreboard link. It is the only way to view everyone who took the quiz and how they scored, ranked highest to lowest. We also save it on the device you built the quiz on so you can find it again.',
  },
  {
    q: 'Can people who take my quiz see everyone else\'s scores?',
    a: 'No. People who take your quiz only see their own score. The full scoreboard of everyone\'s results is private to you, the creator, through your secret scoreboard link.',
  },
  {
    q: 'Can I use this as a couples quiz or a quiz for my boyfriend or girlfriend?',
    a: 'Yes. It works as a couples quiz, a boyfriend or girlfriend quiz, a best-friend quiz, or a family game — you write the questions, so you decide how well someone has to know you to score well. Add questions about your favourites, your habits and your shared memories, then send the link and compare scores.',
  },
  {
    q: 'Is my quiz private?',
    a: 'Your quiz is not listed anywhere or shown in search results — it is only reachable by the link you share. The only personal detail a taker gives is a display name, which is shared with you as the creator so you know who scored what.',
  },
]

// The builder is client-side, so these sections are the substance of the page
// for a crawler and for anyone deciding whether it is worth two minutes.
const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'What makes a good question',
    body: [
      'The instinct is to write questions that are hard, and hard questions make a worse quiz. If nobody can score above three, the result is not funny and there is nothing to compare — the interesting spread comes from a mix where roughly half the questions are gettable by anyone who pays attention and the rest separate the people who really know you.',
      'The best-performing questions are specific and slightly mundane: which side of the bed, the order you do things in the morning, the one food you will not eat, the film you have watched most times. Avoid anything that turns on a single conversation you had once, because that tests memory of an event rather than knowledge of a person, and avoid anything with two defensible answers — you will spend the rest of the evening arguing about the marking rather than the scores.',
    ],
  },
  {
    heading: 'Couples, friends and family all play it differently',
    body: [
      'As a couples quiz it works best when the questions are ordinary rather than romantic. "What did I order the first time we went out" is a better question than "when did you know", because the second one is a test of sentiment and the first is a test of attention, and attention is what people actually want to be measured on.',
      'With friends and family, the same quiz becomes a competition, and the scoreboard is doing most of the work. Send one link to a group chat and the ranking generates its own conversation — siblings comparing scores, someone insisting a question was unfair. For a group, ten to twelve questions is about right; for one person, six is plenty.',
    ],
  },
  {
    heading: 'Why the scoreboard is private',
    body: [
      'Takers see only their own score, and the full ranking is visible to you alone through a separate secret link. That split is deliberate. People answer honestly when a low score is between them and you, and start guessing strategically the moment they know everyone will see the number.',
      'The scoreboard link is the only route to those results, so treat it like a key: it is saved on the device you built the quiz on, and it is worth sending yourself a copy. Anyone you forward it to can see every score, which is fine if you meant to and awkward if you did not.',
    ],
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.shareloveletters.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.shareloveletters.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'How Well Do You Know Me Quiz', item: URL },
  ],
}

export default function QuizHubPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-2xl mx-auto px-6 pt-14 pb-8 text-center">
          <nav className="text-xs text-rose-400 mb-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/tools" className="hover:text-rose-600 transition-colors">Tools</Link>
            <span className="mx-2">›</span>
            <span className="text-rose-500">Quiz</span>
          </nav>

          <div className="qz-float-emoji text-5xl mb-5" aria-hidden="true">❓💘</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">
            How well do you know me?
            <span className="block text-2xl md:text-3xl text-rose-500 mt-2">A free quiz maker</span>
          </h1>
          <p className="text-rose-700/70 leading-relaxed mb-4 text-left sm:text-center">
            Build your own free &ldquo;how well do you know me?&rdquo; quiz in a couple of minutes, then share the link with
            your partner, boyfriend or girlfriend, friends or family. As people take it, their scores land on a private
            scoreboard that only you can see — ranked from who knows you best to who has some catching up to do.
          </p>
          <p className="text-rose-700/70 leading-relaxed mb-8 text-left sm:text-center">
            It is the classic couple-and-friends game, made shareable. No account, nothing to install — just write your questions,
            mark your own answers, and send the link.
          </p>

          <Link
            href="/tools/quiz/create"
            className="inline-block bg-rose-600 text-white px-10 py-4 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Create your quiz — free →
          </Link>
          <p className="text-xs text-rose-400 mt-3">Free forever · no sign-up · takes 2 minutes</p>
        </section>

        {/* Quizzes saved on this device */}
        <MyQuizzes />

        {/* How it works */}
        <section className="max-w-2xl mx-auto px-6 pb-14">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6 text-center">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { n: '1', t: 'Build it', d: 'Add your name and 3–15 multiple-choice questions about yourself. Mark your own answer as correct.' },
              { n: '2', t: 'Share it', d: 'Get a link to send to friends and partners. They enter their name and take the quiz.' },
              { n: '3', t: 'See the scores', d: 'Everyone\'s results appear on your private scoreboard, ranked from highest to lowest.' },
            ].map(s => (
              <div key={s.n} className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm text-center">
                <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center mx-auto mb-3">{s.n}</div>
                <h3 className="font-semibold text-rose-900 mb-1.5 text-sm">{s.t}</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial guidance — the builder is client-side, so this is what a
            crawler and a first-time reader actually get from the page. */}
        {SECTIONS.map(s => (
          <section key={s.heading} className="max-w-2xl mx-auto px-6 pb-10">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-4">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="text-rose-800/75 leading-relaxed mb-4">{p}</p>
            ))}
          </section>
        ))}

        {/* Funnel CTA into /write */}
        <section className="max-w-2xl mx-auto px-6 pb-14">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 text-center">
            <div className="text-3xl mb-3">💌</div>
            <p className="text-rose-700/80 mb-6 max-w-md mx-auto">
              A quiz is a lovely bit of fun. When you want to say something that lasts, write them a real letter.
            </p>
            <Link
              href="/write?type=love"
              className="inline-block bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
            >
              Write a real letter →
            </Link>
            <p className="text-xs text-rose-400 mt-4">Free, private and encrypted — no account needed.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto px-6 pb-14">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6 text-center">Questions people ask</h2>
          <div className="space-y-4">
            {faqs.map(f => (
              <div key={f.q} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                <h3 className="font-semibold text-rose-900 mb-2 text-sm">{f.q}</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="max-w-2xl mx-auto px-6 pb-16 text-center">
          <p className="text-sm text-rose-700/60 mb-4">Keep exploring</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <Link href="/tools/couples-questions" className="text-sm bg-white border border-rose-100 text-rose-700 px-4 py-2 rounded-full hover:bg-rose-50 transition-colors">Couples questions</Link>
            <Link href="/tools/love-language-quiz" className="text-sm bg-white border border-rose-100 text-rose-700 px-4 py-2 rounded-full hover:bg-rose-50 transition-colors">Love language quiz</Link>
            <Link href="/quotes/love" className="text-sm bg-white border border-rose-100 text-rose-700 px-4 py-2 rounded-full hover:bg-rose-50 transition-colors">Love quotes</Link>
            <Link href="/tools" className="text-sm bg-white border border-rose-100 text-rose-700 px-4 py-2 rounded-full hover:bg-rose-50 transition-colors">All love tools</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
