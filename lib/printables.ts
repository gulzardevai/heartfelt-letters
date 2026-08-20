// The printable letter sheets, in one place, so the on-page version
// (components/PrintableSheets.tsx) and the downloadable PDF
// (/printables/[slug]/[sheet]) can never drift apart.

import { OCCASIONS } from './occasions'

export type SheetMode = 'fill-in' | 'prompt'

// The printables hub is not tied to one occasion, so it carries its own sheet.
export const GENERAL_SLUG = 'any-occasion'

export const GENERAL_FILL_IN = [
  'Dear [their name],',
  'I have been meaning to write this since [when].',
  'The thing I keep coming back to is [the moment] — you were [what they were doing].',
  'What I have never told you about it is [the part you kept to yourself].',
  'Something you do without thinking that I notice every time: [the small habit].',
  'What is different in my life because of you is [the change].',
  'What I want you to know is [the one true line].',
  '[Your name]',
]

export type Printable = {
  slug: string
  name: string
  fillIn: string[]
  type?: string // LETTER_TYPES id, so the sheet can link back into /write
}

const PRINTABLES: Printable[] = [
  { slug: GENERAL_SLUG, name: 'Any occasion', fillIn: GENERAL_FILL_IN },
  ...OCCASIONS.map(o => ({ slug: o.slug, name: o.name, fillIn: o.fillIn, type: o.type })),
]

export function getPrintable(slug: string): Printable | undefined {
  return PRINTABLES.find(p => p.slug === slug)
}

export function allPrintables(): Printable[] {
  return PRINTABLES
}

// Where the QR code on a printed sheet lands. The sheets are occasion
// templates, not copies of one person's letter, so there is no per-letter URL
// to encode here — the honest target is the digital version of the same
// letter, with the occasion already chosen.
export function printableWriteUrl(p: Printable): string {
  const params = new URLSearchParams()
  if (p.type) params.set('type', p.type)
  params.set('utm_source', 'printable')
  params.set('utm_medium', 'qr')
  return `https://www.shareloveletters.com/write?${params.toString()}`
}

// "Love Letter" and "Secret Letter" already end in the word, so appending
// another gives "love letter letter".
export function sheetHeading(name: string): string {
  return name.toLowerCase().endsWith('letter') ? name : `${name} letter`
}

// The name the file lands under in someone's Downloads folder — it has to make
// sense a week later, out of context.
export function pdfFilename(name: string, sheet: SheetMode): string {
  const base = sheetHeading(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return sheet === 'prompt'
    ? `${base}-prompt-sheet-template.pdf`
    : `${base}-fill-in-the-blank-template.pdf`
}
