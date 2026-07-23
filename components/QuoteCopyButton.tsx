'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { sendGAEvent } from '@next/third-parties/google'

export default function QuoteCopyButton({ id, text, author }: { id: string; text: string; author: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(`"${text}" — ${author}`)
    setCopied(true)
    toast.success('Quote copied!')
    sendGAEvent('event', 'quote_copied', { quote_id: id })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
        copied ? 'bg-green-100 text-green-700' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
      }`}
    >
      {copied ? '✓ Copied' : '📋 Copy'}
    </button>
  )
}
