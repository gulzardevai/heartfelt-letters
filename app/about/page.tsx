import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
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

        {/* What We Offer */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-rose-900 text-center mb-12">What We Offer</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '📝', title: '10 Letter Types', desc: 'Love, apology, gratitude, birthday, and more — each with beautiful templates.' },
                { icon: '🔒', title: 'Password Protection', desc: 'Keep your letters private with optional password protection.' },
                { icon: '🔗', title: 'Shareable Links', desc: 'Share your letter with a unique link anyone can open and read.' },
                { icon: '✨', title: 'Beautiful Presentation', desc: 'Your words deserve to be presented beautifully. Every letter looks stunning.' },
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
