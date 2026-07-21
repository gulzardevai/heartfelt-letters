// Letter themes — plain visual metadata (never touches encrypted content).
// 'classic' matches the original look exactly; existing letters default to it.

export type LetterTheme = {
  id: string
  label: string
  emoji: string
  paper: string       // letter paper background
  text: string        // body text color (must stay readable on paper)
  accent: string      // headings / signature / dividers
  envelope: {
    back1: string
    back2: string
    front1: string
    front2: string
    flap1: string
    flap2: string
    seal1: string
    seal2: string
    frontText: string // "For <name>" text on the envelope front
  }
}

export const THEMES: LetterTheme[] = [
  {
    id: 'classic',
    label: 'Classic',
    emoji: '💌',
    paper: '#fdf8f0',
    text: '#2c1810',
    accent: '#9f1239',
    envelope: {
      back1: '#fecdd3', back2: '#fda4af',
      front1: '#ffe4e6', front2: '#fff1f2',
      flap1: '#fb7185', flap2: '#f43f5e',
      seal1: '#be123c', seal2: '#881337',
      frontText: '#9f1239',
    },
  },
  {
    id: 'vintage',
    label: 'Vintage',
    emoji: '📜',
    paper: '#f5e6d3',
    text: '#43301d',
    accent: '#8b5a3c',
    envelope: {
      back1: '#d9b891', back2: '#c49a6c',
      front1: '#ead7bb', front2: '#f2e3c9',
      flap1: '#8b5a3c', flap2: '#6f4429',
      seal1: '#6f4429', seal2: '#4a2c17',
      frontText: '#6f4429',
    },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    emoji: '🌙',
    paper: '#1e2749',
    text: '#ece5cf',
    accent: '#d4af37',
    envelope: {
      back1: '#2c3a6b', back2: '#1e2749',
      front1: '#26325c', front2: '#2c3a6b',
      flap1: '#26325c', flap2: '#141b36',
      seal1: '#d4af37', seal2: '#9c7c1d',
      frontText: '#d4af37',
    },
  },
  {
    id: 'blossom',
    label: 'Blossom',
    emoji: '🌸',
    paper: '#fdf2f4',
    text: '#4a2b33',
    accent: '#db2777',
    envelope: {
      back1: '#fbcfe8', back2: '#f9a8d4',
      front1: '#fce7f3', front2: '#fdf2f8',
      flap1: '#f472b6', flap2: '#ec4899',
      seal1: '#db2777', seal2: '#9d174d',
      frontText: '#9d174d',
    },
  },
]

export const DEFAULT_THEME_ID = 'classic'

export function getTheme(id?: string | null): LetterTheme {
  return THEMES.find(t => t.id === id) || THEMES[0]
}

// CSS custom properties consumed by the envelope styles in globals.css
export function envelopeCssVars(theme: LetterTheme): Record<string, string> {
  const e = theme.envelope
  return {
    '--letter-paper': theme.paper,
    '--env-back-1': e.back1,
    '--env-back-2': e.back2,
    '--env-front-1': e.front1,
    '--env-front-2': e.front2,
    '--env-flap-1': e.flap1,
    '--env-flap-2': e.flap2,
    '--env-seal-1': e.seal1,
    '--env-seal-2': e.seal2,
  }
}
