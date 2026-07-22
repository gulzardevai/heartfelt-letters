// Virtual bouquets — pure visual metadata, drawn as SVG (no image assets).
// A letter's `bouquet` column stores one of these ids, or null for no bouquet.

export type Bouquet = {
  id: string
  label: string
  emoji: string
  note: string          // one-line description shown in the picker
  petals: string[]      // cycled across the flowers in the arrangement
  center: string
  petalStroke?: string
  leaf: string
  stem: string
  wrap: string
  wrapShade: string
  ribbon: string
  shape: 'round' | 'daisy' | 'tulip'
}

export const BOUQUETS: Bouquet[] = [
  {
    id: 'red_roses',
    label: 'Red Roses',
    emoji: '🌹',
    note: 'A dozen deep red roses — the classic answer',
    petals: ['#dc2626', '#b91c1c', '#ef4444'],
    center: '#7f1d1d',
    leaf: '#4d7c3f',
    stem: '#4d7c3f',
    wrap: '#f5efe3',
    wrapShade: '#e6dcc8',
    ribbon: '#9f1239',
    shape: 'round',
  },
  {
    id: 'pink_peonies',
    label: 'Pink Peonies',
    emoji: '🌸',
    note: 'Soft, full peonies in blush and rose',
    petals: ['#f472b6', '#f9a8d4', '#fb7185'],
    center: '#fce7f3',
    leaf: '#6b9e5e',
    stem: '#6b9e5e',
    wrap: '#fdf2f8',
    wrapShade: '#fbcfe8',
    ribbon: '#db2777',
    shape: 'round',
  },
  {
    id: 'sunflowers',
    label: 'Sunflowers',
    emoji: '🌻',
    note: 'Bright and cheerful — for good news and better days',
    petals: ['#facc15', '#fbbf24', '#fde047'],
    center: '#92400e',
    leaf: '#3f7d3a',
    stem: '#3f7d3a',
    wrap: '#e7d3b3',
    wrapShade: '#d4bd97',
    ribbon: '#b45309',
    shape: 'daisy',
  },
  {
    id: 'white_lilies',
    label: 'White Lilies',
    emoji: '🕊️',
    note: 'Quiet and graceful — for sympathy and gentle moments',
    petals: ['#ffffff', '#fdfdfd', '#f8fafc'],
    center: '#fcd34d',
    petalStroke: '#e2e8f0',
    leaf: '#5b8266',
    stem: '#5b8266',
    wrap: '#eef2f7',
    wrapShade: '#dbe3ec',
    ribbon: '#94a3b8',
    shape: 'tulip',
  },
  {
    id: 'wildflowers',
    label: 'Wildflowers',
    emoji: '💐',
    note: 'A hand-picked mix, a little wild on purpose',
    petals: ['#f472b6', '#a78bfa', '#fbbf24', '#60a5fa', '#fb7185'],
    center: '#fef3c7',
    leaf: '#65a30d',
    stem: '#65a30d',
    wrap: '#eaf3e6',
    wrapShade: '#d3e5cd',
    ribbon: '#4d7c0f',
    shape: 'daisy',
  },
  {
    id: 'lavender',
    label: 'Lavender',
    emoji: '💜',
    note: 'Calm, fragrant purple — for rest and reassurance',
    petals: ['#a78bfa', '#c4b5fd', '#8b5cf6'],
    center: '#ede9fe',
    leaf: '#7d9d6b',
    stem: '#7d9d6b',
    wrap: '#f5f3ff',
    wrapShade: '#ddd6fe',
    ribbon: '#7c3aed',
    shape: 'tulip',
  },
]

export function getBouquet(id?: string | null): Bouquet | null {
  if (!id) return null
  return BOUQUETS.find(b => b.id === id) ?? null
}
