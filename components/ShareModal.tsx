'use client'

import toast from 'react-hot-toast'

interface Props {
  shareId: string
  onClose: () => void
}

export default function ShareModal({ shareId, onClose }: Props) {
const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/letter/${shareId}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied to clipboard!')
  }

return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 fade-in">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔗</div>
          <h2 className="font-serif text-2xl font-bold text-rose-900">Share Your Letter</h2>
          <p className="text-rose-700/60 text-sm mt-1">Anyone with the link can read this letter</p>
        </div>

        {/* Link display */}
        <div className="bg-rose-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-sm text-rose-800 outline-none font-mono truncate"
            />
            <button
              onClick={copyLink}
              className="flex-shrink-0 bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-rose-100 text-rose-700 rounded-2xl text-sm font-medium hover:bg-rose-200 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}
