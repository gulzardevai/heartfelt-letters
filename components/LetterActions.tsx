'use client'

interface Props {
  senderName?: string | null
}

const btnCls =
  'group relative flex items-center justify-center w-11 h-11 rounded-full bg-white border border-rose-200 text-lg shadow-md hover:bg-rose-50 hover:scale-110 transition-all'

function Label({ text }: { text: string }) {
  return (
    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-rose-900 text-white text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      {text}
    </span>
  )
}

export default function LetterActions({ senderName }: Props) {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const text = senderName
    ? `💌 ${senderName} sent a heartfelt letter`
    : '💌 A heartfelt letter'

  const enc = encodeURIComponent

  return (
    <div className="no-print fixed right-3 sm:right-5 top-4 sm:top-6 z-40 flex flex-col gap-2.5">
      <button onClick={() => window.print()} className={btnCls} aria-label="Print letter">
        <Label text="Print letter" />
        🖨️
      </button>
      <a
        href={`https://wa.me/?text=${enc(`${text}: ${pageUrl}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnCls}
        aria-label="Share on WhatsApp"
      >
        <Label text="Share on WhatsApp" />
        💬
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${enc(pageUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnCls}
        aria-label="Share on Facebook"
      >
        <Label text="Share on Facebook" />
        📘
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(pageUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnCls}
        aria-label="Share on X"
      >
        <Label text="Share on X" />
        🐦
      </a>
    </div>
  )
}
