'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { LETTER_TYPES, TEMPLATES, getTemplatesForType } from '@/lib/templates'
import { THEMES, DEFAULT_THEME_ID, getTheme } from '@/lib/themes'
import { BOUQUETS } from '@/lib/bouquets'
import { isSupportedSongUrl } from '@/lib/song'
import BouquetArt from '@/components/BouquetArt'
import LetterTypeCard from '@/components/LetterTypeCard'
import TemplateCard from '@/components/TemplateCard'
import ShareModal from '@/components/ShareModal'
import EmailModal from '@/components/EmailModal'
import FaqBlock from '@/components/FaqBlock'
import { useAuth } from '@/components/AuthProvider'
import FinishingTouchesGate from '@/components/FinishingTouchesGate'
import { setPendingDraft, takePendingDraft } from '@/lib/claim'
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

// Optional sidebar section. On desktop it renders exactly like a plain card
// (heading + content, always open). Below `lg` it becomes an accordion row so
// the editor isn't buried under six cards on mobile.
function OptionCard({
  id,
  title,
  state,
  order,
  headingClass,
  children,
}: {
  id: string
  title: string
  state?: string
  order: string
  headingClass: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-paper border border-rose-100 ${order} lg:order-none`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="lg:hidden w-full min-h-[44px] flex items-center justify-between gap-3 text-left rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
      >
        <span className="font-serif font-semibold text-rose-900">{title}</span>
        <span className="flex items-center gap-2 shrink-0">
          {state && <span className="text-xs text-rose-700/60">{state}</span>}
          <svg
            className={`w-4 h-4 text-rose-400 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <h3 className={`hidden lg:block ${headingClass}`}>{title}</h3>
      <div id={id} className={`${open ? 'mt-3' : 'hidden'} lg:block lg:mt-0`}>
        {children}
      </div>
    </div>
  )
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
  const [selectedBouquet, setSelectedBouquet] = useState<string | null>(null)
  const [songUrl, setSongUrl] = useState('')
  const [scheduled, setScheduled] = useState(false)
  const [openAt, setOpenAt] = useState('')
  const [showReplyBanner, setShowReplyBanner] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedShareId, setSavedShareId] = useState<string | null>(null)
  const [letterHasPassword, setLetterHasPassword] = useState(false)

  const [showShareModal, setShowShareModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showTouchesGate, setShowTouchesGate] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  // Extras a guest can compose with but not publish. Bouquet and song fall back
  // harmlessly to "publish without them"; scheduling is blocked at the toggle
  // instead, because silently sending a letter now that was meant for a future
  // date is not a fallback, it is the wrong outcome.
  const guestExtras: string[] = []
  if (!authLoading && !user) {
    if (selectedBouquet) guestExtras.push('your bouquet')
    if (songUrl.trim()) guestExtras.push('your song')
    if (scheduled && openAt) guestExtras.push('your delivery date')
  }

  const editId = searchParams.get('edit')
  const replyTo = searchParams.get('replyTo')
  const replyToName = searchParams.get('to') || ''

  // Returning from a signup that was triggered by the finishing-touches gate:
  // put the letter back exactly as it was, extras included. Only for a signed-in
  // user, and never over an edit of an existing letter.
  useEffect(() => {
    if (authLoading || !user || editId) return
    const draft = takePendingDraft()
    if (!draft) return
    setSelectedType(draft.selectedType)
    setContent(draft.content)
    setTitle(draft.title)
    setRecipientName(draft.recipientName)
    setSenderName(draft.senderName)
    setSelectedTheme(draft.selectedTheme)
    setSelectedBouquet(draft.selectedBouquet)
    setSongUrl(draft.songUrl)
    setScheduled(draft.scheduled)
    setOpenAt(draft.openAt)
    toast.success('Your letter is back — finishing touches included 💐')
    sendGAEvent('event', 'finishing_touches_draft_restored')
  }, [authLoading, user, editId])

  useEffect(() => {
    if (!editId && replyTo) {
      // Reply flow: pre-fill names swapped from the original letter
      if (replyToName) setRecipientName(replyToName)
      const from = searchParams.get('from')
      if (from) setSenderName(from)
      setShowReplyBanner(true)
      sendGAEvent('event', 'letter_reply_started')
    }
    // Deep link from the letter-themes page: ?theme=vintage preselects a theme
    // (works with or without a type; editing loads the letter's own theme instead)
    if (!editId) {
      const themeParam = searchParams.get('theme')
      if (themeParam && THEMES.some(t => t.id === themeParam)) setSelectedTheme(themeParam)
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
          setSelectedBouquet(letter.bouquet || null)
          setSongUrl(letter.song_url || '')
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
      // Deep link from an occasion page: ?type=love&template=love-1 opens the editor directly
      const templateId = searchParams.get('template')
      const template = templateId ? TEMPLATES.find(t => t.id === templateId && t.type === selectedType) : null
      if (template) {
        setSelectedTemplate(template.id)
        setContent(template.content)
        setStep('write')
      } else {
        setStep('template')
      }
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

  const handleSave = async (opts?: { dropExtras?: boolean }) => {
    const dropExtras = opts?.dropExtras === true
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
    if (songUrl.trim() && !isSupportedSongUrl(songUrl)) {
      toast.error('Song link must be from Spotify, Apple Music or YouTube')
      return
    }
    // The letter is written and valid — this is the moment of highest
    // commitment and the only place a guest is asked for an account. They can
    // always publish without the extras, so this can never cost us a letter.
    if (!dropExtras && guestExtras.length > 0 && !savedShareId) {
      sendGAEvent('event', 'finishing_touches_gate_shown', { extras: guestExtras.join(',') })
      setShowTouchesGate(true)
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
          open_at: !dropExtras && scheduled && openAt ? new Date(openAt).toISOString() : null,
          bouquet: dropExtras ? null : selectedBouquet,
          song_url: dropExtras ? null : (songUrl.trim() || null),
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
    <div className="write-page min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Nav */}
      <nav className="no-print sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-rose-100">
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
                onClick={() => window.print()}
                className="text-xs sm:text-sm px-3 sm:px-4 py-2 border border-rose-200 text-rose-700 rounded-xl hover:bg-rose-50 transition-colors whitespace-nowrap"
                title="Print this letter"
              >
                🖨️ Print
              </button>
              <button
                onClick={() => handleSave()}
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
          <div className="no-print mb-6 bg-white border border-rose-100 rounded-2xl px-5 py-3 text-sm flex items-center justify-between gap-4 shadow-sm">
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
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-rose-900 mb-3">
                Write a Free Love Letter Online
              </h2>
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
                start from one of our {TEMPLATES.length} free templates and make it your own with custom fonts, colors,
                and photos. For romance specifically, the{' '}
                <Link href="/letters/love" className="text-rose-600 underline hover:text-rose-800">love letter templates</Link>{' '}
                are written out in full as fill-in-the-blank letters you can copy.
              </p>
              <p className="text-sm text-rose-700/60 leading-relaxed">
                Every letter is free to write and share: your recipient opens a private link and finds a
                sealed envelope with their name on it. Add a password to keep it just between you two,
                or write anonymously — no signup required. Need inspiration first? Browse our{' '}
                <Link href="/quotes" className="text-rose-600 underline hover:text-rose-800">700+ free quotes</Link>,{' '}
                browse <Link href="/letters" className="text-rose-600 underline hover:text-rose-800">letters by occasion</Link>{' '}
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
              <h2 className="font-serif text-4xl font-bold text-rose-900 mb-3">
                Choose a template
              </h2>
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
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-6">
              {/* Left: Meta fields. `contents` on mobile so each card is a flex
                  item that can be ordered around the single editor instance. */}
              <div className="write-side contents lg:block lg:col-span-1 lg:space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-paper border border-rose-100 order-1 lg:order-none">
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

                <OptionCard
                  id="opt-flowers"
                  title="💐 Send flowers too"
                  state={selectedBouquet ? (BOUQUETS.find(b => b.id === selectedBouquet)?.label || 'None') : 'None'}
                  order="order-3"
                  headingClass="font-serif font-semibold text-rose-900 mb-1"
                >
                  <p className="text-xs text-rose-700/60 mb-3 leading-relaxed">
                    Optional. A bouquet blooms on screen right after the envelope opens — and it never wilts.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBouquet(null)}
                      className={`rounded-xl p-2 border text-center transition-all ${
                        selectedBouquet === null
                          ? 'ring-2 ring-rose-400 border-rose-300'
                          : 'border-rose-100 hover:border-rose-300'
                      }`}
                    >
                      <div className="h-14 flex items-center justify-center text-rose-300 text-xl">✕</div>
                      <span className="text-[11px] text-rose-800 font-medium">None</span>
                    </button>
                    {BOUQUETS.map(b => (
                      <button
                        key={b.id}
                        type="button"
                        title={b.note}
                        onClick={() => {
                          setSelectedBouquet(b.id)
                          sendGAEvent('event', 'bouquet_selected', { bouquet: b.id })
                        }}
                        className={`rounded-xl p-2 border text-center transition-all ${
                          selectedBouquet === b.id
                            ? 'ring-2 ring-rose-400 border-rose-300'
                            : 'border-rose-100 hover:border-rose-300'
                        }`}
                      >
                        <BouquetArt bouquet={b} className="h-14 w-auto mx-auto" />
                        <span className="text-[11px] text-rose-800 font-medium">{b.label}</span>
                      </button>
                    ))}
                  </div>
                </OptionCard>

                <OptionCard
                  id="opt-song"
                  title="🎵 Attach your song"
                  state={songUrl.trim() && isSupportedSongUrl(songUrl) ? 'Song attached' : 'None'}
                  order="order-4"
                  headingClass="font-serif font-semibold text-rose-900 mb-1"
                >
                  <p className="text-xs text-rose-700/60 mb-3 leading-relaxed">
                    Optional. Paste a Spotify, Apple Music or YouTube link and they can play it right under the letter.
                  </p>
                  <input
                    value={songUrl}
                    onChange={e => setSongUrl(e.target.value)}
                    onBlur={() => {
                      if (songUrl.trim() && isSupportedSongUrl(songUrl)) {
                        sendGAEvent('event', 'song_attached')
                      }
                    }}
                    placeholder="https://open.spotify.com/track/..."
                    className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30"
                  />
                  {songUrl.trim() && (
                    <p className={`text-xs mt-2 ${isSupportedSongUrl(songUrl) ? 'text-green-600' : 'text-rose-500'}`}>
                      {isSupportedSongUrl(songUrl)
                        ? '✓ Song attached — it appears below the letter'
                        : 'That link isn’t recognised. Use a Spotify, Apple Music or YouTube link.'}
                    </p>
                  )}
                </OptionCard>

                <OptionCard
                  id="opt-schedule"
                  title="⏳ Open on a future date"
                  state={
                    scheduled && openAt
                      ? new Date(openAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Not scheduled'
                  }
                  order="order-5"
                  headingClass="font-serif font-semibold text-rose-900 mb-1"
                >
                  <p className="text-xs text-rose-700/60 mb-3 leading-relaxed">
                    Keep the letter sealed until the day you choose. Until then the link shows a countdown — perfect for
                    an anniversary, a birthday, or a letter to your future self.
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={scheduled}
                      disabled={!authLoading && !user}
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
                      className="w-4 h-4 accent-rose-600 disabled:opacity-40"
                    />
                    <span className={`text-sm ${!authLoading && !user ? 'text-rose-800/50' : 'text-rose-800'}`}>
                      Schedule this letter
                    </span>
                  </label>
                  {/* Blocked at the toggle rather than at publish: a guest link
                      expires 7 days out, so a letter scheduled for months away
                      could not survive to be delivered. */}
                  {!authLoading && !user && (
                    <p className="text-xs text-rose-500 leading-relaxed">
                      Scheduling needs a free account — it&apos;s how we keep the letter alive until
                      its date and tell you when it lands.{' '}
                      <a
                        href="/auth/signup"
                        onClick={() => sendGAEvent('event', 'schedule_gate_clicked')}
                        className="underline font-medium hover:text-rose-700"
                      >
                        Create one free
                      </a>
                    </p>
                  )}
                  {scheduled && user && (
                    <input
                      type="datetime-local"
                      value={openAt}
                      min={minLocalInput()}
                      onChange={e => setOpenAt(e.target.value)}
                      className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/30 text-rose-900"
                    />
                  )}
                </OptionCard>

                <OptionCard
                  id="opt-theme"
                  title="🎨 Theme"
                  state={getTheme(selectedTheme).label}
                  order="order-6"
                  headingClass="font-serif font-semibold text-rose-900 mb-3"
                >
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
                </OptionCard>

                <OptionCard
                  id="opt-tips"
                  title="💡 Tips"
                  order="order-7"
                  headingClass="font-serif font-semibold text-rose-900 mb-3"
                >
                  <ul className="text-xs text-rose-700/60 space-y-2">
                    <li>• Write from the heart — authenticity is everything</li>
                    <li>• Use specific memories and details</li>
                    <li>• Add photos to make it more personal</li>
                    <li>• Take your time — there&apos;s no rush</li>
                  </ul>
                </OptionCard>

                <button
                  onClick={() => setStep('template')}
                  className="text-rose-500 hover:text-rose-700 text-sm flex items-center gap-1 transition-colors order-8 lg:order-none"
                >
                  ← Back to templates
                </button>
              </div>

              {/* Right: Editor — single instance, moved above the optional cards on mobile */}
              <div className="lg:col-span-2 order-2 lg:order-none">
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

      {showTouchesGate && (
        <FinishingTouchesGate
          extras={guestExtras}
          onClose={() => setShowTouchesGate(false)}
          onPublishWithout={() => {
            setShowTouchesGate(false)
            handleSave({ dropExtras: true })
          }}
          onBeforeSignup={() =>
            setPendingDraft({
              selectedType,
              content,
              title,
              recipientName,
              senderName,
              selectedTheme,
              selectedBouquet,
              songUrl,
              scheduled,
              openAt,
            })
          }
        />
      )}

      {showShareModal && savedShareId && (
        <ShareModal shareId={savedShareId} onClose={() => setShowShareModal(false)} showPasswordSetup initialHasPassword={letterHasPassword} senderName={senderName} />
      )}
      {showEmailModal && savedShareId && (
        <EmailModal shareId={savedShareId} senderName={senderName} onClose={() => setShowEmailModal(false)} />
      )}
    </div>
  )
}

// Server-rendered explainer that ships in the initial HTML. The compose tool
// above is entirely client-side behind a Suspense boundary, so without this the
// site's primary conversion page has almost no readable content — for a crawler
// or for anyone arriving cold and wondering what this is.
const WRITE_GUIDE: { heading: string; body: string[] }[] = [
  {
    heading: 'How it works',
    body: [
      'You write the letter here, choose how it should look, and publish it. What you get back is a private link. Send that link however you like — message, email, a note with a QR code — and the person on the other end opens it to a sealed envelope with their name on it, which unfolds when they click. They need no app and no account.',
      'Nothing is posted publicly. There is no feed, no profile, no archive of letters other people can browse. The link is the only way in, and you decide who has it.',
    ],
  },
  {
    heading: 'What you can add to a letter',
    body: [
      'A letter can carry more than text: a photograph, a theme that changes the paper and envelope, a bouquet that blooms when the envelope opens, and a song link that becomes a playable card underneath the letter. None of it is required, and a plain letter with nothing attached is still the most common thing people send.',
      'You can also set an opening date. Until that moment arrives the link shows a sealed envelope and a live countdown, and the letter itself is never decrypted or served — which makes it work for an anniversary, a birthday, a graduation, or a letter to your own future self.',
    ],
  },
  {
    heading: 'Privacy, plainly',
    body: [
      'Every letter is encrypted at rest with AES-256, which means it is unreadable in our own database. Letters are never indexed by search engines and never appear in any public listing. You can add a password so that even someone who obtains the link cannot open it.',
      'You do not need an account to write or send, and you can still send without revealing who you are. The one real difference is what happens afterwards: a guest link stays live for 7 days and then expires, and a guest never finds out whether the letter was opened. With a free account the letter is kept for 30 days, your dashboard shows when it was opened and any replies it received, and we email you the first time it is opened and whenever a reply arrives.',
    ],
  },
  {
    heading: 'Not sure what to write?',
    body: [
      'The most common obstacle is the blank page rather than the feeling. Two things help: start with one specific memory instead of a statement of how you feel, and write to the person rather than about them. Feeling arrives on its own once a concrete detail is on the page; it rarely arrives if you begin by trying to summarise it.',
      'If you want a structure, the templates in the editor give you an opening line for each kind of letter, and the <a href="/letters">letters by occasion</a> guides walk through what to say for anniversaries, apologies, thank-yous, farewells and the rest. If you are not sure which letter you owe someone, the <a href="/quizzes/what-letter-should-you-write">Which Letter Should You Write? quiz</a> takes about two minutes.',
    ],
  },
]

const WRITE_FAQS = [
  {
    q: 'Is ShareLove Letters free?',
    a: 'Yes — writing and sharing a letter is completely free. Every template, the editor, photo uploads, letter themes, scheduled delivery, bouquets and private links are included, with no coins, subscriptions or credit card required.',
  },
  {
    q: 'Do I need an account to send a letter?',
    a: 'No. You can write and share a letter as a guest with no sign-up at all. An account is optional and only changes what happens after you send: a guest link expires after 7 days, while a free account keeps the letter for 30 days and emails you when it is opened and when a reply arrives. You can create one after sending and keep the letter you just wrote.',
  },
  {
    q: 'Is my letter private and encrypted?',
    a: 'Yes. Every letter is encrypted at rest with bank-grade AES-256, so it is unreadable even in our own database. Letters are never public, indexed or searchable, and you can add a password so only your recipient can open it.',
  },
  {
    q: 'How does the recipient open the letter?',
    a: 'When you publish, you get a private link to send however you like. Your recipient opens it to a sealed envelope with their name on it, and it unfolds with a gentle opening animation — no app and no account needed on their side.',
  },
  {
    q: 'Can I send a love letter anonymously?',
    a: 'Yes. You can write and share a letter without an account and without revealing who you are. Pair it with password protection for a truly private, secret letter that only reaches the person you intend.',
  },
]

export default function WritePage() {
  return (
    <>
      {/* Always server-rendered H1 for crawlers: the interactive compose UI below
          lives behind a Suspense/useSearchParams boundary that renders client-side
          only, so this guarantees /write ships exactly one H1 in the initial HTML. */}
      <h1 className="sr-only">Write a Free Love Letter Online</h1>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-rose-400">Loading...</div></div>}>
        <WritePageInner />
      </Suspense>
      {/* Rendered outside the Suspense boundary so the FAQ + FAQPage JSON-LD ship in
          the initial server HTML (same guarantee as the H1 above). Sits below the
          full-height compose tool, so it never interferes with the editor UX. */}
      <div className="no-print bg-gradient-to-br from-rose-50 to-pink-50 border-t border-rose-100 pt-16">
        <div className="max-w-2xl mx-auto px-6 pb-4">
          {WRITE_GUIDE.map(s => (
            <section key={s.heading} className="pb-8">
              <h2 className="font-serif text-2xl font-bold text-rose-900 mb-4">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p
                  key={i}
                  className="text-rose-800/75 leading-relaxed mb-4 [&_a]:text-rose-600 [&_a]:underline hover:[&_a]:text-rose-700"
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              ))}
            </section>
          ))}
        </div>
        <FaqBlock faqs={WRITE_FAQS} />
      </div>
    </>
  )
}
