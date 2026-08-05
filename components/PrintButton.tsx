'use client'

// Triggers the browser print dialog. The print stylesheet in globals.css
// (.print-sheet / .no-print) strips the page chrome so only the letter
// template lands on paper.
export default function PrintButton({ label = 'Print this template' }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 bg-white border border-rose-200 text-rose-700 px-5 py-2.5 rounded-full text-sm font-medium hover:border-rose-300 hover:text-rose-900 transition-colors shadow-sm"
    >
      <span aria-hidden="true">🖨️</span>
      {label}
    </button>
  )
}
