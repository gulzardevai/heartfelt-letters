'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { resultPermalink, storyImageUrl } from '@/lib/tools-share'
import { shareTextFor } from '@/lib/tools-result'

// Shared "make this result a thing you can send" bar: native share sheet
// (with copy-link fallback), copy link, and a save-as-Story-image download.
// `state` is the encoded-into-the-URL result state for this tool.
export default function ResultShare({
  slug,
  state,
  label = 'Send this to them',
}: {
  slug: string
  state: unknown
  label?: string
}) {
  const [downloading, setDownloading] = useState(false)
  const url = resultPermalink(slug, state)
  const text = shareTextFor(slug, state)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied — paste it to them')
    } catch {
      toast.error('Could not copy the link')
    }
  }

  const share = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'ShareLove Letters', text, url })
      } catch {
        /* user dismissed the share sheet — no-op */
      }
    } else {
      copy()
    }
  }

  const download = async () => {
    setDownloading(true)
    try {
      const res = await fetch(storyImageUrl(slug, state))
      const blob = await res.blob()
      const objUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objUrl
      a.download = `sharelove-${slug}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(objUrl)
    } catch {
      toast.error('Could not save the image')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="mt-6 border-t border-rose-50 pt-5">
      <p className="text-center text-xs font-semibold text-rose-400 uppercase tracking-wide mb-3">
        {label}
      </p>
      <div className="flex flex-wrap justify-center gap-2.5">
        <button
          onClick={share}
          className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-rose-700 transition-colors shadow-sm"
        >
          Share 💞
        </button>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 bg-white border border-rose-200 text-rose-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-rose-50 transition-colors"
        >
          Copy link
        </button>
        <button
          onClick={download}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 bg-white border border-rose-200 text-rose-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-rose-50 transition-colors disabled:opacity-50"
        >
          {downloading ? 'Saving…' : 'Save as image'}
        </button>
      </div>
      <p className="text-center text-[11px] text-rose-400 mt-3">
        Opening the link shows this exact result — and unfurls as a card in chats.
      </p>
    </div>
  )
}
