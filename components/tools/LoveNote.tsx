'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ResultShare from './ResultShare'

// A tiny, delightful preview of the /write product: someone types a short note,
// gets a private shareable link, and the recipient sees it open like a little
// envelope. The note is encoded into the URL (like the other tool permalinks) —
// no backend. The message is NEVER placed in the OG card or page meta (see
// cardFor in lib/tools-result), so it stays behind the reveal.
type NoteState = { m?: string; t?: string; f?: string }

const MAX = 500

export default function LoveNote({ initial = null }: { initial?: NoteState | null }) {
  // Reveal mode: a note arrived in the /r/<data> permalink.
  if (initial && typeof initial.m === 'string' && initial.m.trim()) {
    return <Reveal note={initial} />
  }
  return <Builder />
}

/* ---------------------------------------------------------------- */
/* Builder — the indexable /tools/love-note surface                  */
/* ---------------------------------------------------------------- */

function Builder() {
  const [m, setM] = useState('')
  const [to, setTo] = useState('')
  const [from, setFrom] = useState('')
  const [built, setBuilt] = useState<NoteState | null>(null)

  const create = () => {
    const msg = m.trim()
    if (!msg) return
    setBuilt({
      m: msg.slice(0, MAX),
      t: to.trim() || undefined,
      f: from.trim() || undefined,
    })
  }

  if (built) {
    return (
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 text-center">
        <div className="text-5xl mb-3 envelope-wiggle">💌</div>
        <h2 className="font-serif text-2xl font-bold text-rose-900">Your love note is ready</h2>
        <p className="text-sm text-rose-700/70 mt-2 max-w-sm mx-auto">
          Send this link. When they open it, your note unfolds from a little envelope — no app, no sign-up.
        </p>

        <ResultShare slug="love-note" state={built} label="Send your note to them" />

        <p className="text-[11px] text-rose-400 mt-4 max-w-sm mx-auto">
          Heads up: your words travel inside the link, so anyone who has it can open the note. It is made for
          sharing a sweet surprise, not for secrets.
        </p>
        <button
          onClick={() => setBuilt(null)}
          className="mt-4 text-sm text-rose-500 hover:text-rose-700 underline"
        >
          Write another note
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8">
      <label className="block">
        <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Your love note</span>
        <textarea
          value={m}
          onChange={e => setM(e.target.value.slice(0, MAX))}
          maxLength={MAX}
          rows={4}
          placeholder="e.g. Just a little reminder, in the middle of your day, that you are the best thing that ever happened to me."
          className="mt-1.5 w-full rounded-xl border border-rose-200 px-4 py-3 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none leading-relaxed"
        />
      </label>
      <div className="mt-1 text-right text-[11px] text-rose-400">{m.length}/{MAX}</div>

      <div className="grid sm:grid-cols-2 gap-4 mt-2">
        <label className="block">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">To (optional)</span>
          <input
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="e.g. Sam"
            className="mt-1.5 w-full rounded-xl border border-rose-200 px-4 py-3 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">From (optional)</span>
          <input
            value={from}
            onChange={e => setFrom(e.target.value)}
            placeholder="e.g. Alex"
            className="mt-1.5 w-full rounded-xl border border-rose-200 px-4 py-3 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </label>
      </div>

      <button
        onClick={create}
        disabled={!m.trim()}
        className="mt-5 w-full bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Create the reveal link 💌
      </button>
      <p className="mt-3 text-[11px] text-rose-400 text-center">
        Free, no sign-up. Your note is encoded into the link right here in your browser — nothing is saved on our servers.
      </p>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Reveal — the /tools/love-note/r/<data> permalink (noindex)        */
/* ---------------------------------------------------------------- */

function Reveal({ note }: { note: NoteState }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Respect reduced-motion: skip the sealed beat and show the note at once.
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setOpen(true)
      return
    }
    const id = setTimeout(() => setOpen(true), 750)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-10 text-center overflow-hidden">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open your love note"
          className="mx-auto flex flex-col items-center py-6"
        >
          <span className="text-7xl envelope-wiggle">💌</span>
          <span className="mt-5 text-sm font-medium text-rose-500">Tap to open your love note</span>
        </button>
      ) : (
        <div className="fade-in">
          {note.t ? (
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide mb-4">For {note.t}</p>
          ) : null}
          <div className="text-4xl mb-5">💞</div>
          <blockquote className="font-serif text-xl sm:text-2xl text-rose-900 leading-relaxed whitespace-pre-wrap max-w-md mx-auto">
            {note.m}
          </blockquote>
          {note.f ? <p className="mt-5 text-rose-600 font-medium">— {note.f}</p> : null}

          <div className="mt-9 border-t border-rose-50 pt-6">
            <p className="text-sm text-rose-700/70 mb-4 max-w-sm mx-auto">
              Felt lovely, didn&rsquo;t it? Send one back — or say the whole of it in a real letter they can keep.
            </p>
            <Link
              href="/write?type=love"
              className="inline-block bg-rose-600 text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
            >
              Write your own love note →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
