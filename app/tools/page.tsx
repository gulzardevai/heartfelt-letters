import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { TOOLS } from '@/lib/tools'

export const metadata: Metadata = {
  title: 'Free Love Tools — Love Calculator, Quizzes, Counters & More',
  description:
    'Free, playful love tools: a love calculator, love language quiz, zodiac compatibility, nickname generator, anniversary counters and date-night questions.',
  alternates: { canonical: 'https://www.shareloveletters.com/tools' },
  openGraph: {
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'ShareLove Letters — write a letter they will keep' }],
    title: 'Free Love Tools — Love Calculator, Quizzes, Counters & More',
    description:
      'Free, playful romance tools that make you smile — then help you say the real thing in a heartfelt letter. No account needed.',
    url: 'https://www.shareloveletters.com/tools',
    type: 'website',
  },
}

// The hub is otherwise a grid of cards. These give it something to say.
const HUB_SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'What these tools are, honestly',
    body: [
      'Some of these calculate something real — days elapsed, a countdown to a date, an anniversary material for a given year. Others are games, and we say so on the pages themselves: a name-based compatibility score and a star-sign reading are not predictive of anything, and we would rather tell you that than let the number do work it cannot do.',
      'They earn their place because they are useful in a narrow way. A game gives you permission to raise a subject you were circling. A counter finds a milestone you would otherwise have missed. Neither replaces saying the thing, which is the part that actually matters.',
    ],
  },
  {
    heading: 'Which one you probably want',
    body: [
      'For a date you are waiting on, the <a href="/tools/countdown">countdown</a>; for one already behind you, the <a href="/tools/days-together">days together counter</a>. For a gift you are stuck on, <a href="/tools/anniversary-gifts">anniversary gifts by year</a> narrows the field enough to think properly.',
      'For a conversation rather than a number: the <a href="/tools/couples-questions">couples questions</a> break the logistics-only groove that long relationships fall into, and the <a href="/tools/love-language-quiz">love language quiz</a> gives two people a vocabulary for a mismatch they had both felt. If you just want to send one line, the <a href="/tools/love-note">love note reveal</a> wraps it in a small envelope.',
    ],
  },
  {
    heading: 'Free, and nothing leaves your browser',
    body: [
      'Every tool here is free with no account. They run client-side, which means the names, dates and answers you type are worked out on your own device and never sent to us or stored anywhere.',
      'When you want to say the real thing, <a href="/write">writing a letter</a> is free too — encrypted, private, and with no account needed on either side.',
    ],
  },
]

export default function ToolsHubPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.shareloveletters.com' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.shareloveletters.com/tools' },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 pt-14 pb-10 text-center">
          <nav className="text-xs text-rose-400 mb-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-rose-500">Tools</span>
          </nav>

          <div className="text-5xl mb-5">💘</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">
            Free love tools
          </h1>
          <p className="text-rose-700/70 leading-relaxed mb-4 text-left sm:text-center">
            A little collection of playful, free romance tools — a love calculator, a love language quiz,
            zodiac compatibility, a cute nickname generator, relationship counters and couples questions.
            No sign-up, nothing saved, just for fun.
          </p>
          <p className="text-rose-700/70 leading-relaxed text-left sm:text-center">
            They are the fun part. When you are ready to say the real thing, every tool leads to the same place:{' '}
            <Link href="/write" className="text-rose-600 underline hover:text-rose-800">a letter you can actually send</Link>.
          </p>
        </section>

        {/* Featured: user-generated quiz builder */}
        <section className="max-w-4xl mx-auto px-6 pb-6">
          <Link
            href="/tools/quiz"
            className="group block bg-rose-600 rounded-3xl shadow-sm p-6 sm:p-7 hover:bg-rose-700 transition-colors text-white"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">❓💘</span>
              <span className="flex-1">
                <span className="block font-serif text-lg font-bold">How well do you know me? — free quiz maker</span>
                <span className="block text-sm text-rose-100 mt-1 leading-relaxed">
                  Make your own quiz for a partner or friends, share the link, and see everyone&rsquo;s scores on a private scoreboard. Free, no sign-up.
                </span>
              </span>
              <span className="text-rose-200 group-hover:text-white transition-colors mt-1">→</span>
            </div>
          </Link>
        </section>

        {/* Tool grid */}
        <section className="max-w-4xl mx-auto px-6 pb-14">
          <div className="grid sm:grid-cols-2 gap-5">
            {TOOLS.map(tool => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group bg-white rounded-3xl border border-rose-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md hover:border-rose-200 transition-all"
              >
                <span className="text-3xl">{tool.emoji}</span>
                <span className="flex-1">
                  <span className="block font-serif text-lg font-bold text-rose-900 group-hover:text-rose-700 transition-colors">
                    {tool.name}
                  </span>
                  <span className="block text-sm text-rose-700/70 mt-1 leading-relaxed">{tool.hubTagline}</span>
                </span>
                <span className="text-rose-300 group-hover:text-rose-500 transition-colors mt-1">→</span>
              </Link>
            ))}
          </div>
        </section>

        {HUB_SECTIONS.map(s => (
          <section key={s.heading} className="max-w-2xl mx-auto px-6 pb-10">
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

        {/* Related */}
        <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
          <p className="text-sm text-rose-700/60">
            Looking for words instead? Browse{' '}
            <Link href="/letters" className="text-rose-600 underline hover:text-rose-800">letters by occasion</Link>,{' '}
            our{' '}
            <Link href="/quotes" className="text-rose-600 underline hover:text-rose-800">700+ quote library</Link>{' '}
            or the{' '}
            <Link href="/letter-themes" className="text-rose-600 underline hover:text-rose-800">letter themes</Link>.
          </p>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
          <h2 className="font-serif text-3xl font-bold text-rose-900 mb-4">Ready to write it?</h2>
          <p className="text-rose-700/70 mb-8">
            Say what you mean and send it as a sealed envelope. Free, private, no account needed.
          </p>
          <Link
            href="/write"
            className="inline-block bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Start your letter — free
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
