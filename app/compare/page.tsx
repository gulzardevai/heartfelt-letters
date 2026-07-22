import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ShareLove Letters vs Competitors — Why We\'re Different',
  description: 'See how ShareLove Letters compares to Digital Love Letters, FutureMe, Paperless Post, Hallmark, Canva and anonymous letter sites. Free, private, no account required.',
}

const competitors = [
  {
    name: 'Digital Love Letters',
    focus: 'Online love letters',
    price: 'Paid plans',
    weakness: 'Focused almost entirely on romantic letters, requires an account to start writing, and premium features sit behind paid plans. No quote library, no anonymous writing.',
  },
  {
    name: 'Paperless Post',
    focus: 'Digital greeting cards',
    price: 'Paid coins per send',
    weakness: 'Designed for short greetings, not meaningful long-form letters. Requires payment to send anything beyond a basic card.',
  },
  {
    name: 'Hallmark Cards Online',
    focus: 'E-cards & physical cards',
    price: '$2–$10 per card',
    weakness: 'Generic templates with little personalization. Physical cards cost money and take days to arrive.',
  },
  {
    name: 'Canva',
    focus: 'Visual design tool',
    price: 'Free / $15/mo Pro',
    weakness: 'A full design suite — overkill for writing a letter. No sharing via link, no recipient experience, no letter-specific templates.',
  },
  {
    name: 'Google Docs',
    focus: 'Word processing',
    price: 'Free',
    weakness: 'Zero emotional design. Sharing requires giving someone a Google Drive link. No templates, no beautiful presentation for the recipient.',
  },
  {
    name: 'Bond (app)',
    focus: 'Handwritten notes',
    price: '$3–$6 per note',
    weakness: 'Physical delivery only, charges per letter, slow delivery. No instant sharing, no digital link.',
  },
  {
    name: 'FutureMe',
    focus: 'Letters to your future self',
    price: 'Free / paid Premium',
    weakness: 'Only delivers letters to yourself, and only by email on a scheduled date. Requires an account and email verification, and many letters end up in a public archive. No way to write to someone else.',
  },
  {
    name: 'Dear You / Letters Anonymous',
    focus: 'Public anonymous confession walls',
    price: 'Free',
    weakness: 'Your letter is posted to a public wall for strangers to read — the person it was written for never actually receives it. No private delivery to a recipient, no password protection.',
  },
]

const features = [
  { feature: 'Purpose-built for letters', us: true, dll: true, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'All occasions, not just romance', us: true, dll: false, paperless: true, hallmark: true, canva: true, docs: true },
  { feature: '30 letter templates by type', us: true, dll: false, paperless: false, hallmark: true, canva: false, docs: false },
  { feature: 'Rich text editor', us: true, dll: true, paperless: false, hallmark: false, canva: true, docs: true },
  { feature: 'Share via private link', us: true, dll: true, paperless: true, hallmark: false, canva: false, docs: true },
  { feature: 'Password protection', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: true },
  { feature: 'AES-256 encrypted letters', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Envelope opening animation', us: true, dll: false, paperless: true, hallmark: false, canva: false, docs: false },
  { feature: 'Letter themes (vintage, midnight...)', us: true, dll: false, paperless: true, hallmark: true, canva: true, docs: false },
  { feature: 'Recipients can reply on the letter', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Schedule a letter to open on a future date', us: true, dll: false, paperless: true, hallmark: true, canva: false, docs: false },
  { feature: 'No account needed to start', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Image uploads', us: true, dll: true, paperless: true, hallmark: false, canva: true, docs: true },
  { feature: '700+ quote library', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Anonymous writing', us: true, dll: false, paperless: false, hallmark: false, canva: false, docs: false },
  { feature: 'Free to use', us: true, dll: false, paperless: false, hallmark: false, canva: true, docs: true },
]

const Check = () => (
  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-sm font-bold">✓</span>
)
const Cross = () => (
  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-400 text-sm">✕</span>
)

export default function ComparePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <span className="inline-block bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-6">
            Honest comparison
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">
            Why ShareLove Letters?<br />
            <span className="text-rose-500">The honest answer.</span>
          </h1>
          <p className="text-rose-700/70 text-lg leading-relaxed max-w-2xl mx-auto">
            There are plenty of tools for sending cards and documents. None of them were built specifically for writing meaningful, long-form letters to the people you love. We were.
          </p>
        </section>

        {/* Competitor breakdown */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-8 text-center">How we compare to the alternatives</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {competitors.map((c) => (
              <div key={c.name} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">{c.price}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">{c.focus}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{c.weakness}</p>
              </div>
            ))}

            {/* Us */}
            <div className="bg-rose-600 rounded-2xl p-6 shadow-sm text-white md:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold">💌 ShareLove Letters</h3>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">Free</span>
              </div>
              <p className="text-xs text-rose-200 mb-3 font-medium uppercase tracking-wide">Purpose-built letter writing</p>
              <ul className="text-sm text-rose-100 space-y-1.5 leading-relaxed">
                <li>✓ Built only for writing letters — nothing else</li>
                <li>✓ 30 templates across 10 emotional categories</li>
                <li>✓ Beautiful presentation for whoever receives it</li>
                <li>✓ AES-256 encrypted — unreadable even in our database</li>
                <li>✓ Share via private link, optionally with a password</li>
                <li>✓ Recipients can reply right on the letter</li>
                <li>✓ Schedule any letter to unseal on a future date — to someone else or your future self</li>
                <li>✓ Four letter themes — vintage, midnight &amp; more</li>
                <li>✓ Write anonymously or with an account</li>
                <li>✓ Free — no coins, no subscriptions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-8 text-center">Feature by feature</h2>
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-rose-100">
                    <th className="text-left px-6 py-4 font-semibold text-gray-700 w-48">Feature</th>
                    <th className="px-4 py-4 text-center">
                      <span className="font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full text-xs whitespace-nowrap inline-block">💌&nbsp;Us</span>
                    </th>
                    <th className="px-4 py-4 text-center text-xs text-gray-500 font-medium">Digital Love Letters</th>
                    <th className="px-4 py-4 text-center text-xs text-gray-500 font-medium">Paperless Post</th>
                    <th className="px-4 py-4 text-center text-xs text-gray-500 font-medium">Hallmark</th>
                    <th className="px-4 py-4 text-center text-xs text-gray-500 font-medium">Canva</th>
                    <th className="px-4 py-4 text-center text-xs text-gray-500 font-medium">Google Docs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50">
                  {features.map((row) => (
                    <tr key={row.feature} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-6 py-3.5 text-gray-700">{row.feature}</td>
                      <td className="px-4 py-3.5 text-center">{row.us ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3.5 text-center">{row.dll ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3.5 text-center">{row.paperless ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3.5 text-center">{row.hallmark ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3.5 text-center">{row.canva ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3.5 text-center">{row.docs ? <Check /> : <Cross />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* The real difference */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-10 md:p-14">
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-6 text-center">The real difference</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-semibold text-rose-900 mb-2">Built for one thing</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">
                  Every decision we make is optimised for one goal: helping you write something that truly moves another person.
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="font-semibold text-rose-900 mb-2">The recipient experience</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">
                  When someone opens your letter, they see a beautifully presented page — not a shared doc or a forwarded email.
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="font-semibold text-rose-900 mb-2">Private by design</h3>
                <p className="text-sm text-rose-700/70 leading-relaxed">
                  Every letter is encrypted with bank-grade AES-256 — unreadable even in our own database.
                  Password protect any letter, write anonymously, and know your words go only where you intend.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
          <h2 className="font-serif text-3xl font-bold text-rose-900 mb-4">Ready to write something real?</h2>
          <p className="text-rose-700/70 mb-8">No account needed to start. Write your first letter in under 2 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/write"
              className="bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
            >
              Write a Letter — Free
            </Link>
            <Link
              href="/about"
              className="border border-rose-200 text-rose-700 px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
