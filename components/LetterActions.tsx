'use client'

interface Props {
  senderName?: string | null
}

export default function LetterActions({ senderName }: Props) {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const text = senderName
    ? `💌 ${senderName} sent a heartfelt letter`
    : '💌 A heartfelt letter'

  const enc = encodeURIComponent

  return (
    <div className="no-print flex flex-wrap items-center justify-center gap-2 mt-8">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-1.5 text-xs px-4 py-2 bg-white border border-rose-200 text-rose-700 rounded-full hover:bg-rose-50 transition-colors shadow-sm"
      >
        🖨️ Print Letter
      </button>
      <a
        href={`https://wa.me/?text=${enc(`${text}: ${pageUrl}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs px-4 py-2 bg-white border border-rose-200 text-rose-700 rounded-full hover:bg-rose-50 transition-colors shadow-sm"
      >
        💬 WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${enc(pageUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs px-4 py-2 bg-white border border-rose-200 text-rose-700 rounded-full hover:bg-rose-50 transition-colors shadow-sm"
      >
        📘 Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(pageUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs px-4 py-2 bg-white border border-rose-200 text-rose-700 rounded-full hover:bg-rose-50 transition-colors shadow-sm"
      >
        🐦 X / Twitter
      </a>
    </div>
  )
}
