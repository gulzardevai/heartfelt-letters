'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type PostRow = {
  id: string
  slug: string
  title: string
  published: boolean
  published_at: string | null
  created_at: string
  tags: string[]
  cover_image: string | null
  word_count: number
  view_count: number
}

type Filter = 'all' | 'published' | 'drafts'

export default function AdminPostsTable({ posts }: { posts: PostRow[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const filtered = posts.filter((p) => {
    if (filter === 'published' && !p.published) return false
    if (filter === 'drafts' && p.published) return false
    if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  async function togglePublished(post: PostRow) {
    setBusy(post.id)
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        alert(j.error || 'Failed to update post')
      }
      router.refresh()
    } finally {
      setBusy(null)
    }
  }

  async function deletePost(post: PostRow) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    setBusy(post.id)
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        alert(j.error || 'Failed to delete post')
      }
      router.refresh()
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
          {(['all', 'published', 'drafts'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm capitalize ${
                filter === f ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title..."
          className="flex-1 min-w-[200px] max-w-sm px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!filtered.length ? (
          <div className="text-center py-16 text-gray-400">No posts match.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Post</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Tags</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Words</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Views</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.cover_image} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center text-lg flex-shrink-0">💌</div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{post.title}</div>
                        <div className="text-gray-400 text-xs mt-0.5">/blog/{post.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <span key={tag} className="bg-rose-50 text-rose-700 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{post.word_count.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500">👁 {post.view_count.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      post.published ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                      <button
                        onClick={() => togglePublished(post)}
                        disabled={busy === post.id}
                        className="text-gray-500 hover:text-gray-800 text-xs disabled:opacity-50"
                      >
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link href={`/blog/${post.slug}`} target="_blank" className="text-gray-400 hover:text-gray-700 text-xs">
                        View ↗
                      </Link>
                      <Link href={`/admin/blog/${post.id}`} className="text-rose-600 hover:text-rose-800 text-xs font-medium">
                        Edit
                      </Link>
                      <button
                        onClick={() => deletePost(post)}
                        disabled={busy === post.id}
                        className="text-red-500 hover:text-red-700 text-xs disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
