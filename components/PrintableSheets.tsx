'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import PrintButton from '@/components/PrintButton'

type Mode = 'fillin' | 'prompt'

interface Props {
  name: string
  emoji: string
  // LETTER_TYPES id to preselect in the editor. Omitted on the printables hub,
  // where the sheet is not tied to one occasion.
  type?: string
  fillIn: string[]
}

// "You showed up when [what happened]." -> text runs and bracketed hints.
function segments(line: string) {
  return line
    .split(/(\[[^\]]+\])/)
    .filter(Boolean)
    .map(seg =>
      seg.startsWith('[') && seg.endsWith(']')
        ? { kind: 'blank' as const, value: seg.slice(1, -1) }
        : { kind: 'text' as const, value: seg }
    )
}

// A ruled gap sized to the hint, with the hint printed small beneath it so
// you know what belongs there without it taking the writing space.
function Blank({ hint }: { hint: string }) {
  return (
    // No side margins: the spacing already lives in the sentence text, so
    // adding any here strands the comma in "Dear [their name],".
    <span
      className="fill-blank inline-flex flex-col items-center align-baseline"
      style={{ minWidth: `${Math.max(hint.length + 6, 14)}ch` }}
    >
      <span className="fill-blank-rule block w-full border-b border-rose-300" />
      <span className="fill-blank-hint block text-[10px] leading-tight text-rose-400 text-center">
        {hint}
      </span>
    </span>
  )
}

export default function PrintableSheets({ name, emoji, type, fillIn }: Props) {
  const [mode, setMode] = useState<Mode>('fillin')

  // Deep-link straight to either sheet (?sheet=prompt). Read after mount so
  // the statically rendered HTML stays the default fill-in sheet.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('sheet')
    if (q === 'prompt' || q === 'fillin') setMode(q)
  }, [])

  // Names that already end in "letter" (Love Letter, Secret Letter) must not
  // gain a second one — "printable love letter letter template".
  const raw = name.toLowerCase()
  const lower = raw.endsWith('letter') ? raw : `${raw} letter`
  const heading = raw.endsWith('letter') ? name : `${name} letter`

  return (
    <>
      <div className="text-center mb-8 no-print">
        <h2 className="font-serif text-2xl font-bold text-rose-900 mb-2">
          Printable {lower} template
        </h2>
        <p className="text-sm text-rose-700/60 max-w-xl mx-auto">
          Two ways to print it. Fill in the blanks and the page itself becomes the letter, or take
          the prompt sheet and write your own version by hand.
        </p>

        <div
          role="tablist"
          aria-label="Printable format"
          className="inline-flex mt-6 mb-5 p-1 bg-rose-50 border border-rose-100 rounded-full"
        >
          {(
            [
              ['fillin', 'Fill-in-the-blank letter'],
              ['prompt', 'Prompt sheet'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              onClick={() => setMode(value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === value
                  ? 'bg-white text-rose-900 shadow-sm'
                  : 'text-rose-600 hover:text-rose-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-rose-700/50 max-w-lg mx-auto mb-6">
          {mode === 'fillin'
            ? 'Print it, fill the blanks in pen, and give it as it is — no copying out.'
            : 'Print it, then write your own version on the lines. Best when you want the finished letter in your own words.'}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <PrintButton />
          <Link
            href={type ? `/write?type=${type}` : '/write'}
            className="inline-block bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-rose-700 transition-colors shadow-sm"
          >
            Fill it in online instead →
          </Link>
        </div>
      </div>

      <div className="print-sheet-card bg-white rounded-3xl border border-rose-100 shadow-sm p-8 md:p-12">
        <p className="font-serif text-lg font-bold text-rose-900 mb-1">
          {emoji} {heading}
        </p>
        <p className="text-xs text-rose-400 mb-8 pb-6 border-b border-rose-100">
          {mode === 'fillin'
            ? 'Write in the blanks. The small words under each line tell you what to reach for — cross out any line that is not true of the two of you.'
            : 'Read each line, then write your own version on the lines below it. The brackets tell you what to reach for — replace them with something only the two of you would know.'}
        </p>

        {mode === 'fillin' ? (
          <div className="sheet-fillin">
            {fillIn.map((line, i) => (
              <p
                key={i}
                className="font-serif text-[15px] text-rose-900/90 mb-6"
                style={{ lineHeight: 2.9 }}
              >
                {segments(line).map((seg, j) =>
                  seg.kind === 'blank' ? (
                    <Blank key={j} hint={seg.value} />
                  ) : (
                    <span key={j}>{seg.value}</span>
                  )
                )}
              </p>
            ))}
          </div>
        ) : (
          <div className="sheet-prompt">
            {fillIn.map((line, i) => (
              <div key={i} className="mb-7">
                <p className="font-serif text-[15px] text-rose-900/90 leading-relaxed">{line}</p>
                <div className="print-rule mt-4 border-b border-rose-100" />
                <div className="print-rule mt-7 border-b border-rose-100" />
              </div>
            ))}
          </div>
        )}

        <p className="text-[11px] text-rose-400 text-center pt-6 border-t border-rose-100">
          shareloveletters.com — free letter templates. Write it online and they open a sealed
          envelope with their name on it.
        </p>
      </div>
    </>
  )
}
