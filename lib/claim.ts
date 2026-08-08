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
