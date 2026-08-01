'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  resultUsage,
  type AdminQuiz,
  type AdminQuizQuestion,
  type AdminQuizResult,
} from '@/lib/admin-quizzes'

const inputCls =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rose-200'

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
}

export default function AdminQuizEditor({ initial }: { initial?: AdminQuiz }) {
  const router = useRouter()
  const isNew = !initial

  const [title, setTitle] = useState(initial?.title ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const [description, setDescription] = useState(initial?.description ?? '')
  const [published, setPublished] = useState(initial?.published ?? false)
  const [results, setResults] = useState<AdminQuizResult[]>(
    initial?.results ?? [
      { key: '', title: '', description: '' },
      { key: '', title: '', description: '' },
    ]
  )
  const [questions, setQuestions] = useState<AdminQuizQuestion[]>(
    initial?.questions ?? [
      { question: '', options: [{ text: '', result: '' }, { text: '', result: '' }] },
      { question: '', options: [{ text: '', result: '' }, { text: '', result: '' }] },
    ]
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resultKeys = results.map(r => r.key.trim().toLowerCase()).filter(Boolean)

  // Client-side validation mirrors the server's — shows problems before saving.
  const problems = useMemo(() => {
    const p: string[] = []
    if (!title.trim()) p.push('Title is required.')
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) p.push('Slug must be lowercase letters, numbers and dashes.')
    if (results.length < 2) p.push('Add at least 2 results.')
    if (new Set(resultKeys).size !== resultKeys.length) p.push('Result keys must be unique.')
    results.forEach((r, i) => {
      if (!r.key.trim() || !r.title.trim() || !r.description.trim()) p.push(`Result ${i + 1} needs a key, title and description.`)
    })
    if (questions.length < 2) p.push('Add at least 2 questions.')
    questions.forEach((q, i) => {
      if (!q.question.trim()) p.push(`Question ${i + 1} is empty.`)
      if (q.options.length < 2 || q.options.length > 6) p.push(`Question ${i + 1} needs 2–6 options.`)
      q.options.forEach((o, j) => {
        if (!o.text.trim()) p.push(`Question ${i + 1}, option ${j + 1} is empty.`)
        if (!resultKeys.includes(o.result)) p.push(`Question ${i + 1}, option ${j + 1} must map to a result.`)
      })
    })
    return p
  }, [title, slug, results, questions, resultKeys])

  // Balance warning: results that few/no options point at.
  const usage = useMemo(
    () => resultUsage(questions, results.filter(r => r.key.trim())),
    [questions, results]
  )
  const unbalanced = Object.entries(usage).filter(([, n]) => n < questions.length / (results.length || 1) / 2)

  const updateResult = (i: number, patch: Partial<AdminQuizResult>) =>
    setResults(rs => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  const updateQuestion = (i: number, patch: Partial<AdminQuizQuestion>) =>
    setQuestions(qs => qs.map((q, j) => (j === i ? { ...q, ...patch } : q)))

  const moveQuestion = (i: number, dir: -1 | 1) =>
    setQuestions(qs => {
      const next = [...qs]
      const t = i + dir
      if (t < 0 || t >= next.length) return qs
      ;[next[i], next[t]] = [next[t], next[i]]
      return next
    })

  async function save() {
    setError(null)
    if (problems.length) {
      setError(problems[0])
      return
    }
    setSaving(true)
    try {
      const payload = {
        slug,
        title: title.trim(),
        description: description.trim(),
        questions,
        results: results.map(r => ({ ...r, key: r.key.trim().toLowerCase() })),
        published,
      }
      const res = await fetch(isNew ? '/api/admin/quizzes' : `/api/admin/quizzes/${initial!.id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j.error || 'Failed to save quiz')
        return
      }
      router.push('/admin/quizzes')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'New Quiz' : 'Edit Quiz'}</h1>
        <Link href="/admin/quizzes" className="text-sm text-gray-500 hover:text-gray-700">← Back to quizzes</Link>
      </div>

      {/* Basics */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
          <input
            value={title}
            onChange={e => {
              setTitle(e.target.value)
              if (!slugTouched) setSlug(slugify(e.target.value))
            }}
            placeholder="e.g. What's Your Romance Style?"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Slug (/quizzes/…)</label>
          <input
            value={slug}
            onChange={e => { setSlugTouched(true); setSlug(slugify(e.target.value)) }}
            placeholder="romance-style"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            placeholder="One or two sentences shown under the quiz title."
            className={inputCls}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="accent-rose-600" />
          Published (visible at /quizzes/{slug || '…'})
        </label>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Results</h2>
          <button
            onClick={() => setResults(rs => [...rs, { key: '', title: '', description: '' }])}
            className="text-xs text-rose-600 hover:text-rose-800 font-medium"
          >
            + Add result
          </button>
        </div>
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-2">
              <div className="flex gap-2">
                <input
                  value={r.key}
                  onChange={e => updateResult(i, { key: slugify(e.target.value).replace(/-/g, '_') })}
                  placeholder="key (e.g. words)"
                  className={`${inputCls} w-40 flex-none font-mono text-xs`}
                />
                <input
                  value={r.emoji ?? ''}
                  onChange={e => updateResult(i, { emoji: e.target.value })}
                  placeholder="💬"
                  className={`${inputCls} w-16 flex-none text-center`}
                />
                <input
                  value={r.title}
                  onChange={e => updateResult(i, { title: e.target.value })}
                  placeholder="Result title"
                  className={inputCls}
                />
                <button
                  onClick={() => setResults(rs => rs.filter((_, j) => j !== i))}
                  disabled={results.length <= 2}
                  className="text-red-500 hover:text-red-700 text-xs disabled:opacity-30 flex-none"
                >
                  Remove
                </button>
              </div>
              <textarea
                value={r.description}
                onChange={e => updateResult(i, { description: e.target.value })}
                rows={2}
                placeholder="What this result means."
                className={inputCls}
              />
              <div className="flex gap-2">
                <input
                  value={r.link_href ?? ''}
                  onChange={e => updateResult(i, { link_href: e.target.value })}
                  placeholder="CTA link (e.g. /write?type=love or /letters/anniversary)"
                  className={inputCls}
                />
                <input
                  value={r.link_label ?? ''}
                  onChange={e => updateResult(i, { link_label: e.target.value })}
                  placeholder="CTA label"
                  className={inputCls}
                />
              </div>
              {r.key && (
                <p className="text-xs text-gray-400">{usage[r.key] ?? 0} option(s) map to this result</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Questions</h2>
          <button
            onClick={() =>
              setQuestions(qs => [...qs, { question: '', options: [{ text: '', result: '' }, { text: '', result: '' }] }])
            }
            className="text-xs text-rose-600 hover:text-rose-800 font-medium"
          >
            + Add question
          </button>
        </div>
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-400 flex-none">Q{i + 1}</span>
                <input
                  value={q.question}
                  onChange={e => updateQuestion(i, { question: e.target.value })}
                  placeholder="Question text"
                  className={inputCls}
                />
                <button onClick={() => moveQuestion(i, -1)} disabled={i === 0} className="text-gray-400 hover:text-gray-700 text-xs disabled:opacity-30">↑</button>
                <button onClick={() => moveQuestion(i, 1)} disabled={i === questions.length - 1} className="text-gray-400 hover:text-gray-700 text-xs disabled:opacity-30">↓</button>
                <button
                  onClick={() => setQuestions(qs => qs.filter((_, j) => j !== i))}
                  disabled={questions.length <= 2}
                  className="text-red-500 hover:text-red-700 text-xs disabled:opacity-30"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-2 pl-7">
                {q.options.map((o, j) => (
                  <div key={j} className="flex gap-2">
                    <input
                      value={o.text}
                      onChange={e =>
                        updateQuestion(i, { options: q.options.map((x, k) => (k === j ? { ...x, text: e.target.value } : x)) })
                      }
                      placeholder={`Option ${j + 1}`}
                      className={inputCls}
                    />
                    <select
                      value={o.result}
                      onChange={e =>
                        updateQuestion(i, { options: q.options.map((x, k) => (k === j ? { ...x, result: e.target.value } : x)) })
                      }
                      className={`${inputCls} w-40 flex-none`}
                    >
                      <option value="">→ result…</option>
                      {resultKeys.map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => updateQuestion(i, { options: q.options.filter((_, k) => k !== j) })}
                      disabled={q.options.length <= 2}
                      className="text-red-500 hover:text-red-700 text-xs disabled:opacity-30 flex-none"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {q.options.length < 6 && (
                  <button
                    onClick={() => updateQuestion(i, { options: [...q.options, { text: '', result: '' }] })}
                    className="text-xs text-rose-600 hover:text-rose-800"
                  >
                    + Add option
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation + warnings */}
      {problems.length > 0 && (
        <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <p className="text-xs font-semibold text-yellow-800 mb-1">Fix before saving:</p>
          <ul className="text-xs text-yellow-700 list-disc pl-4 space-y-0.5">
            {problems.slice(0, 6).map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}
      {problems.length === 0 && unbalanced.length > 0 && (
        <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-xs text-blue-700">
            Heads up — these results are picked by relatively few options and may rarely win:{' '}
            {unbalanced.map(([k, n]) => `${k} (${n})`).join(', ')}. Not blocking.
          </p>
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : isNew ? 'Create quiz' : 'Save changes'}
        </button>
        <Link href="/admin/quizzes" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
      </div>
    </div>
  )
}
