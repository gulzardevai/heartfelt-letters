import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-rose-100 bg-white/40 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💌</span>
              <span className="font-serif text-lg font-bold text-rose-900">ShareLove Letters</span>
            </div>
            <p className="text-sm text-rose-600/70 leading-relaxed">
              Write letters that last a lifetime. Share them with the people who matter most.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-rose-900 mb-3 text-sm uppercase tracking-wide">Pages</h4>
            <ul className="space-y-2 text-sm text-rose-600/70">
              <li><Link href="/about" className="hover:text-rose-800 transition-colors">About</Link></li>
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
        <div className="border-t border-rose-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-rose-400">
          <p>© 2025 ShareLove Letters. All rights reserved.</p>
          <p>Free to use • Made with ❤️</p>
        </div>
      </div>
    </footer>
  )
}
