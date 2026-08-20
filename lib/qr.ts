// QR codes, generated in-process — never by a hosted QR image service, because
// the thing we would be handing over is a private letter link. `qrcode` gives
// us the raw module matrix in both Node (the printable PDFs) and the browser
// (the share modal), so the same code draws pdf-lib rectangles and SVG paths.

import QRCode from 'qrcode'

// The spec asks for a four-module quiet zone; without it phone cameras
// struggle against a busy background.
export const QR_QUIET = 4

export type QrCode = {
  size: number // modules per side, before the quiet zone
  span: number // modules per side, including the quiet zone
  dark: (row: number, col: number) => boolean
}

export function qrCode(text: string): QrCode {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: 'M' })
  return {
    size: modules.size,
    span: modules.size + QR_QUIET * 2,
    dark: (row, col) => Boolean(modules.get(row, col)),
  }
}

// Horizontal runs of dark modules, merged — one rectangle per run instead of
// one per module, which keeps the PDF content stream small and the SVG to a
// single path node. Coordinates are in modules, origin top-left, quiet zone
// already applied.
export function qrRuns(qr: QrCode): { x: number; y: number; w: number }[] {
  const runs: { x: number; y: number; w: number }[] = []
  for (let row = 0; row < qr.size; row++) {
    let start = -1
    for (let col = 0; col <= qr.size; col++) {
      const dark = col < qr.size && qr.dark(row, col)
      if (dark && start < 0) start = col
      else if (!dark && start >= 0) {
        runs.push({ x: start + QR_QUIET, y: row + QR_QUIET, w: col - start })
        start = -1
      }
    }
  }
  return runs
}

// A ready-to-render SVG path for React: <svg viewBox={viewBox}><path d={path} /></svg>
export function qrSvg(text: string): { path: string; viewBox: string } {
  const qr = qrCode(text)
  const path = qrRuns(qr)
    .map(r => `M${r.x} ${r.y}h${r.w}v1h-${r.w}z`)
    .join('')
  return { path, viewBox: `0 0 ${qr.span} ${qr.span}` }
}
