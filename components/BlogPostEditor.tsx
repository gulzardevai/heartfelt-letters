'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExt from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'

type Post = {
  id?: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image: string
  author: string
  tags: string[]
  published: boolean
  meta_title: string
  meta_description: string
}

export default function BlogPostEditor({ initial }: { initial?: Partial<Post> }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<Post>({
    slug: initial?.slug ?? '',
    title: initial?.title ?? '',
    excerpt: initial?.excerpt ?? '',
    content: initial?.content ?? '',
    cover_image: initial?.cover_image ?? '',
    author: initial?.author ?? 'ShareLove Letters Team',
    tags: initial?.tags ?? [],
    published: initial?.published ?? false,
    meta_title: initial?.meta_title ?? '',
    meta_description: initial?.meta_description ?? '',
  })

  const wordCount = form.content
    .replace(/<[^>]+>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState(initial?.cover_image ?? '')
  const [showLinkPanel, setShowLinkPanel] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkNoFollow, setLinkNoFollow] = useState(false)
  const [linkNewTab, setLinkNewTab] = useState(true)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      ImageExt.configure({ inline: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
    ],
    content: initial?.content ?? '',
    onUpdate: ({ editor }) => setForm(f => ({ ...f, content: editor.getHTML() })),
    editorProps: {
      attributes: { class: 'tiptap-editor prose prose-rose max-w-none min-h-[400px] focus:outline-none p-4' },
    },
  })

  const uploadImage = async (file: File): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'blog')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) return null
    const { url } = await res.json()
    return url
  }

  const handleInlineImage = useCallback(async (file: File) => {
    const url = await uploadImage(file)
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const handleCoverUpload = async (file: File) => {
    const url = await uploadImage(file)
    if (url) {
      setForm(f => ({ ...f, cover_image: url }))
      setCoverPreview(url)
    }
  }

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }))
    }
    setTagInput('')
  }

  const removeTag = (tag: string) =>
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))

  const handleSave = async (publish?: boolean) => {
    setSaving(true)
    setError(null)
    const payload = { ...form, published: publish ?? form.published }
    if (publish) payload.published = true

    const url = initial?.id ? `/api/admin/blog/${initial.id}` : '/api/admin/blog'
    const method = initial?.id ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Failed to save')
      setSaving(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!initial?.id) return
    if (!confirm('Delete this post permanently?')) return
    setDeleting(true)
    await fetch(`/api/admin/blog/${initial.id}`, { method: 'DELETE' })
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          {initial?.id ? 'Edit Post' : 'New Blog Post'}
        </h1>
        <div className="flex items-center gap-3">
          {initial?.id && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : form.published ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => {
                  const title = e.target.value
                  setForm(f => ({ ...f, title, slug: f.slug || autoSlug(title) }))
                }}
                placeholder="Post title"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="url-friendly-slug"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                placeholder="Short description shown on blog list"
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
              />
            </div>
          </div>

          {/* Content editor */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-2 flex flex-wrap items-center gap-1 bg-gray-50">
              <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-1.5 rounded text-sm font-bold ${editor?.isActive('bold') ? 'bg-rose-100 text-rose-700' : 'text-gray-600 hover:bg-gray-100'}`}>B</button>
              <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-1.5 rounded text-sm italic ${editor?.isActive('italic') ? 'bg-rose-100 text-rose-700' : 'text-gray-600 hover:bg-gray-100'}`}>I</button>
              <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded text-sm underline ${editor?.isActive('underline') ? 'bg-rose-100 text-rose-700' : 'text-gray-600 hover:bg-gray-100'}`}>U</button>
              <div className="w-px h-5 bg-gray-300 mx-1"></div>
              <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded text-xs font-bold ${editor?.isActive('heading', { level: 2 }) ? 'bg-rose-100 text-rose-700' : 'text-gray-600 hover:bg-gray-100'}`}>H2</button>
              <button onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-1.5 rounded text-xs font-bold ${editor?.isActive('heading', { level: 3 }) ? 'bg-rose-100 text-rose-700' : 'text-gray-600 hover:bg-gray-100'}`}>H3</button>
              <div className="w-px h-5 bg-gray-300 mx-1"></div>
              <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded text-sm ${editor?.isActive('bulletList') ? 'bg-rose-100 text-rose-700' : 'text-gray-600 hover:bg-gray-100'}`}>• List</button>
              <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded text-sm ${editor?.isActive('orderedList') ? 'bg-rose-100 text-rose-700' : 'text-gray-600 hover:bg-gray-100'}`}>1. List</button>
              <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={`p-1.5 rounded text-sm ${editor?.isActive('blockquote') ? 'bg-rose-100 text-rose-700' : 'text-gray-600 hover:bg-gray-100'}`}>" Quote</button>
              <div className="w-px h-5 bg-gray-300 mx-1"></div>
              <button onClick={() => editor?.chain().focus().setTextAlign('left').run()} className="p-1.5 rounded text-xs text-gray-600 hover:bg-gray-100">≡L</button>
              <button onClick={() => editor?.chain().focus().setTextAlign('center').run()} className="p-1.5 rounded text-xs text-gray-600 hover:bg-gray-100">≡C</button>
              <div className="w-px h-5 bg-gray-300 mx-1"></div>
              <button
                onClick={() => {
                  if (!editor) return
                  if (editor.isActive('link')) {
                    editor.chain().focus().unsetLink().run()
                    return
                  }
                  const attrs = editor.getAttributes('link')
                  setLinkUrl(attrs.href || '')
                  setLinkNoFollow((attrs.rel || '').includes('nofollow'))
                  setShowLinkPanel(p => !p)
                }}
                className={`p-1.5 rounded text-xs flex items-center gap-1 ${editor?.isActive('link') ? 'bg-rose-100 text-rose-700' : 'text-gray-600 hover:bg-gray-100'}`}
                title={editor?.isActive('link') ? 'Remove link' : 'Insert link'}
              >
                🔗 {editor?.isActive('link') ? 'Unlink' : 'Link'}
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="p-1.5 rounded text-xs text-gray-600 hover:bg-gray-100 flex items-center gap-1"
              >
                📷 Image
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { if (e.target.files?.[0]) handleInlineImage(e.target.files[0]) }}
              />
            </div>
            {showLinkPanel && (
              <div className="border-b border-gray-200 px-4 py-3 bg-rose-50/40 flex flex-wrap items-center gap-3">
                <input
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 min-w-[220px] border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                />
                <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={linkNoFollow} onChange={e => setLinkNoFollow(e.target.checked)} className="accent-rose-600" />
                  nofollow
                </label>
                <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={linkNewTab} onChange={e => setLinkNewTab(e.target.checked)} className="accent-rose-600" />
                  new tab
                </label>
                <button
                  onClick={() => {
                    if (!editor || !linkUrl) return
                    const rel = linkNoFollow ? 'nofollow noopener noreferrer' : 'noopener'
                    editor.chain().focus().extendMarkRange('link')
                      .setLink({ href: linkUrl, target: linkNewTab ? '_blank' : null, rel } as never)
                      .run()
                    setShowLinkPanel(false)
                    setLinkUrl('')
                  }}
                  disabled={!linkUrl}
                  className="text-xs bg-rose-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-rose-700 transition-colors disabled:opacity-40"
                >
                  Apply
                </button>
                <button
                  onClick={() => setShowLinkPanel(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 px-2"
                >
                  Cancel
                </button>
              </div>
            )}
            <EditorContent editor={editor} />
            <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-400 text-right">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Featured image */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="block text-xs font-medium text-gray-700 mb-3">Featured Image</label>
            {coverPreview ? (
              <div className="relative">
                <img src={coverPreview} alt="" className="w-full h-40 object-cover rounded-lg" />
                <button
                  onClick={() => { setForm(f => ({ ...f, cover_image: '' })); setCoverPreview('') }}
                  className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500 shadow text-xs"
                >✕</button>
              </div>
            ) : (
              <button
                onClick={() => coverRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-rose-300 hover:text-rose-400 transition-colors"
              >
                <span className="text-3xl">🖼️</span>
                <span className="text-xs">Upload featured image</span>
              </button>
            )}
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleCoverUpload(e.target.files[0]) }}
            />
            {!coverPreview && (
              <div className="mt-2">
                <input
                  type="url"
                  value={form.cover_image}
                  onChange={e => { setForm(f => ({ ...f, cover_image: e.target.value })); setCoverPreview(e.target.value) }}
                  placeholder="Or paste image URL"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">SEO</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Meta Title
                <span className="ml-1 font-normal text-gray-400">({(form.meta_title || form.title).length}/60)</span>
              </label>
              <input
                type="text"
                value={form.meta_title}
                onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))}
                placeholder={form.title || 'Defaults to post title'}
                maxLength={60}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Meta Description
                <span className="ml-1 font-normal text-gray-400">({(form.meta_description || form.excerpt).length}/160)</span>
              </label>
              <textarea
                value={form.meta_description}
                onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))}
                placeholder={form.excerpt || 'Defaults to excerpt'}
                maxLength={160}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
              />
            </div>
            {/* Google preview */}
            <div className="bg-gray-50 rounded-lg p-3 text-xs">
              <p className="text-[11px] text-gray-400 mb-1.5 uppercase tracking-wide">Google preview</p>
              <p className="text-blue-600 truncate font-medium">
                {form.meta_title || form.title || 'Post title'}
              </p>
              <p className="text-green-700 text-[11px]">shareloveletters.com/blog/{form.slug || 'slug'}</p>
              <p className="text-gray-500 mt-0.5 line-clamp-2">
                {form.meta_description || form.excerpt || 'Post description will appear here.'}
              </p>
            </div>
          </div>

          {/* Post settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Tags</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-xs px-2 py-0.5 rounded-full">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-rose-400 hover:text-rose-700">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <button onClick={addTag} className="px-3 py-2 bg-gray-100 rounded-lg text-xs hover:bg-gray-200">Add</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Published</label>
              <button
                onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.published ? 'bg-rose-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-5' : 'translate-x-0.5'}`}></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
