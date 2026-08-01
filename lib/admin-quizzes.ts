// Admin-authored personality quizzes (table: admin_quizzes).
// Distinct from the UGC "how well do you know me?" quiz maker (table: quizzes).
// Each option maps to one result key; the key with the most picks wins.

export type AdminQuizOption = { text: string; result: string }
export type AdminQuizQuestion = { question: string; options: AdminQuizOption[] }
export type AdminQuizResult = {
  key: string
  emoji?: string
  title: string
  description: string
  link_href?: string
  link_label?: string
}

export type AdminQuiz = {
  id: string
  slug: string
  title: string
  description: string
  questions: AdminQuizQuestion[]
  results: AdminQuizResult[]
  published: boolean
  view_count: number
  completed_count: number
  created_at: string
  updated_at: string
}

export type AdminQuizInput = {
  slug: string
  title: string
  description: string
  questions: AdminQuizQuestion[]
  results: AdminQuizResult[]
  published: boolean
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const KEY_RE = /^[a-z0-9_-]{1,32}$/

// Validates the full quiz payload. Returns cleaned data or a human-readable error.
export function validateAdminQuizInput(
  body: unknown
): { ok: true; data: AdminQuizInput } | { ok: false; error: string } {
  const b = (body ?? {}) as Record<string, unknown>

  const slug = String(b.slug ?? '').trim().toLowerCase()
  if (!SLUG_RE.test(slug) || slug.length > 60) {
    return { ok: false, error: 'Slug must be lowercase letters, numbers and dashes (max 60 chars).' }
  }
  const title = String(b.title ?? '').trim()
  if (!title || title.length > 120) return { ok: false, error: 'Title is required (max 120 chars).' }
  const description = String(b.description ?? '').trim().slice(0, 500)

  const rawResults = Array.isArray(b.results) ? b.results : []
  if (rawResults.length < 2) return { ok: false, error: 'Add at least 2 results.' }
  const results: AdminQuizResult[] = []
  const keys = new Set<string>()
  for (const r of rawResults as Record<string, unknown>[]) {
    const key = String(r?.key ?? '').trim().toLowerCase()
    if (!KEY_RE.test(key)) return { ok: false, error: `Result key "${key || '(empty)'}" is invalid — use lowercase letters/numbers.` }
    if (keys.has(key)) return { ok: false, error: `Duplicate result key "${key}".` }
    keys.add(key)
    const rTitle = String(r?.title ?? '').trim()
    const rDesc = String(r?.description ?? '').trim()
    if (!rTitle || !rDesc) return { ok: false, error: `Result "${key}" needs a title and description.` }
    results.push({
      key,
      emoji: String(r?.emoji ?? '').trim() || undefined,
      title: rTitle.slice(0, 120),
      description: rDesc.slice(0, 600),
      link_href: String(r?.link_href ?? '').trim() || undefined,
      link_label: String(r?.link_label ?? '').trim() || undefined,
    })
  }

  const rawQuestions = Array.isArray(b.questions) ? b.questions : []
  if (rawQuestions.length < 2) return { ok: false, error: 'Add at least 2 questions.' }
  if (rawQuestions.length > 30) return { ok: false, error: 'Maximum 30 questions.' }
  const questions: AdminQuizQuestion[] = []
  for (let i = 0; i < rawQuestions.length; i++) {
    const q = rawQuestions[i] as Record<string, unknown>
    const question = String(q?.question ?? '').trim()
    if (!question) return { ok: false, error: `Question ${i + 1} is empty.` }
    const rawOpts = Array.isArray(q?.options) ? q.options : []
    if (rawOpts.length < 2 || rawOpts.length > 6) {
      return { ok: false, error: `Question ${i + 1} needs 2–6 options.` }
    }
    const options: AdminQuizOption[] = []
    for (const o of rawOpts as Record<string, unknown>[]) {
      const text = String(o?.text ?? '').trim()
      const result = String(o?.result ?? '').trim().toLowerCase()
      if (!text) return { ok: false, error: `Question ${i + 1} has an empty option.` }
      if (!keys.has(result)) {
        return { ok: false, error: `Question ${i + 1}: option "${text.slice(0, 40)}" maps to unknown result "${result || '(none)'}".` }
      }
      options.push({ text: text.slice(0, 200), result })
    }
    questions.push({ question: question.slice(0, 300), options })
  }

  const published = Boolean(b.published)
  return { ok: true, data: { slug, title, description, questions, results, published } }
}

// Non-blocking balance check: how many options point at each result key.
export function resultUsage(questions: AdminQuizQuestion[], results: AdminQuizResult[]): Record<string, number> {
  const usage: Record<string, number> = {}
  for (const r of results) usage[r.key] = 0
  for (const q of questions) for (const o of q.options) {
    if (o.result in usage) usage[o.result]++
  }
  return usage
}
