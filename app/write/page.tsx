'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { LETTER_TYPES, TEMPLATES, getTemplatesForType } from '@/lib/templates'
import { THEMES, DEFAULT_THEME_ID, getTheme } from '@/lib/themes'
import LetterTypeCard from '@/components/LetterTypeCard'
import TemplateCard from '@/components/TemplateCard'
import ShareModal from '@/components/ShareModal'
import EmailModal from '@/components/EmailModal'
import { useAuth } from '@/components/AuthProvider'
import { sendGAEvent } from '@next/third-parties/google'

const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => (
    <div className="border border-rose-100 rounded-2xl overflow-hidden bg-white shadow-paper min-h-[400px] flex items-center justify-center">
      <div className="text-rose-300 text-sm">Loading editor...</div>
    </div>
  )
})

type Step = 'type' | 'template' | 'write'

// <input type="datetime-local"> works in local time; convert both ways.
function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function minLocalInput(): string {
  return toLocalInput(new Date(Date.now() + 5 * 60 * 1000).toISOString())
}

function WritePageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [step, setStep] = useState<Step>('type')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [senderName, setSenderName] = useState('')
  const [selectedTheme, setSelectedTheme] = useState(DEFAULT_THEME_ID)
  const [scheduled, setScheduled] = useState(false)
  const [openAt, setOpenAt] = useState('')
  const [showReplyBanner, setShowReplyBanner] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedShareId, setSavedShareId] = useState<string | null>(null)
  const [letterHasPassword, setLetterHasPassword] = useState(false)

  const [showShareModal, setShowShareModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const editId = searchParams.get('edit')
  const replyTo = searchParams.get('replyTo')
  const replyToName = searchParams.get('to') || ''

  useEffect(() => {
    if (!editId && replyTo) {
      // Reply flow: pre-fill names swapped from the original letter
      if (replyToName) setRecipientName(replyToName)
      const from = searchParams.get('from')
      if (from) setSenderName(from)
      setShowReplyBanner(true)
      sendGAEvent('event', 'letter_reply_started')
    }
    if (editId) {
      setEditLoading(true)
      fetch(`/api/letters/${editId}?owner=1`)
        .then(r => r.json())
        .then(({ letter }) => {
          if (!letter) return
          setSelectedType(letter.type)
          setTitle(letter.title || '')
          setRecipientName(letter.recipient_name || '')
          setSenderName(letter.sender_name || '')
          setSelectedTheme(letter.theme || DEFAULT_THEME_ID)
          if (letter.open_at) {
            setScheduled(true)
            setOpenAt(toLocalInput(letter.open_at))
          }
          setContent(letter.content)
          setSavedShareId(letter.share_id)
          setLetterHasPassword(!!letter.has_password)
          setStep('write')
        })
        .finally(() => setEditLoading(false))
    } else if (selectedType) {
      setStep('template')
    }
  }, [])

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
    setSelectedTemplate('')
    setContent('')
    setStep('template')
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = TEMPLATES.find(t => t.id === templateId)
    if (template) setContent(template.content)
    setStep('write')
  }

  const handleBlankStart = () => {
    setSelectedTemplate('')
    setContent('')
    setStep('write')
  }

  const handleSave = async () => {
    if (!selectedType) {
      toast.error('Please select a letter type')
      return
    }
    if (!content || content === '<p></p>') {
      toast.error('Please write something in your letter')
      return
    }
    if (!recipientName.trim()) {
      toast.error('Please add the recipient\'s name')
      return
    }
    if (!senderName.trim()) {
      toast.error('Please add your name')
      return
    }
    if (scheduled && (!openAt || new Date(openAt).getTime() <= Date.now())) {
      toast.error('Pick a future date and time for the letter to open')
      return
    }
    setIsSaving(true)
    try {
      const isUpdate = !!savedShareId
      const res = await fetch('/api/letters', {
        method: isUpdate ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isUpdate ? { share_id: savedShareId } : {}),
          type: selectedType,
          content,
          title: title || null,
          recipient_name: recipientName || null,
          sender_name: senderName || null,
          theme: selectedTheme,
          open_at: scheduled && openAt ? new Date(openAt).toISOString() : null,
        }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        if (res.status === 429 && errData.code === 'ANON_LIMIT_REACHED') {
          toast.error('1 letter per day for guests. Sign up free for 10/month!', { duration: 5000 })
          return
        }
        if (res.status === 403 && errData.code === 'LIMIT_REACHED') {
          toast.error('You\'ve reached 10 letters this month. Limit resets on a rolling 30-day basis.', { duration: 5000 })
          return
        }
        throw new Error(errData.error || 'Failed to save')
      }
      const data = await res.json()
      setSavedShareId(data.share_id)
      toast.success(savedShareId ? 'Letter updated!' : 'Letter published!')
      sendGAEvent('event', savedShareId ? 'letter_updated' : 'letter_published', {
        letter_type: selectedType,
        scheduled: scheduled && !!openAt,
      })
      setShowShareModal(true)
    } catch {
      toast.error('Failed to save letter')
    } finally {
      setIsSaving(false)
    }
  }


  const selectedTypeData = LETTER_TYPES.find(t => t.id === selectedType)
  const templates = selectedType ? getTemplatesForType(selectedType) : []

  if (authLoading || editLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-rose-400 text-sm">{editLoading ? 'Loading letter...' : 'Loading...'}</div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-y-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">💌</span>
            <span className="font-serif font-bold text-rose-800 hidden md:inline">ShareLove Letters</span>
          </Link>

          {/* Steps indicator */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            {(['type', 'template', 'write'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                {i > 0 && <span className="text-rose-200 mx-0.5 sm:mx-1">›</span>}
                <button
                  onClick={() => {
                    if (s === 'type') setStep('type')
                    if (s === 'template' && selectedType) setStep('template')
                  }}
                  className={`px-2 sm:px-3 py-1 rounded-full font-medium capitalize transition-all whitespace-nowrap ${
                    step === s
                      ? 'bg-rose-600 text-white'
                      : s === 'write' && step !== 'write'
                      ? 'text-rose-300 cursor-default'
                      : 'text-rose-500 hover:text-rose-700'
                  }`}
                >
                  {s === 'type' ? '1. Type' : s === 'template' ? '2. Template' : '3. Write'}
                </button>
              </div>
            ))}
          </div>

          {step === 'write' && (
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end w-full lg:w-auto">
              {savedShareId && (
                <>
                  {profile?.plan === 'pro' ? (
                    <button
                      onClick={() => setShowEmailModal(true)}
                      className="text-xs sm:text-sm px-3 sm:px-4 py-2 border border-rose-200 text-rose-700 rounded-xl hover:bg-rose-50 transition-colors whitespace-nowrap"
                    >
                      📧 Email
                    </button>
                  ) : (
                    <div className="relative group">
                      <button
                        disabled
                        className="text-xs sm:text-sm px-3 sm:px-4 py-2 border border-gray-200 text-gray-400 rounded-xl cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                      >
                        📧 Email <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Pro</span>
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                        Email delivery is a Pro feature. Upgrade to send letters by email.
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="text-xs sm:text-sm px-3 sm:px-4 py-2 border border-rose-200 text-rose-700 rounded-xl hover:bg-rose-50 transition-colors whitespace-nowrap"
                  >
                    🔗 Share
                  </button>
                  <Link
                    href={`/letter/${savedShareId}`}
                    target="_blank"
                    className="text-xs sm:text-sm px-3 sm:px-4 py-2 bg-rose-100 text-rose-700 rounded-xl hover:bg-rose-200 transition-colors whitespace-nowrap"
                  >
                    👁 Preview
                  </Link>
                </>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="text-xs sm:text-sm px-4 sm:px-5 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50 font-medium whitespace-nowrap"
              >
                {isSaving ? 'Publishing...' : savedShareId ? '💾 Update' : '🚀 Publish'}
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Reply banner */}
        {showReplyBanner && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-3 text-sm flex items-center justify-between gap-4 shadow-sm">
            <p className="text-rose-700/80">
              ✍️ Writing back{replyToName ? <> to <strong>{replyToName}</strong></> : null} — we&apos;ve filled in the names for you.
            </p>
            <button
              onClick={() => setShowReplyBanner(false)}
              className="shrink-0 text-rose-400 hover:text-rose-600 transition-colors text-lg leading-none"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Anon banner */}
        {!user && (
          <div className="mb-6 bg-white border border-rose-100 rounded-2xl px-5 py-3 text-sm flex items-center justify-between gap-4 shadow-sm">
            <p className="text-rose-700/80">✍️ Writing as a guest — <strong>1 letter per day</strong>. Your letter expires in 7 days.</p>
            <div className="flex gap-2 shrink-0">
              <Link href="/auth/signup" className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 transition-colors font-medium">Sign up free</Link>
              <Link href="/auth/login" className="text-xs border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">Sign in</Link>
            </div>
          </div>
        )}

        {/* Letter count warning (logged-in) */}
        {profile && profile.letter_count >= 8 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-5 py-3 text-sm">
            ⚠️ You&apos;ve used {profile.letter_count}/10 letters this month. {10 - profile.letter_count} remaining — resets on a rolling 30-day basis.
          </div>
        )}

        {/* Step 1: Type Selection */}
        {step === 'type' && (
          <div className="fade-in">
            <div className="text-center mb-10">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-rose-900 mb-3">
                Write a Free Love Letter Online
              </h1>
              <p className="text-rose-700/60 max-w-xl mx-auto">
                Our free love letter generator helps you write something beautiful in minutes.
                Choose the occasion, pick a template, and share it as a sealed envelope — no account needed.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {LETTER_TYPES.map(type => (
                <LetterTypeCard
                  key={type.id}
                  type={type}
                  selected={selectedType === type.id}
                  onClick={() => handleTypeSelect(type.id)}
                />
              ))}
            </div>

            {/* SEO copy */}
            <div className="mt-16 max-w-2xl mx-auto text-center border-t border-rose-100 pt-10">
              <h2 className="font-serif text-xl font-bold text-rose-900 mb-4">
                Free letter templates for every occasion
              </h2>
              <p className="text-sm text-rose-700/60 leading-relaxed mb-3">
                Whether you need a romantic love letter for her or him, a heartfelt birthday letter,
                an anniversary letter, a sincere apology, or a thank-you note for a friend or parent —
                start from one of our 30 free templates and make it your own with custom fonts, colors,
                and photos.
              </p>
              <p className="text-sm text-rose-700/60 leading-relaxed">
                Every letter is free to write and share: your recipient opens a private link and finds a
                sealed envelope with their name on it. Add a password to keep it just between you two,
                or write anonymously — no signup required. Need inspiration first? Browse our{' '}
                <Link href="/quotes" className="text-rose-600 underline hover:text-rose-800">700+ free quotes</Link>{' '}
                or read our <Link href="/blog" className="text-rose-600 underline hover:text-rose-800">letter-writing guides</Link>.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Template Selection */}
        {step === 'template' && (
          <div className="fade-in">
            <div className="text-center mb-10">
              <div className="text-4xl mb-3">{selectedTypeData?.emoji}</div>
              <h1 className="font-serif text-4xl font-bold text-rose-900 mb-3">
                Choose a template
              </h1>
              <p className="text-rose-700/60">Start with a template or write from scratch</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Blank option */}
              <button
                onClick={handleBlankStart}
                className="p-5 rounded-2xl border-2 border-dashed border-rose-200 text-left hover:border-rose-400 hover:bg-rose-50/50 transition-all"
              >
                <div className="text-2xl mb-2">✍️</div>
                <h3 className="font-serif font-semibold text-rose-900 mb-1">Start from Scratch</h3>
                <p className="text-sm text-rose-700/60 italic">Write your own unique letter</p>
              </button>

              {templates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  selected={selectedTemplate === template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                />
              ))}
            </div>

            <button
              onClick={() => setStep('type')}
              className="text-rose-500 hover:text-rose-700 text-sm flex items-center gap-1 transition-colors"
            >
              ← Back to letter types
            </button>
          </div>
        )}

        {/* Step 3: Write */}
        {step === 'write' && (
          <div className="fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Meta fields */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-paper border border-rose-100">
                  <h3 className="font-serif font-semibold text-rose-900 mb-4 flex items-center gap-2">
                    {selectedTypeData?.emoji} Letter Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-rose-600 mb-1">Title (optional)</label>
                      <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="My love letter..."
                        className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-rose-600 mb-1">To (recipient name) <span className="text-rose-400">*</span></label>
                      <input
                        value={recipientName}
                        onChange={e => setRecipientName(e.target.value)}
                        placeholder="Sarah..."
                        className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-rose-600 mb-1">From (your name) <span className="text-rose-400">*</span></label>
                      <input
                        value={senderName}
                        onChange={e => setSenderName(e.target.value)}
                        placeholder="Your name..."
                        className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30"
                      />
                    </div>

                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-paper border border-rose-100">
                  <h3 className="font-serif font-semibold text-rose-900 mb-1">⏳ Open on a future date</h3>
                  <p className="text-xs text-rose-700/60 mb-3 leading-relaxed">
                    Keep the letter sealed until the day you choose. Until then the link shows a countdown — perfect for
                    an anniversary, a birthday, or a letter to your future self.
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={scheduled}
                      onChange={e => {
                        setScheduled(e.target.checked)
                        if (e.target.checked && !openAt) {
                          const d = new Date()
                          d.setDate(d.getDate() + 7)
                          d.setHours(9, 0, 0, 0)
                          setOpenAt(toLocalInput(d.toISOString()))
                        }
                        if (e.target.checked) sendGAEvent('event', 'schedule_enabled')
                      }}
                      className="w-4 h-4 accent-rose-600"
                    />
                    <span className="text-sm text-rose-800">Schedule this letter</span>
                  </label>
                  {scheduled && (
                    <input
                      type="datetime-local"
                      value={openAt}
                      min={minLocalInput()}
                      onChange={e => setOpenAt(e.target.value)}
                      className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30 text-rose-900"
                    />
                  )}
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-paper border border-rose-100">
                  <h3 className="font-serif font-semibold text-rose-900 mb-3">🎨 Theme</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {THEMES.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSelectedTheme(t.id)
                          if (t.id !== DEFAULT_THEME_ID) {
                            sendGAEvent('event', 'theme_selected', { theme: t.id })
                          }
                        }}
                        className={`rounded-xl p-2 border text-left transition-all ${
                          selectedTheme === t.id
                            ? 'ring-2 ring-rose-400 border-rose-300'
                            : 'border-rose-100 hover:border-rose-300'
                        }`}
                      >
                        <div
                          className="h-8 rounded-lg mb-1.5 border border-black/5"
                          style={{ backgroundColor: t.paper }}
                        />
                        <span className="text-xs text-rose-800 font-medium">{t.emoji} {t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-paper border border-rose-100">
                  <h3 className="font-serif font-semibold text-rose-900 mb-3">💡 Tips</h3>
                  <ul className="text-xs text-rose-700/60 space-y-2">
                    <li>• Write from the heart — authenticity is everything</li>
                    <li>• Use specific memories and details</li>
                    <li>• Add photos to make it more personal</li>
                    <li>• Take your time — there&apos;s no rush</li>
                  </ul>
                </div>

                <button
                  onClick={() => setStep('template')}
                  className="text-rose-500 hover:text-rose-700 text-sm flex items-center gap-1 transition-colors"
                >
                  ← Back to templates
                </button>
              </div>

              {/* Right: Editor */}
              <div className="lg:col-span-2">
                <Editor
                  key={editId || 'new'}
                  content={content}
                  onChange={setContent}
                  paperColor={getTheme(selectedTheme).paper}
                  textColor={getTheme(selectedTheme).text}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {showShareModal && savedShareId && (
        <ShareModal shareId={savedShareId} onClose={() => setShowShareModal(false)} showPasswordSetup initialHasPassword={letterHasPassword} senderName={senderName} />
      )}
      {showEmailModal && savedShareId && (
        <EmailModal shareId={savedShareId} senderName={senderName} onClose={() => setShowEmailModal(false)} />
      )}
    </div>
  )
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-rose-400">Loading...</div></div>}>
      <WritePageInner />
    </Suspense>
  )
}
