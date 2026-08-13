// Builds the downloadable version of the printable sheets rendered by
// components/PrintableSheets.tsx. Same sentences, same blanks, same hints —
// laid out for A4 in black ink, so what you download is what the Print button
// would have put on paper.

import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from 'pdf-lib'
import { sheetHeading, type SheetMode } from './printables'

const PAGE_W = 595.28 // A4
const PAGE_H = 841.89
const MARGIN = 40 // matches @page { margin: 14mm } in the print stylesheet
const CONTENT_W = PAGE_W - MARGIN * 2
const BODY_SIZE = 11.5
const HINT_SIZE = 7.5
const FILL_LEADING = 30 // minimum room to actually write between the lines
const MAX_FILL_LEADING = 46
const FILL_GAP = 8 // extra breathing room between sentences
const PROMPT_LEADING = 15
const PROMPT_GAP = 30 // between one prompt's writing lines and the next prompt
const MIN_PROMPT_GAP = 12
const FOOTER_Y = 26
const BODY_BOTTOM = FOOTER_Y + 22

const INK = rgb(0.07, 0.07, 0.07) // #111, as the print stylesheet forces
const RULE = rgb(0.61, 0.64, 0.69) // #9ca3af
const MUTED = rgb(0.47, 0.47, 0.47) // #777

// The standard PDF fonts are WinAnsi-encoded, so anything outside Latin-1
// (plus the two dashes we actually use) has to go or pdf-lib throws.
function clean(s: string): string {
  return s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, '...')
    .replace(/[^\u0020-\u007E\u00A0-\u00FF\u2013\u2014]/g, '')
}

type Token =
  | { kind: 'word'; text: string; space: boolean }
  | { kind: 'blank'; hint: string; space: boolean }

// "You showed up when [what happened]." -> words and blanks, remembering
// whether a space preceded each one so "Dear [their name]," keeps its comma.
function tokenize(line: string): Token[] {
  const tokens: Token[] = []
  let space = false
  for (const piece of clean(line).split(/(\[[^\]]+\])/).filter(Boolean)) {
    if (piece.startsWith('[') && piece.endsWith(']')) {
      tokens.push({ kind: 'blank', hint: piece.slice(1, -1), space })
      space = false
      continue
    }
    for (const part of piece.split(/(\s+)/)) {
      if (!part) continue
      if (/^\s+$/.test(part)) space = true
      else {
        tokens.push({ kind: 'word', text: part, space })
        space = false
      }
    }
  }
  return tokens
}

export type PdfFonts = { body: PDFFont; italic: PDFFont; bold: PDFFont }

function blankWidth(hint: string, fonts: PdfFonts): number {
  const ch = fonts.body.widthOfTextAtSize('0', BODY_SIZE)
  const hintW = fonts.italic.widthOfTextAtSize(hint, HINT_SIZE) + 10
  return Math.max((hint.length + 6) * ch, 14 * ch, hintW)
}

function tokenWidth(t: Token, fonts: PdfFonts): number {
  return t.kind === 'word'
    ? fonts.body.widthOfTextAtSize(t.text, BODY_SIZE)
    : blankWidth(t.hint, fonts)
}

// Greedy wrap into lines of tokens that fit CONTENT_W.
function wrap(tokens: Token[], fonts: PdfFonts): Token[][] {
  const spaceW = fonts.body.widthOfTextAtSize(' ', BODY_SIZE)
  const lines: Token[][] = [[]]
  let w = 0
  for (const t of tokens) {
    const current = lines[lines.length - 1]
    const gap = t.space && current.length > 0 ? spaceW : 0
    const tw = tokenWidth(t, fonts)
    if (current.length > 0 && w + gap + tw > CONTENT_W) {
      lines.push([{ ...t, space: false }])
      w = tw
    } else {
      current.push(t)
      w += gap + tw
    }
  }
  return lines.filter(l => l.length > 0)
}

function wrapPlain(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of clean(text).split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word
    if (line && font.widthOfTextAtSize(next, size) > width) {
      lines.push(line)
      line = word
    } else line = next
  }
  if (line) lines.push(line)
  return lines
}

export type SheetSpec = {
  name: string
  fillIn: string[]
  sheet: SheetMode
}

export async function buildSheetPdf({ name, fillIn, sheet }: SheetSpec): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const fonts: PdfFonts = {
    body: await doc.embedFont(StandardFonts.TimesRoman),
    italic: await doc.embedFont(StandardFonts.TimesRomanItalic),
    bold: await doc.embedFont(StandardFonts.TimesRomanBold),
  }

  const heading = sheetHeading(name)
  const intro =
    sheet === 'fill-in'
      ? 'Write in the blanks. The small words under each line tell you what to reach for — cross out any line that does not fit.'
      : 'Read each line, then write your own version on the lines below it. The brackets tell you what to reach for — replace them with a detail only you could write.'

  doc.setTitle(`Printable ${heading.toLowerCase()} template`)
  doc.setAuthor('ShareLove Letters')
  doc.setCreator('shareloveletters.com')
  doc.setSubject(
    sheet === 'fill-in'
      ? 'Free printable fill-in-the-blank letter template'
      : 'Free printable letter prompt sheet'
  )

  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H])
  let y = 0

  const footer = () => {
    const text = 'shareloveletters.com — free printable letter templates. No account, no watermark.'
    const w = fonts.italic.widthOfTextAtSize(text, 8)
    page.drawText(text, {
      x: (PAGE_W - w) / 2,
      y: FOOTER_Y,
      size: 8,
      font: fonts.italic,
      color: MUTED,
    })
  }

  const header = (first: boolean) => {
    y = PAGE_H - MARGIN - 14
    const title = first
      ? heading.charAt(0).toUpperCase() + heading.slice(1)
      : `${heading.charAt(0).toUpperCase() + heading.slice(1)} (continued)`
    page.drawText(clean(title), { x: MARGIN, y, size: 15, font: fonts.bold, color: INK })
    y -= 16
    if (first) {
      for (const line of wrapPlain(intro, fonts.italic, 8.5, CONTENT_W)) {
        page.drawText(line, { x: MARGIN, y, size: 8.5, font: fonts.italic, color: MUTED })
        y -= 11
      }
    }
    y -= 8
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_W - MARGIN, y },
      thickness: 0.7,
      color: RULE,
    })
    y -= 30
    footer()
  }

  const newPage = () => {
    page = doc.addPage([PAGE_W, PAGE_H])
    header(false)
  }

  header(true)
  const available = y - BODY_BOTTOM

  if (sheet === 'fill-in') {
    const spaceW = fonts.body.widthOfTextAtSize(' ', BODY_SIZE)
    const blocks = fillIn.map(source => wrap(tokenize(source), fonts))
    const totalLines = blocks.reduce((n, b) => n + b.length, 0)
    // When the whole sheet fits on one page, spread it out — a half-empty page
    // wastes writing space someone is about to write on by hand.
    const leading =
      totalLines * FILL_LEADING + blocks.length * FILL_GAP <= available
        ? Math.min(MAX_FILL_LEADING, (available - blocks.length * FILL_GAP) / totalLines)
        : FILL_LEADING

    for (const lines of blocks) {
      // Keep a sentence and its blanks together where it fits on one page.
      if (y - lines.length * leading < BODY_BOTTOM) newPage()
      for (const line of lines) {
        if (y < BODY_BOTTOM) newPage()
        let x = MARGIN
        line.forEach((t, i) => {
          if (t.space && i > 0) x += spaceW
          if (t.kind === 'word') {
            page.drawText(t.text, { x, y, size: BODY_SIZE, font: fonts.body, color: INK })
            x += fonts.body.widthOfTextAtSize(t.text, BODY_SIZE)
          } else {
            const w = blankWidth(t.hint, fonts)
            page.drawLine({
              start: { x, y: y - 2 },
              end: { x: x + w, y: y - 2 },
              thickness: 0.8,
              color: INK,
            })
            const hw = fonts.italic.widthOfTextAtSize(t.hint, HINT_SIZE)
            page.drawText(t.hint, {
              x: x + (w - hw) / 2,
              y: y - 11,
              size: HINT_SIZE,
              font: fonts.italic,
              color: MUTED,
            })
            x += w
          }
        })
        y -= leading
      }
      y -= FILL_GAP
    }
  } else {
    const blocks = fillIn.map(source => wrapPlain(source, fonts.body, BODY_SIZE, CONTENT_W))
    const fixed = blocks.reduce((n, b) => n + b.length * PROMPT_LEADING + 40, 0)
    const gap =
      fixed + blocks.length * MIN_PROMPT_GAP <= available
        ? Math.min(PROMPT_GAP, (available - fixed) / blocks.length)
        : PROMPT_GAP

    for (const lines of blocks) {
      // The trailing gap falls off the bottom of the page harmlessly, so it is
      // not part of what has to fit.
      const blockHeight = lines.length * PROMPT_LEADING + 40
      if (y - blockHeight < BODY_BOTTOM) newPage()
      for (const line of lines) {
        page.drawText(line, { x: MARGIN, y, size: BODY_SIZE, font: fonts.body, color: INK })
        y -= PROMPT_LEADING
      }
      for (let i = 0; i < 2; i++) {
        y -= i === 0 ? 14 : 26
        page.drawLine({
          start: { x: MARGIN, y },
          end: { x: PAGE_W - MARGIN, y },
          thickness: 0.7,
          color: RULE,
        })
      }
      y -= gap
    }
  }

  return doc.save()
}
