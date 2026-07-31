'use client'

// Local (device-only) recall of quizzes a person has created, so they can find
// the private scoreboard link again. The owner token lives ONLY here and in the
// URL the creator saves — it is never listed publicly.

const KEY = 'sharelove_quizzes'

export type SavedQuiz = {
  id: string
  title: string
  creatorName: string
  shareUrl: string
  ownerUrl: string
  createdAt: string
}

export function getSavedQuizzes(): SavedQuiz[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function saveQuiz(q: SavedQuiz): void {
  if (typeof window === 'undefined') return
  try {
    const list = getSavedQuizzes().filter(x => x.id !== q.id)
    list.unshift(q)
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)))
  } catch {
    /* ignore quota / disabled storage */
  }
}
