// Directory "Featured on" badges shown in the site footer.
//
// !! READ BEFORE CHANGING !!
// These badges exist so directory verification bots can confirm our backlink.
// Two rules must never be broken:
//   1. EVERY badge link must be present in the server-rendered HTML at ALL times.
//      The footer strip rotates VISIBILITY ONLY (CSS opacity) — never conditionally
//      render, mount/unmount, or lazy-load a badge. Bots read the raw HTML source.
//   2. The links must stay DO-FOLLOW. Never add rel="nofollow" or rel="sponsored".
//      rel="noopener" only (required alongside target="_blank").
// Keep the href and imgSrc exactly as the directory supplied them.
//
// Adding a directory = add one entry to this array. Nothing else to change.

export type DirectoryBadge = {
  name: string
  listingUrl: string
  imgSrc: string
  width: number
  height: number
}

export const BADGES: DirectoryBadge[] = [
  {
    name: 'Good AI Tools',
    listingUrl: 'https://goodaitools.com/ai/shareloveletters',
    imgSrc: 'https://goodaitools.com/assets/images/badge.png',
    width: 207,
    height: 54,
  },
]

// Milliseconds each badge stays visible before crossfading to the next.
export const BADGE_ROTATE_MS = 2000
