import { notFound } from 'next/navigation'
import { buildSheetPdf } from '@/lib/printable-pdf'
import {
  allPrintables,
  getPrintable,
  pdfFilename,
  printableWriteUrl,
  type SheetMode,
} from '@/lib/printables'

// The sheets are built from code, not from the database, so every PDF can be
// generated once at build time and served as a static file.
export const dynamic = 'force-static'

const SHEETS: Record<string, SheetMode> = {
  'fill-in.pdf': 'fill-in',
  'prompt.pdf': 'prompt',
}

export function generateStaticParams() {
  return allPrintables().flatMap(p =>
    Object.keys(SHEETS).map(sheet => ({ slug: p.slug, sheet }))
  )
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string; sheet: string } }
) {
  const sheet = SHEETS[params.sheet]
  const printable = getPrintable(params.slug)
  if (!sheet || !printable) notFound()

  const pdf = await buildSheetPdf({
    name: printable.name,
    fillIn: printable.fillIn,
    sheet,
    qrUrl: printableWriteUrl(printable),
  })

  return new Response(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(pdf.byteLength),
      // Hand over a file, not a browser tab.
      'Content-Disposition': `attachment; filename="${pdfFilename(printable.name, sheet)}"`,
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
