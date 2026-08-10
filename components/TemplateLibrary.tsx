'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { sendGAEvent } from '@next/third-parties/google'
import type { Template } from '@/lib/templates'

function CopyTemplateButton({ template }: { template: Template }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText((template.body || []).join('\n\n'))
    setCopied(true)
    toast.success('Template copied — paste it anywhere')
    sendGAEvent('event', 'template_copied', { template_id: template.id })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className={`text-sm px-4 py-2.5 rounded-xl transition-all font-medium ${
        copied ? 'bg-green-100 text-green-700' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
      }`}
    >
      {copied ? '✓ Copied' : '📋 Copy this template'}
    </button>
  )
}

export default function TemplateLibrary({ templates }: { templates: Template[] }) {
  return (
    <div className="space-y-6">
      {templates.map(t => {
        const body = t.body || []
        const words = body.join(' ').split(/\s+/).filter(Boolean).length
        return (
          <article
            key={t.id}
            id={t.id}
            className="bg-white rounded-3xl border border-rose-100 shadow-sm p-7 md:p-9 scroll-mt-20"
          >
            <h3 className="font-serif text-xl md:text-2xl font-bold text-rose-900 mb-2">{t.name}</h3>
            <p className="text-sm text-rose-700/70 leading-relaxed mb-6">
              <strong className="text-rose-900 font-semibold">Use it when:</strong> {t.when}{' '}
              <span className="text-rose-400">About {words} words.</span>
            </p>

            <div className="bg-cream/60 border border-rose-100 rounded-2xl px-6 py-6 md:px-8 md:py-7 mb-6">
              {body.map((p, i) => (
                <p
                  key={i}
                  className="font-serif text-[15px] md:text-base text-rose-900/90 leading-relaxed mb-4 last:mb-0"
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <CopyTemplateButton template={t} />
              <Link
                href={`/write?type=${t.type}&template=${t.id}`}
                className="text-sm px-4 py-2.5 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors"
              >
                Write this one →
              </Link>
            </div>
            <p className="text-xs text-rose-400 mt-3">
              Everything in [brackets] is yours to replace. Cross out any line that is not true of
              the two of you.
            </p>
          </article>
        )
      })}
    </div>
  )
}
