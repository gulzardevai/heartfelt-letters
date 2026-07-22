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
  {
    name: 'Acid Tools',
    listingUrl: 'https://acidtools.com/ai/shareloveletters',
    imgSrc: 'https://acidtools.com/assets/images/badge.png',
    width: 175,
    height: 54,
  },
  {
    // SVG (vector) — intrinsic viewBox is 0 0 139 44. Their embed snippet says
    // width=150, but BADGE_MAX_WIDTH derives the rendered width from the true
    // aspect ratio, so the real intrinsic values must be used here.
    name: 'ufind.best',
    // The ?utm_source param is how ufind attributes the referral — keep it.
    listingUrl: 'https://ufind.best/products/sharelove-letters?utm_source=ufind.best',
    imgSrc: 'https://ufind.best/badges/ufind-best-badge-light.svg',
    width: 139,
    height: 44,
  },
]

// Milliseconds each badge stays visible before crossfading to the next.
export const BADGE_ROTATE_MS = 2000

// All badges render at a uniform height; width scales with each badge's aspect
// ratio. The rotating container is sized to the WIDEST rendered badge so no
// badge is cropped and the footer never shifts as they swap. Derived from the
// array above — adding a badge needs no layout change anywhere.
export const BADGE_DISPLAY_HEIGHT = 54

export const BADGE_MAX_WIDTH = BADGES.reduce(
  (max, b) => Math.max(max, Math.round((b.width * BADGE_DISPLAY_HEIGHT) / b.height)),
  0
)
