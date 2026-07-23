import Link from 'next/link'
import BadgeStrip from './BadgeStrip'

export default function Footer() {
  return (
    <footer className="border-t border-rose-100 bg-white/40 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💌</span>
              <span className="font-serif text-lg font-bold text-rose-900">ShareLove Letters</span>
            </div>
            <p className="text-sm text-rose-600/70 leading-relaxed">
              Write letters that last a lifetime. Share them with the people who matter most.
            </p>
            <a href="mailto:hello@shareloveletters.com" className="inline-block mt-3 text-sm text-rose-500 hover:text-rose-700 transition-colors">
              ✉️ hello@shareloveletters.com
            </a>
            <a
              href="https://launchory.app/startups/sharelove-letters?ref=badge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://launchory.app/api/badge/sharelove-letters?theme=light"
                alt="Featured on Launchory"
                width={240}
                height={54}
              />
            </a>
          </div>
          <div>
            <h4 className="font-semibold text-rose-900 mb-3 text-sm uppercase tracking-wide">Pages</h4>
            <ul className="space-y-2 text-sm text-rose-600/70">
              <li><Link href="/about" className="hover:text-rose-800 transition-colors">About</Link></li>
              <li><Link href="/letters" className="hover:text-rose-800 transition-colors">Letters by Occasion</Link></li>
              <li><Link href="/blog" className="hover:text-rose-800 transition-colors">Blog</Link></li>
              <li><Link href="/quotes" className="hover:text-rose-800 transition-colors">Quotes</Link></li>
              <li><Link href="/compare" className="hover:text-rose-800 transition-colors">Why Us?</Link></li>
              <li><Link href="/contact" className="hover:text-rose-800 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-rose-900 mb-3 text-sm uppercase tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm text-rose-600/70">
              <li><Link href="/privacy" className="hover:text-rose-800 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-rose-800 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <BadgeStrip />
        <div className="border-t border-rose-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-rose-400">
          <p>© {new Date().getFullYear()} ShareLove Letters. All rights reserved.</p>
          <p>Free to use • Made with ❤️</p>
        </div>
      </div>
    </footer>
  )
}
