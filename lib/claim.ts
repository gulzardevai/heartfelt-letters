// A guest publishes a letter, then signs up to follow it. Email signup bounces
// through a confirmation link, so query params do not survive the round trip —
// the share_id is parked in localStorage instead and redeemed by the dashboard
// on the first authenticated load.
export const PENDING_CLAIM_KEY = 'sharelove:pending_claim'

export function setPendingClaim(shareId: string): void {
  try {
    window.localStorage.setItem(PENDING_CLAIM_KEY, shareId)
  } catch {
    // Private mode or blocked storage: the signup still works, the letter just
    // is not auto-attached. Never let this break the signup flow.
  }
}

export function takePendingClaim(): string | null {
  try {
    const shareId = window.localStorage.getItem(PENDING_CLAIM_KEY)
    if (shareId) window.localStorage.removeItem(PENDING_CLAIM_KEY)
    return shareId
  } catch {
    return null
  }
}

// A guest who signs up to keep a bouquet or a song leaves /write mid-letter and
// may not return for minutes (email confirmation) — the draft has to survive
// that round trip or the gate costs us the letter it was meant to save.
const PENDING_DRAFT_KEY = 'sharelove:pending_draft'

export interface PendingDraft {
  selectedType: string
  content: string
  title: string
  recipientName: string
  senderName: string
  selectedTheme: string
  selectedBouquet: string | null
  songUrl: string
  scheduled: boolean
  openAt: string
}

export function setPendingDraft(draft: PendingDraft): void {
  try {
    window.localStorage.setItem(PENDING_DRAFT_KEY, JSON.stringify(draft))
  } catch {
    // Storage blocked: the signup still works, the draft just is not restored.
  }
}

export function takePendingDraft(): PendingDraft | null {
  try {
    const raw = window.localStorage.getItem(PENDING_DRAFT_KEY)
    if (!raw) return null
    window.localStorage.removeItem(PENDING_DRAFT_KEY)
    const parsed = JSON.parse(raw) as PendingDraft
    // A draft with no body is not worth restoring over a fresh composer.
    if (!parsed || typeof parsed.content !== 'string' || !parsed.content) return null
    return parsed
  } catch {
    return null
  }
}
