'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  senderName?: string | null
}

const btnCls =
  'group relative flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white border border-rose-200 text-base lg:text-lg shadow-md hover:bg-rose-50 hover:scale-110 transition-all'

function Label({ text }: { text: string }) {
  return (
    <span className="hidden lg:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-rose-900 text-white text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      {text}
    </span>
  )
}

export default function LetterActions({ senderName }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const text = senderName
    ? `💌 ${senderName} sent a heartfelt letter`
    : '💌 A heartfelt letter'

  const enc = encodeURIComponent

  if (!mounted) return null

  // Portal to <body>: position:fixed breaks inside transformed/animated
  // ancestors (the envelope reveal), so render outside them entirely.
  return createPortal(
    <div className="no-print fixed z-40 flex flex-row gap-2.5 bottom-4 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-md rounded-full px-3 py-2 shadow-lg border border-rose-100 lg:bg-transparent lg:backdrop-blur-none lg:shadow-none lg:border-0 lg:px-0 lg:py-0 lg:rounded-none lg:bottom-auto lg:top-24 lg:left-1/2 lg:translate-x-[23rem] lg:flex-col">
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
    </div>,
    document.body
  )
}
