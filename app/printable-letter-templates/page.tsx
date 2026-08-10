import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PrintableSheets from '@/components/PrintableSheets'
import { breadcrumbLd, itemListLd } from '@/lib/schema'
import { OCCASIONS } from '@/lib/occasions'

// "Love Letter" and "Secret Letter" already end in the word, so appending
// another gives "printable love letter letter".
const phrase = (name: string) => {
  const l = name.toLowerCase()
  return l.endsWith('letter') ? l : `${l} letter`
}

export const metadata: Metadata = {
  title: 'Printable Letter Templates — Free Fill-in-the-Blank Letters',
  description:
    'Free printable letter templates for every occasion — love, thank you, Christmas, gratitude and more. Fill in the blanks and print. No account, no watermark.',
  alternates: { canonical: 'https://www.shareloveletters.com/printable-letter-templates' },
  openGraph: {
    title: 'Printable Letter Templates — Free Fill-in-the-Blank Letters',
    description:
      'Free printable fill-in-the-blank letter templates for every occasion. Print it, write in the blanks, hand it over. No account needed.',
    url: 'https://www.shareloveletters.com/printable-letter-templates',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'ShareLove Letters — write a letter they will keep' }],
  },
}

// A deliberately occasion-agnostic sheet so the hub itself is printable, not
// just a directory of links to other pages.
const GENERAL_FILL_IN = [
  'Dear [their name],',
  'I have been meaning to write this since [when].',
  'The thing I keep coming back to is [the moment] — you were [what they were doing].',
  'What I have never told you about it is [the part you kept to yourself].',
  'Something you do without thinking that I notice every time: [the small habit].',
  'What is different in my life because of you is [the change].',
  'What I want you to know is [the one true line].',
  '[Your name]',
]

const faqs = [
  {
    q: 'What is a fill-in-the-blank letter template?',
    a: 'It is a printed letter with the sentences already written and the personal details left blank. Each blank has a small prompt underneath it — "the moment", "what they were doing", "the small habit" — so you always know what belongs there. You fill the blanks in pen and the page itself is the finished letter. There is nothing to copy out afterwards.',
  },
  {
    q: 'Are these printable letter templates really free?',
    a: 'Yes. Every printable on this page is free, with no account, no email address, no watermark and no PDF to pay for. Open the occasion you want, press Print, and write on it.',
  },
  {
    q: 'How do I print one?',
    a: 'Open any occasion below and press the Print button in the printable section. The page prints as a clean sheet in black ink — no navigation, no colours, no marketing around the edges — sized for A4 or US Letter. To save it as a file instead, choose "Save as PDF" in your printer dialog.',
  },
  {
    q: 'What is the difference between the fill-in sheet and the prompt sheet?',
    a: 'The fill-in-the-blank sheet is the letter itself with gaps in it — best when you want something finished in ten minutes. The prompt sheet prints each line as a suggestion with blank ruled lines underneath, so you write the whole letter in your own words. Both are on every occasion page; the tab at the top switches between them.',
  },
  {
    q: 'Can I use these for a class, a care home or a wedding?',
    a: 'Yes. Print as many copies as you need for classrooms, care homes, hospital wards, wedding guest tables or church groups. We only ask that you do not resell the sheets as your own product.',
  },
  {
    q: 'Can I fill it in online instead of printing it?',
    a: 'Yes. Every occasion has the same letter as an editable template — you type it in the browser, add photos or a song, and share a private link. The recipient opens a sealed envelope with their name on it. That is free and needs no account either.',
  },
]

export default function PrintableLetterTemplatesPage() {
  const jsonLd = [
    breadcrumbLd([
      { name: 'Home', path: '' },
      { name: 'Printable letter templates', path: '/printable-letter-templates' },
    ]),
    itemListLd(
      'Printable fill-in-the-blank letter templates',
      OCCASIONS.map(o => ({
        name: `Printable ${phrase(o.name)} template`,
        path: `/letters/${o.slug}#printable`,
      }))
    ),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  return (
    // `occasion-page` is the print-styles hook: it strips the nav, footer and
    // every section except .print-sheet so the sheet prints on clean paper.
    <div className="occasion-page min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-pink-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 pt-14 pb-12 text-center">
          <nav className="text-xs text-rose-400 mb-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-rose-500">Printable letter templates</span>
          </nav>

          <div className="text-5xl mb-5">🖨️</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">
            Free Printable Letter Templates
          </h1>
          <p className="text-rose-800/80 text-lg leading-relaxed mb-5 font-medium">
            Fill-in-the-blank letters for {OCCASIONS.length} occasions. Print one, write in the
            blanks, hand it over — the page itself is the letter.
          </p>
          <p className="text-rose-700/70 leading-relaxed mb-4 text-left sm:text-center">
            Most printable letter templates online are either a paid PDF or a pretty border with
            nothing written on it, which leaves you exactly where you started: staring at an empty
            page. These are different. The sentences are already there and only the personal parts
            are missing, with a small prompt printed under every blank telling you what belongs in
            it — a moment, a habit, the thing you never said.
          </p>
          <p className="text-rose-700/70 leading-relaxed mb-4 text-left sm:text-center">
            Everything here is free and instant. No account, no email address, no watermark, no
            checkout. Print as many as you want, for yourself or for a whole classroom.
          </p>
          <p className="text-rose-700/70 leading-relaxed mb-4 text-left sm:text-center">
            This page is for paper. If you would rather read the whole letter on screen and send it
            without a printer, our{' '}
            <Link href="/letters/love" className="text-rose-600 underline hover:text-rose-800">
              love letter templates
            </Link>{' '}
            are eight complete romantic letters written out in full, each one copyable in a click.
          </p>

          <a
            href="#occasions"
            className="inline-block mt-6 bg-rose-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Pick your occasion
          </a>
          <p className="text-xs text-rose-400 mt-3">Free • No account • Prints in black ink</p>
        </section>

        {/* How it works */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 md:p-10">
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6 text-center">
              How the fill-in-the-blank format works
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center mb-8">
              <div>
                <div className="text-3xl mb-3">📄</div>
                <h3 className="font-semibold text-rose-900 text-sm mb-1.5">1. Print it</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">
                  The sheet prints on its own — no navigation, no colour, no logos. A4 or US Letter.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">✍️</div>
                <h3 className="font-semibold text-rose-900 text-sm mb-1.5">2. Fill the blanks</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">
                  Each ruled gap has a prompt underneath it. Cross out any line that is not true of
                  the two of you.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">💌</div>
                <h3 className="font-semibold text-rose-900 text-sm mb-1.5">3. Hand it over</h3>
                <p className="text-xs text-rose-700/70 leading-relaxed">
                  It is finished. Nothing to copy out neatly, nothing to type up afterwards.
                </p>
              </div>
            </div>
            <div className="bg-rose-50/70 border border-rose-100 rounded-2xl px-5 py-4">
              <p className="text-sm text-rose-800/80 leading-relaxed">
                <strong className="text-rose-900">Two formats on every occasion page.</strong> The{' '}
                <em>fill-in-the-blank letter</em> is the letter itself with gaps in it. The{' '}
                <em>prompt sheet</em> prints each line as a suggestion with blank ruled lines
                underneath, for when you would rather write the whole thing in your own words. A tab
                at the top of the printable section switches between them.
              </p>
            </div>
          </div>
        </section>

        {/* A printable you can use right here */}
        <section id="printable" className="print-sheet max-w-3xl mx-auto px-6 pb-14 scroll-mt-20">
          <PrintableSheets
            name="Any occasion"
            emoji="💌"
            fillIn={GENERAL_FILL_IN}
          />
        </section>

        {/* Every printable, by occasion */}
        <section id="occasions" className="max-w-5xl mx-auto px-6 pb-14 scroll-mt-20">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-2 text-center">
            Printable letter templates by occasion
          </h2>
          <p className="text-sm text-rose-700/60 text-center mb-8 max-w-xl mx-auto">
            Each one opens straight at its printable section, with the wording written for that
            occasion — a Christmas card is not a condolence letter and the blanks are not the same.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {OCCASIONS.map(o => (
              <div
                key={o.slug}
                className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm flex flex-col"
              >
                <div className="text-3xl mb-3">{o.emoji}</div>
                <h3 className="font-serif font-semibold text-rose-900 mb-2">
                  Printable {phrase(o.name)}
                </h3>
                <p className="text-sm text-rose-700/60 leading-relaxed mb-5 flex-1 italic">
                  &ldquo;{o.fillIn[1]}&rdquo;
                </p>
                <Link
                  href={`/letters/${o.slug}#printable`}
                  className="text-sm text-center bg-rose-50 text-rose-700 px-4 py-2.5 rounded-xl hover:bg-rose-100 transition-colors font-medium"
                >
                  Open the printable →
                </Link>
                <Link
                  href={`/letters/${o.slug}?sheet=prompt#printable`}
                  className="text-xs text-center text-rose-500 hover:text-rose-700 transition-colors mt-2.5"
                >
                  or print the prompt sheet
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Online alternative */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <div className="bg-rose-600 text-white rounded-3xl shadow-md p-8 md:p-10">
            <h2 className="font-serif text-2xl font-bold mb-4">Prefer to type it?</h2>
            <p className="text-rose-50/90 leading-relaxed text-sm md:text-[15px] mb-4">
              Every printable here exists as an editable template too. You fill it in on screen, add
              photographs or a song, and share a private link — the person you sent it to opens a
              sealed envelope with their name on it. It is free, encrypted, and needs no account,
              and you can still print the finished letter afterwards if you want it on paper.
            </p>
            <Link
              href="/write"
              className="inline-block bg-white text-rose-700 px-7 py-3 rounded-full font-semibold text-sm hover:bg-rose-50 transition-colors"
            >
              Write it online — free
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6 pb-14">
          <h2 className="font-serif text-2xl font-bold text-rose-900 mb-6 text-center">
            Questions people ask
          </h2>
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
        <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
          <p className="text-sm text-rose-700/60">
            Not sure what to say?{' '}
            <Link href="/letters" className="text-rose-600 underline hover:text-rose-800">
              Read the occasion guides
            </Link>
            , borrow a line from the{' '}
            <Link href="/quotes" className="text-rose-600 underline hover:text-rose-800">
              quote library
            </Link>{' '}
            or browse our{' '}
            <Link href="/blog" className="text-rose-600 underline hover:text-rose-800">
              letter-writing guides
            </Link>
            .
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
