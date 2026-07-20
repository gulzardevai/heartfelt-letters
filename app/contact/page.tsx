'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const FAQS = [
  { q: 'How long do letters last?', a: 'Letters on the free plan are accessible for 30 days from the date they are created. After that, they expire and the link will no longer work.' },
  { q: 'Is Heartfelt Letters free?', a: 'Yes! Creating an account and writing letters is completely free. The free plan lets you create up to 10 letters.' },
  { q: 'Can I password-protect my letter?', a: 'Yes. When saving your letter, you can optionally set a password. Anyone who receives the link will need to enter the password to read it.' },
  { q: 'How do I share a letter?', a: 'After saving your letter, you will receive a unique shareable link. You can send this link to anyone via email, text, or any messaging app. No account is required to read a letter.' },
  { q: 'Can I edit a letter after saving it?', a: 'Currently, once a letter is saved, it creates a new version each time. You can write a new letter at any time from your dashboard.' },
  { q: 'What happens when my letter expires?', a: 'After 30 days, the letter\'s shareable link will no longer work. The letter is removed from your dashboard. We do not currently send expiry reminders, so note the date when you create it.' },
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-rose-50 to-pink-50 py-16 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-serif text-4xl font-bold text-rose-900 mb-4">Get in Touch</h1>
            <p className="text-rose-600/70">Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.</p>
            <p className="text-rose-500 text-sm mt-2">hello@heartfeltletters.app</p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
          {/* Contact form */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6">Send us a message</h2>
            {submitted ? (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">💌</div>
                <h3 className="font-serif text-xl font-semibold text-rose-900 mb-2">Message received!</h3>
                <p className="text-rose-600/70 text-sm">Thanks for reaching out. We&apos;ll get back to you within 1-2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-rose-700 mb-1.5">Your name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Jane Smith"
                    className="w-full border border-rose-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-rose-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full border border-rose-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-rose-700 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    required
                    placeholder="How can we help?"
                    className="w-full border border-rose-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-rose-700 mb-1.5">Message</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full border border-rose-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-rose-600 text-white py-3 rounded-2xl text-sm font-semibold hover:bg-rose-700 transition-colors shadow-sm"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {FAQS.map((faq, i) => (
                <div key={i} className="border-b border-rose-100 pb-5">
                  <h3 className="font-semibold text-rose-900 text-sm mb-2">{faq.q}</h3>
                  <p className="text-sm text-rose-600/70 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
