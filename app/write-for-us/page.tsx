import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const TITLE = 'Write for Us — Guest Posts on Letters & Relationships'
const DESCRIPTION =
  'Pitch a guest post to ShareLove Letters. We publish a small number of original pieces on letter writing, relationships and human connection. Read the guidelines first.'
const URL = 'https://www.shareloveletters.com/write-for-us'

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'ShareLove Letters — write for us' }],
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
  },
}

const MAILTO = 'mailto:hello@shareloveletters.com?subject=Guest%20post%20pitch%3A%20%3Ctopic%3E'

const TOPICS: { title: string; desc: string }[] = [
  { title: 'Letter-writing craft', desc: 'Structure, openings, endings, tone — how a letter is actually built.' },
  { title: 'Relationships & communication', desc: 'Repair, honesty, the conversations people put off having.' },
  { title: 'Family & parenting letters', desc: 'Letters to children, to parents, to the people we grew up beside.' },
  { title: 'Friendship', desc: 'Long friendships, drifting ones, and the letters that hold them.' },
  { title: 'Grief & remembrance', desc: 'Writing to someone who has died, and writing for those left behind.' },
  { title: 'Long distance', desc: 'Distance, time zones, deployment, and staying close on paper.' },
  { title: 'Gratitude practice', desc: 'Saying thank you properly, and what it changes for the writer.' },
  { title: 'Journaling & self-reflection', desc: 'Unsent letters, letters to your future self, writing to think.' },
  { title: 'Letters in history & culture', desc: 'Correspondence that mattered, and what it can still teach us.' },
]

const ANGLES = [
  'What a hospice volunteer learns about the letters people leave behind',
  'The apology letter I sent ten years too late — and what I got wrong in it',
  'How to write to a friend you have not spoken to since the fallout',
  'Why "I hope you are well" is the worst opening line in letter writing',
  'Writing to a parent with dementia: what still lands',
  'The military spouse letter routine that survived three deployments',
  'What 200 unsent letters in my notes app taught me about resentment',
  'How Victorian letter etiquette quietly still governs the way we write',
  'A therapist on the difference between a letter that heals and one that reopens',
]

const DONT = [
  'AI-generated or spun drafts. We can tell, and it is an instant no.',
  'Keyword-stuffed writing, or anything built backwards from a search phrase.',
  'Casino, crypto, pharma, adult, loans, essay mills, or anything adjacent.',
  'Posts written mainly to place a link. If the link is the point, skip us.',
  'Previously published work, including on your own blog, Medium or LinkedIn.',
  'Affiliate links, tracking parameters, or product placements of any kind.',
  'Invented statistics, or "studies show" with nothing to show for it.',
  'Paid placements and link exchanges — we do not sell links, at any price.',
]

const FAQ = [
  {
    q: 'Do you pay contributors?',
    a: 'No. We are a small, free site with no advertising budget behind it, and we would rather say that plainly than dress up an unpaid pitch as an opportunity. People write for us because they have something specific to say about letters and want it read by people who care about that.',
  },
  {
    q: 'Can I include a link to my site?',
    a: 'You get a byline with one link to your own site or portfolio. Links inside the body are added only where they genuinely help the reader, at our editorial discretion, and any link may be nofollow. We do not guarantee link placement or link attributes to anyone.',
  },
  {
    q: 'Do you accept AI-written drafts?',
    a: 'No. We publish first-person experience and specific detail, which is exactly what generated drafts do not have. If a submission reads as machine-written we decline it and do not respond to follow-ups.',
  },
  {
    q: 'How long until I hear back?',
    a: 'If your pitch is a fit you will usually hear from us within two weeks. Because of the volume of unsuitable pitches we receive, we reply only when we are interested — no reply after two weeks means no.',
  },
  {
    q: 'Can I republish the piece elsewhere?',
    a: 'No. Published pieces are exclusive to ShareLove Letters. You keep the copyright to your work and grant us the right to publish and edit it; in return we ask that it does not appear anywhere else, including your own blog.',
  },
  {
    q: 'Do you accept sponsored posts?',
    a: 'No. We do not publish sponsored, paid or client-placed content, and we do not take part in link exchanges. Pitches offering money for a post are deleted unread.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': URL,
  url: URL,
  name: 'Write for ShareLove Letters',
  description: DESCRIPTION,
  isPartOf: { '@type': 'WebSite', name: 'ShareLove Letters', url: 'https://www.shareloveletters.com' },
}

export default function WriteForUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([webPageJsonLd, faqJsonLd]) }}
      />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 sm:py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-5xl mb-6">✍️</div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-rose-900 mb-6 leading-tight">
              Write for ShareLove Letters
            </h1>
            <p className="text-lg text-rose-700/80 leading-relaxed mb-4">
              We&apos;re looking for a handful of writers with something real to say about letters, relationships and the way people stay close to each other.
            </p>
            <p className="text-rose-700/70 leading-relaxed">
              An honest note before you pitch: this is a small independent site, not a publication with a masthead. We publish a few guest pieces a month and turn down most of what arrives. If you want a fast link, this is the wrong door. If you want a well-edited piece read by people who actually write letters, keep reading.
            </p>
            <a
              href={MAILTO}
              className="inline-flex items-center justify-center min-h-[44px] mt-8 bg-rose-600 text-white px-8 py-3 rounded-full text-base font-semibold hover:bg-rose-700 shadow-lg hover:shadow-xl transition-all"
            >
              Send a pitch
            </a>
          </div>
        </section>

        {/* What we're looking for */}
        <section className="py-16 px-6 bg-white/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-4">What we&apos;re looking for</h2>
            <p className="text-rose-800/75 leading-relaxed max-w-3xl mb-10">
              Everything we publish sits somewhere near the act of writing to another person. If your idea would feel at home beside the guides on our <Link href="/blog" className="text-rose-600 underline">blog</Link>, it&apos;s in range.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TOPICS.map(t => (
                <div key={t.title} className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
                  <h3 className="font-serif font-semibold text-rose-900 mb-2">{t.title}</h3>
                  <p className="text-sm text-rose-600/75 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="font-serif text-2xl font-bold text-rose-900 mt-14 mb-4">Example angles</h3>
            <p className="text-rose-800/75 leading-relaxed max-w-3xl mb-6">
              These are the shape of thing that gets a yes — specific, first-hand, and impossible to write without having lived or reported it. Don&apos;t pitch these exact titles; pitch the one only you could write.
            </p>
            <ul className="space-y-3 max-w-3xl">
              {ANGLES.map(a => (
                <li key={a} className="flex gap-3 text-rose-800/85 leading-relaxed">
                  <span className="text-rose-400 shrink-0">✦</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What we don't publish */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-4">What we don&apos;t publish</h2>
            <p className="text-rose-800/75 leading-relaxed mb-8">
              Said politely, but we do mean all of it. Most pitches we receive fail on this list alone.
            </p>
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-100 shadow-sm">
              <ul className="space-y-4">
                {DONT.map(d => (
                  <li key={d} className="flex gap-3 text-rose-800/85 leading-relaxed">
                    <span className="text-rose-400 shrink-0">✗</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Submission guidelines */}
        <section className="py-16 px-6 bg-white/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-6">Submission guidelines</h2>
            <div className="prose prose-rose max-w-none text-rose-800/85 leading-relaxed space-y-4">
              <p>
                <strong>Length.</strong> 900 words minimum, and no upper limit that matters — say the whole thing, then cut what isn&apos;t doing work. A tight 1,100 words beats a padded 2,000 every time.
              </p>
              <p>
                <strong>Voice.</strong> First person is welcome and usually better. We would rather read what happened to you than a survey of what is generally believed.
              </p>
              <p>
                <strong>Sources.</strong> Every factual claim gets a link to a primary source — the study, the archive, the original reporting, not a listicle citing a listicle. No invented statistics, and no numbers you cannot point at. If you are not sure a claim holds, cut it.
              </p>
              <p>
                <strong>Structure.</strong> Break the piece with real H2s that describe what follows. One clear takeaway the reader can act on. Skip the throat-clearing intro — start at the moment something happened, not at &ldquo;in today&apos;s fast-paced world&rdquo;.
              </p>
              <p>
                <strong>Formatting.</strong> Plain text or a Google Doc link is perfect. No HTML, no inline styling, no embedded images we don&apos;t have rights to.
              </p>
              <p>
                <strong>Pitch first.</strong> Send a suggested title and two or three sentences on the angle before you write anything. We will almost always shape the idea with you, and a finished draft sent cold is much more likely to be declined.
              </p>
              <p>
                <strong>Ownership.</strong> You keep the copyright to your work. By publishing with us you grant us the right to publish and edit it — we edit for clarity and length and will show you anything substantive before it goes live. Your piece must be original and stay exclusive to ShareLove Letters.
              </p>
              <p>
                To calibrate, read a few of the pieces we publish: <Link href="/blog/unsent-letters-to-someone-you-love" className="text-rose-600 underline">unsent letters to someone you love</Link>, <Link href="/blog/letter-to-my-future-self-examples" className="text-rose-600 underline">letters to your future self</Link>, and <Link href="/blog/apology-letter-to-boyfriend" className="text-rose-600 underline">apology letters</Link>. Then look at our <Link href="/letters" className="text-rose-600 underline">occasion pages</Link> and <Link href="/about" className="text-rose-600 underline">about page</Link> so your pitch doesn&apos;t duplicate something already here.
              </p>
            </div>
          </div>
        </section>

        {/* How to submit */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-6">How to submit</h2>
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-100 shadow-sm">
              <p className="text-rose-800/85 leading-relaxed mb-6">
                Email <a href={MAILTO} className="text-rose-600 underline break-words">hello@shareloveletters.com</a> with the subject line:
              </p>
              <p className="font-mono text-sm sm:text-base bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-rose-900 mb-6 break-words">
                Guest post pitch: &lt;topic&gt;
              </p>
              <ul className="space-y-3 text-rose-800/85 leading-relaxed mb-6">
                <li className="flex gap-3"><span className="text-rose-400 shrink-0">1.</span><span>Your suggested title and a two-to-three sentence pitch.</span></li>
                <li className="flex gap-3"><span className="text-rose-400 shrink-0">2.</span><span>Two links to things you have written before.</span></li>
                <li className="flex gap-3"><span className="text-rose-400 shrink-0">3.</span><span>One line about who you are and why this subject is yours.</span></li>
              </ul>
              <p className="text-rose-700/75 text-sm leading-relaxed mb-6">
                We read everything and reply only if it&apos;s a fit, usually within two weeks. No reply after that means it wasn&apos;t one — please don&apos;t follow up more than once.
              </p>
              <a
                href={MAILTO}
                className="inline-flex items-center justify-center min-h-[44px] bg-rose-600 text-white px-8 py-3 rounded-full text-base font-semibold hover:bg-rose-700 shadow-lg hover:shadow-xl transition-all"
              >
                Email your pitch
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 bg-white/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-8">Guest post FAQ</h2>
            <div className="space-y-4">
              {FAQ.map(f => (
                <div key={f.q} className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
                  <h3 className="font-serif font-semibold text-rose-900 mb-2">{f.q}</h3>
                  <p className="text-rose-700/80 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-rose-900 mb-4">Not here to pitch?</h2>
            <p className="text-rose-700/75 mb-8 leading-relaxed">
              That&apos;s the better use of this site anyway. Write someone an actual letter — it takes a few minutes and they&apos;ll keep it.
            </p>
            <Link
              href="/write"
              className="inline-flex items-center justify-center min-h-[44px] bg-rose-600 text-white px-10 py-4 rounded-full text-base font-semibold hover:bg-rose-700 shadow-lg hover:shadow-xl transition-all"
            >
              Write a Letter
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
