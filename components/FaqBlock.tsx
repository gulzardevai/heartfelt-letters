type Faq = { q: string; a: string }

// Server-renderable FAQ section + matching FAQPage JSON-LD.
// Mirrors the inline FAQ pattern on /compare so any funnel page can reuse it.
export default function FaqBlock({
  faqs,
  className = '',
}: {
  faqs: Faq[]
  className?: string
}) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section className={`max-w-3xl mx-auto px-6 pb-20 ${className}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h2 className="font-serif text-3xl font-bold text-rose-900 mb-8 text-center">
        Frequently asked questions
      </h2>
      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
            <h3 className="font-semibold text-rose-900 mb-2">{f.q}</h3>
            <p className="text-sm text-rose-700/70 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
