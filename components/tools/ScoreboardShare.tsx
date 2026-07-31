'use client'
import toast from 'react-hot-toast'

// Small bar on the owner scoreboard to re-share the public quiz link (never the
// private owner link).
export default function ScoreboardShare({ shareUrl, title }: { shareUrl: string; title: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied')
    } catch {
      toast.error('Could not copy.')
    }
  }

  const share = async () => {
    const text = `${title} — take my quiz and see how well you really know me 💌`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl })
      } catch {
        /* dismissed */
      }
    } else {
      copy()
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-4">
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={shareUrl}
          onFocus={e => e.target.select()}
          className="flex-1 rounded-xl border border-rose-200 px-3.5 py-2.5 text-sm text-rose-700 bg-rose-50/40 min-w-0"
        />
        <button
          onClick={share}
          className="shrink-0 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors"
        >
          Share
        </button>
        <button
          onClick={copy}
          className="shrink-0 bg-white border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-50 transition-colors"
        >
          Copy
        </button>
      </div>
      <p className="text-[11px] text-rose-400 mt-2 text-center">Send this link to get more people on the board.</p>
    </div>
  )
}
