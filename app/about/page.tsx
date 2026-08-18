import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'About ShareLove Letters — Why We Built a Letter-Writing App',
  description: 'The story behind ShareLove Letters: a free, encrypted letter-writing app built on the belief that meaningful words deserve a better home than a chat bubble.',
  alternates: { canonical: 'https://www.shareloveletters.com/about' },
  openGraph: {
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'ShareLove Letters — write a letter they will keep' }],
    type: 'website',
    title: 'About ShareLove Letters — Why We Built a Letter-Writing App',
    description: 'The story behind ShareLove Letters: a free, encrypted letter-writing app built on the belief that meaningful words deserve a better home than a chat bubble.',
    url: 'https://www.shareloveletters.com/about',
  },
}

const organizationJsonLd = {
  '@type': 'Organization',
  '@id': 'https://www.shareloveletters.com/#organization',
  name: 'ShareLove Letters',
  url: 'https://www.shareloveletters.com',
  description: 'A free, encrypted letter-writing app for sending heartfelt letters via a private link — opened like a real envelope.',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.shareloveletters.com/favicon.ico',
  },
}

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://www.shareloveletters.com/about',
  url: 'https://www.shareloveletters.com/about',
  name: 'About ShareLove Letters',
  description: 'The story behind ShareLove Letters: a free, encrypted letter-writing app built on the belief that meaningful words deserve a better home than a chat bubble.',
  mainEntity: organizationJsonLd,
  publisher: organizationJsonLd,
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...organizationJsonLd }) }} />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-rose-50 to-pink-50 py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-5xl mb-6">💌</div>
            <h1 className="font-serif text-5xl font-bold text-rose-900 mb-6 leading-tight">
              Write Letters That<br />
              <span className="text-rose-600 italic">Last a Lifetime</span>
            </h1>
            <p className="text-lg text-rose-700/70 leading-relaxed max-w-2xl mx-auto">
              We believe that words have the power to change relationships, heal wounds, and create memories that outlast us. ShareLove Letters makes it easy to write something real.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-6 bg-white/40">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-6">Our Story</h2>
            <div className="prose prose-rose max-w-none text-rose-800/80 leading-relaxed space-y-4">
              <p>
                We built ShareLove Letters because we kept noticing the same problem: people had so much they wanted to say — to a parent, a partner, a friend — but never quite found the right moment or the right words.
              </p>
              <p>
                Texting is fast but shallow. Social media is public but impersonal. Email is professional but cold. What people needed was a space designed for something more — a tool that made the act of letter writing feel natural again.
              </p>
              <p>
                So we built one. A beautiful, distraction-free space to write the letters you&apos;ve always meant to write. With thoughtful templates to get you started, and simple sharing tools to get your words to the people who need to read them.
              </p>
            </div>
          </div>
        </section>

        {/* Who runs it — E-E-A-T */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-6">Who Makes ShareLove Letters</h2>
            <div className="prose prose-rose max-w-none text-rose-800/80 leading-relaxed space-y-4">
              <p>
                ShareLove Letters is an independent project. It is not owned by a larger company, it did not raise money to exist, and there is no growth team somewhere deciding what you should be nudged into next. It is built and maintained by the same very small group of people who answer the email — write to <a href="mailto:hello@shareloveletters.com" className="text-rose-600 underline">hello@shareloveletters.com</a> and it reaches someone who works on the site, not a support queue.
              </p>
              <p>
                That matters mostly because of what it rules out. We cannot make money from reading what you write, because letters are encrypted before they reach our database and we genuinely cannot read them. We do not sell or share letter content, we do not place advertising inside the letters themselves, and we do not harvest the addresses of people who open a letter you sent them. Those are not policies we could quietly change later — the encryption is the architecture, not a setting.
              </p>
              <p>
                We are also not therapists, counsellors or relationship professionals, and nothing on this site should be read as clinical advice. What we do have is a close working knowledge of one narrow thing — what makes a letter land — built from writing and rewriting every template here, and from the questions people send us when they are stuck halfway through. That is the only expertise we claim, and where a guide leans on research rather than on that, we say so in the guide.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy stance */}
        <section className="py-20 px-6 bg-white/40">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-6">Why Privacy Comes First</h2>
            <div className="prose prose-rose max-w-none text-rose-800/80 leading-relaxed space-y-4">
              <p>
                A letter is one of the most intimate things a person can write, so we treat every letter accordingly. Each one is encrypted with AES-256 — the same standard banks use — before it ever touches our database, which means your words are unreadable in storage, even to us. Letters are never public, never indexed by search engines, and never used for anything except being delivered to the person you chose.
              </p>
              <p>
                You can add a password so only your recipient can open a letter, write anonymously without creating an account, or seal a letter until a date in the future — it stays encrypted and undeliverable until the day arrives. We built these protections not as premium features but as defaults, because trust is the whole point of a letter.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-6">How It Works</h2>
            <div className="prose prose-rose max-w-none text-rose-800/80 leading-relaxed space-y-4">
              <p>
                Pick an occasion — from <Link href="/letters/anniversary" className="text-rose-600 underline">anniversaries</Link> and apologies to <Link href="/letters/future-self" className="text-rose-600 underline">letters to your future self</Link> — start from one of 30+ templates or a blank page, and make it yours with photos, fonts, themes, even a song or a virtual bouquet. Need the right words? Borrow a line from our <Link href="/quotes" className="text-rose-600 underline">library of 700+ quotes</Link>.
              </p>
              <p>
                When you publish, you get a private link. Your recipient opens it and finds a sealed envelope with their name on it — they tap to break the wax seal, the letter unfolds, and they can even write a reply right on the page. No app to install, no account to create, nothing between your words and the person they&apos;re for.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial standards */}
        <section className="py-20 px-6 bg-white/40">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-6">How We Write Everything Else</h2>
            <div className="prose prose-rose max-w-none text-rose-800/80 leading-relaxed space-y-4">
              <p>
                Around the letter writing there is a fair amount of other material: <Link href="/letters" className="text-rose-600 underline">templates for around thirty occasions</Link>, a <Link href="/blog" className="text-rose-600 underline">blog about writing to people</Link>, a quote library, and a set of <Link href="/tools" className="text-rose-600 underline">free tools and quizzes</Link>. All of it is written by us rather than generated and published unread, and all of it is meant to be usable by someone who has no intention of ever writing a letter here.
              </p>
              <p>
                Two rules govern it. First, we say what something is: a love calculator is a game, star-sign compatibility is not a prediction, and a personality quiz is a description rather than a diagnosis. Every one of those pages says so on the page itself, because a tool that lets you believe it is doing more than it is has stopped being a bit of fun. Second, we would rather leave a section out than pad it — if a page has three useful things to say about a subject, it says three things and stops.
              </p>
              <p>
                We change our minds in public too. When a template or a guide turns out to give bad advice, or a feature makes the writing harder rather than easier, we rewrite or remove it rather than leaving it up because it ranks. If you think something here is wrong, <Link href="/contact" className="text-rose-600 underline">tell us</Link> — corrections are the most useful mail we get.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-rose-900 text-center mb-12">What We Offer</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '📝', title: '30+ Templates', desc: 'Eleven letter types across every occasion — love, apology, gratitude, birthday, future self, and more.' },
                { icon: '🔐', title: 'Encrypted & Private', desc: 'AES-256 encryption, optional passwords, and anonymous writing. Your words stay yours.' },
                { icon: '✉️', title: 'The Envelope Moment', desc: 'Every letter arrives as a sealed envelope with a wax seal — opened with a tap, remembered forever.' },
                { icon: '⏰', title: 'Scheduled Delivery', desc: 'Seal a letter until a birthday, an anniversary, or years into the future.' },
              ].map(f => (
                <div key={f.title} className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm text-center">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="font-serif font-semibold text-rose-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-rose-600/70 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-6 bg-rose-600 text-white">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: '10+', label: 'Letter Types' },
              { stat: 'Free', label: 'To Use' },
              { stat: '30-Day', label: 'Shareable Links' },
              { stat: '0', label: 'Account Required to Read' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-serif text-3xl font-bold mb-1">{s.stat}</div>
                <div className="text-rose-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-4xl font-bold text-rose-900 mb-4">Ready to write?</h2>
            <p className="text-rose-600/70 mb-8">Someone is waiting to hear from you. It only takes a few minutes to write something they&apos;ll treasure forever.</p>
            <Link
              href="/write"
              className="inline-block bg-rose-600 text-white px-10 py-4 rounded-full text-base font-semibold hover:bg-rose-700 shadow-lg hover:shadow-xl transition-all"
            >
              Write Your First Letter
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
